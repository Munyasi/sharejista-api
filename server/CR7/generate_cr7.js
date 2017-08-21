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
	let ds = PersonChanges.dataSource;
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
		'estate': 'Estate',
		'nationality': 'Nationality',
		'consent': 'Consent',
		'area_code':'Area code',
		'country':'Country',
		'former_names':'Former names'
	};

	let sql = `
	SELECT 
		PersonChanges.id,
		PersonChanges.key,
	    PersonChanges.value, 
	    PersonChanges.date_modified,
	    Person.id AS personId,
	    Person.salutation,
	    Person.surname,
	    Person.salutation,
	    Person.other_names
	FROM PersonChanges
	INNER JOIN Person on PersonChanges.personId = Person.id
	WHERE (PersonChanges.companyId=?) 
	AND (
		DATE(PersonChanges.date_modified) >=? AND
		DATE(PersonChanges.date_modified) <= ?
	)`;

	let findCompanyPromise = Company.findById(companyId, {
		fields: ['id','company_name', 'registration_no','company_type_id'],
		include: ['CompanyType']
	});

	findCompanyPromise.then(function (company) {
		company = JSON.parse(JSON.stringify(company));
		ds.connector.query(sql, [companyId,from, to], handleResults);

		function handleResults (err,personChanges) {
			if(err) return cb(err);
			if (personChanges.length > 0) {
				let persons = compilePersonsChanges(personChanges);

				// get the company secretary
				let findSecPromise = Person.findOne({
					where: {
						company_id: companyId,
						person_type: 'Secretary'
					}
				});

				findSecPromise.then(function (secretary) {
					let company_type = company.CompanyType.name.toString().toUpperCase();
					let data = formatCR7Data(company.company_name, company.registration_no,company_type, secretary, persons);
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
		}
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
				person.name = `${change[0].salutation} ${change[0].surname} ${change[0].other_names}`;
				// sort by date modified, latest first
				change = _.sortBy(change, 'date_modified').reverse();
				// pick latest change, first
				let latestChange = change[0];
				let fieldObj = {};
				fieldObj.id = latestChange.id;
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

	function formatCR7Data (company_name, registration_no, company_type, secretary, directors) {
		let secName = NA;
		let secPostalCode = NA;
		let secPostalBox = NA;
		let secTown = NA;
		let secEmail = NA;
		let secPhoneNo = NA;
		let secCountry = NA;

		if (secretary !== null) {
			secName = `${secretary.surname} ${secretary.other_names}`.toUpperCase();
			secPostalCode = secretary.postal_code;
			secPostalBox = secretary.box;
			secTown = secretary.town.toUpperCase();
			secEmail = secretary.email_address;
			secPhoneNo = secretary.phone_number;
			secCountry = secretary.country.toUpperCase();
		}

		let today = new Date();
		return {
			company_name: company_name.toUpperCase(),
			registration_no: registration_no.toUpperCase(),
			company_type: company_type,
			directors: directors,
			dated: `${today.getDate()}/${(today.getMonth() + 1)}/${today.getFullYear()}`,
			secretary_name: secName,
			secretary_postal_code: secPostalCode,
			secretary_box: secPostalBox,
			secretary_town: secTown,
			secretary_email: secEmail,
			secretary_phone: secPhoneNo,
			secretary_country: secCountry
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