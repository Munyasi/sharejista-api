'use strict';
let Promise = require('bluebird');
let app = require('../server');
let _ = require('underscore');
let fs = require('fs');
let path = require('path');
let JSZip = require('jszip');
let Docxtemplater = require('docxtemplater');

function generateCR7 (companyId, from, to, cb) {
	let PersonChanges = app.models.PersonChanges;
	let Person = app.models.Person;
	let Company = app.models.Company;
	let CR7 = app.models.CR7;
	let template_path = '../templates/CR7.docx';
	let output_path = '../output/CR7s';
	let NA = 'NA';
	let map = {
		'surname': 'Surname',
		'other_names': 'Names',
		'salutation': 'Title',
		'email_address': 'Email address',
		'phone_number': 'Phone number',
		'id_number': 'ID number',
		'occupation': 'Occupation',
		'kra_pin': 'KRA Pin',
		'date_of_birth': 'Date of Birth',
		'box': 'P.O Box',
		'postal_code': 'Postal code',
		'appointment_date': 'Appointment date',
		'resignation_date': 'Resignation date',
		'person_type': '',
		'town': 'Town',
		'street': 'Street',
		'house_number': 'House number',
		'building_name': 'Building name',
		'estate': 'Estate'
	};

	// pull PersonChanges for the company
	// group by directorId
	let findCompanyPromise = Company.findById(companyId, {fields: ['company_name', 'registration_no']});

	findCompanyPromise.then(function (company) {
		let findChangesPromise = PersonChanges.find({
			where: {
				companyId: companyId,
				and: [{date_modified: {gte: from}}, {date_modified: {lte: to}}]
			}, include: ['Person']
		});
		findChangesPromise.then((personChanges) => {
			if (personChanges.length > 0) {
				personChanges = JSON.parse(JSON.stringify(personChanges));
				let persons = compilePersonsChanges(personChanges);

				// get the company secretary
				let findSecPromise = Person.findOne({
					where: {
						company_id: companyId,
						person_type: 'Secretary'
					}
				});

				findSecPromise.then(function (secretary) {
					let data = formatCR7Data(company.company_name, company.registration_no, secretary, persons);
					createCR7Form(data);
				});

				findSecPromise.catch(function (err) { cb(err); });
			}
			else {
				cb(null, {
					success: 0,
					message: 'There no changes for directors to be filed with the specified dates.'
				});
			}
		});

		findChangesPromise.catch(function (err) { cb(err);});
	});

	findCompanyPromise.catch(function (err) { cb(err);});

	function compilePersonsChanges (personChanges) {
		personChanges = _.groupBy(personChanges, 'personId');
		let persons = [];
		_.each(personChanges, function (personChange) {
			personChange = _.groupBy(personChange, 'key');
			let person = {};
			person.fields = [];
			_.each(personChange, function (change) {
				person.name = `${change[0].Person.salutation} ${change[0].Person.surname} ${change[0].Person.other_names}`;
				// sort by date modified, latest first
				change = _.sortBy(change, 'date_modified').reverse();
				// pick latest change, first
				let latestChange = change[0];
				let fieldObj = {};
				fieldObj.id = latestChange.Person.id;
				fieldObj.key = latestChange.key;
				fieldObj.value = latestChange.value;
				fieldObj.name = map[latestChange.key];
				let d = new Date(latestChange.date_modified);
				fieldObj.date = `${d.getDate()}/${(d.getMonth() + 1)}/${d.getFullYear()}`;

				person.fields.push(fieldObj);
			});
			persons.push(person);
		});

		return persons;
	}

	function formatCR7Data (company_name, registration_no, secretary, directors) {
		let secName = NA;
		let secPostalCode = NA;
		let secPostalBox = NA;
		let secTown = NA;
		let secEmail = NA;
		let secPhoneNo = NA;

		if (secretary !== null) {
			secName = `${secretary.surname} ${secretary.other_names}`;
			secPostalCode = secretary.postal_code;
			secPostalBox = secretary.box;
			secTown = secretary.town;
			secEmail = secretary.email_address;
			secPhoneNo = secretary.phone_number;
		}

		let today = new Date();
		return {
			company_name: company_name,
			registration_no: registration_no,
			directors: directors,
			dated: `${today.getDate()}/${(today.getMonth() + 1)}/${today.getFullYear()}`,
			secretary_name: secName,
			secretary_postal_code: secPostalCode,
			secretary_box: secPostalBox,
			secretary_town: secTown,
			secretary_email: secEmail,
			secretary_phone: secPhoneNo
		};
	}

	function createCR7Form (data) {
		let content = fs.readFileSync(path.resolve(__dirname, template_path), 'binary');
		let zip = new JSZip(content);
		let doc = new Docxtemplater();
		doc.loadZip(zip);
		doc.setData(data);

		try {
			doc.render();
			let buf = doc.getZip().generate({type: 'nodebuffer'});
			let date = Date.now().toString();
			let fileName = `CR7-${data.company_name}-${date}.docx`;
			fs.writeFileSync(path.resolve(__dirname, `${output_path}/${fileName}`), buf);
			let cr7 = {
				name: fileName,
				from: new Date(from),
				to: new Date(to),
				type: 'CR7',
				date: new Date(),
				companyId: companyId
			};

			let createCR7Promise = CR7.create(cr7);
			createCR7Promise.then(() => {
				cb(null, {
					success: 1,
					message: `CR7 form for  ${data.company_name} created successfully.`,
					path: fileName
				});
			});

			createCR7Promise.catch((err) => { cb(err); });
		}

		catch (error) { cb(error); }
	}
}

module.exports = generateCR7;