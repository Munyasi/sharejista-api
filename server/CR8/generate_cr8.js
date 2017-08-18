'use strict';
let Promise = require('bluebird');
let async = require('async');
let app = require('../server');
let _ = require('underscore');
let fs = require('fs');
let path = require('path');
let JSZip = require('jszip');
let Docxtemplater = require('docxtemplater');
let uuid = require('uuid/v4');

function generateCR8 (companyId, from, to, cb) {
	// pull PersonChanges for the company
	// group by directorId
	let PersonChanges = app.models.PersonChanges;
	let Person = app.models.Person;
	let Company = app.models.Company;
	let CR7 = app.models.CR7;
	let template_path = '../templates/CR8.docx';
	let output_path = '../output/CR8s';
	let NA = 'NA';
	let map = {
		'street': 'Street',
		'house_number': 'House number',
		'building_name': 'Building name',
		'estate': 'Estate'
	};

	let findCompanyPromise = Company.findById(companyId, {
		fields: ['company_name', 'registration_no'],
		include: ['CompanyType']
	});

	findCompanyPromise.then(function (company) {
		let findChangesPromise = PersonChanges.find({
			where: {
				companyId: companyId,
				and: [{date_modified: {gte: from}}, {date_modified: {lte: to}}],
				or: [
					{key: 'street'},
					{key: 'house_number'},
					{key: 'building_name'},
					{key: 'estate'}]
			},
			include: ['Person']
		});

		findChangesPromise.then(function (personChanges) {
			if (personChanges.length > 0) {
				personChanges = JSON.parse(JSON.stringify(personChanges));
				let persons = compilePersonsChanges(personChanges);

				let findSecPromise = Person.findOne({
					where: {
						company_id: companyId, person_type: 'Secretary'
					}
				});

				findSecPromise.then(function (secretary) {
					processCR8(company, secretary, persons);
				});

				findSecPromise.catch((err) => { cb(err);});
			}
			else {
				return cb(null, {
					success: 0,
					message: 'There no residential changes for directors to be filed within the specified dates.'
				});
			}

		});

		findChangesPromise.catch((err) => {cb(err);});
	});

	findCompanyPromise.catch((err) => { cb(err);});

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

	function formatCR8Data (company, secretary) {
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
		console.log(company.CompanyType.name);
		return {
			company_name: company.company_name,
			registration_no: company.registration_no,
			dated: `${today.getDate()}/${(today.getMonth() + 1)}/${today.getFullYear()}`,
			company_type: company.CompanyType.name,
			secretary_name: secName,
			secretary_postal_code: secPostalCode,
			secretary_box: secPostalBox,
			secretary_town: secTown,
			secretary_email: secEmail,
			secretary_phone: secPhoneNo
		};
	}

	function createCR8Form (data) {
		let content = fs.readFileSync(path.resolve(__dirname, template_path), 'binary');
		let zip = new JSZip(content);
		let doc = new Docxtemplater();
		doc.loadZip(zip);
		doc.setData(data);

		try {
			doc.render();
			let buf = doc.getZip().generate({type: 'nodebuffer'});
			let token = uuid().toString().substring(0, 7);
			let fileName = `CR8-${data.company_name}-${token}.docx`;
			fs.writeFileSync(path.resolve(__dirname, `${output_path}/${fileName}`), buf);
			return fileName;
		}
		catch (error) { cb(error);}
	}

	function processCR8 (company, secretary, persons) {
		let itemsPerForm = 5;
		// if items found are more than itemsPerForm
		// they have to be output into n forms
		// n = Math.ceil(directors.length/itemsPerForm)
		let groupCount = Math.ceil(persons.length / itemsPerForm);
		let data = formatCR8Data(company, secretary);
		let formsPath = [];

		for (let i = 0; i < groupCount; i++) {
			data.directors = persons.slice(i * itemsPerForm, (i + 1) * itemsPerForm);
			let fileName = createCR8Form(data);
			formsPath.push(fileName);
		}

		let cr8 = {
			from: new Date(from),
			to: new Date(to),
			type: 'CR8',
			date: new Date(),
			companyId: companyId
		};

		function createCR8ItemTask (formPath, callback) {
			cr8.name = formPath;
			let createCR8Promise = CR7.create(cr8);
			createCR8Promise.then((cr6Item) => { callback(null, cr6Item); });
			createCR8Promise.catch((err) => { callback(err); });
		}

		function finalize (err) {
			if (err) cb(err);
			else
				return cb(null, {
					success: 1,
					message: `CR8 form for  ${company.company_name} created successfully.`,
					paths: formsPath
				});
		}

		async.each(formsPath, createCR8ItemTask, finalize);
	}
}

module.exports = generateCR8;