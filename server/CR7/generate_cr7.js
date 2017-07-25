'use strict';
let Promise = require('bluebird');
let app = require('../server');
let _ = require('underscore');
let fs = require('fs')
let path = require('path')
let JSZip = require('jszip')
let Docxtemplater = require('docxtemplater');
function generateCR7(companyId, from, to, cb){
	// pull PersonChanges for the company
	// group by directorId
	let PersonChanges = app.models.PersonChanges;
	let Person = app.models.Person;
	let Company = app.models.Company;
	let template_path = '../templates/CR7.docx'
	let output_path = '../output/CR7s'
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
	}
	Company.findById(companyId, { fields: ['company_name', 'registration_no']})
		.then(function (company) {
			console.log(company);
			PersonChanges.find({where: { companyId: companyId, and:[{date_modified:{ gte: from}},{date_modified:{ lte: to }} ]}, include: ['Person']})
				.then(function (personChanges) {
					personChanges =  JSON.parse(JSON.stringify(personChanges));
					personChanges = _.groupBy(personChanges, 'personId');
					let persons = [];
					_.each(personChanges, function (personChange) {
						personChange = _.groupBy(personChange,'key');
						let person = {};
						person.fields = [];
						_.each(personChange, function (change) {
							person.name = `${change[0].Person.salutation} ${change[0].Person.surname} ${change[0].Person.other_names}`;
							// sort by date modified, latest first
							change =  _.sortBy(change, 'date_modified').reverse();
							// pick latest change, first
							let latestChange = change[0];
							console.log(latestChange.date_modified);
							let fieldObj =  {};
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

					let content = fs.readFileSync(path.resolve(__dirname, template_path), 'binary');
					let zip = new JSZip(content);
					let doc = new Docxtemplater();
					doc.loadZip(zip);
					let today = new Date();

					let data = {
						company_name: company.company_name,
						registration_no: company.registration_no,
						directors: persons,
						dated: `${today.getDate()}/${(today.getMonth() + 1)}/${today.getFullYear()}`
					}
					doc.setData(data);

					try {
						doc.render();
						let buf = doc.getZip().generate({type: 'nodebuffer'})
						let date = Date.now().toString();
						fs.writeFileSync(path.resolve(__dirname, `${output_path}/CR7-${company.company_name}-${date}.docx`), buf);
						cb(null, persons);
					}
					catch (error) {
						let e = {
							message: error.message,
							name: error.name,
							stack: error.stack,
							properties: error.properties,
						}
						cb(e);
					}
				})
				.catch(function (err) {
					console.log(err)
				});
		})
		.catch(function (err) {
			cb(err);
		});
}

module.exports = generateCR7;