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
	let CR7 = app.models.CR7;
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
			PersonChanges.find({where: { companyId: companyId, and:[{ date_modified:{ gte: from}},{ date_modified: { lte: to }} ]}, include: ['Person']})
				.then(function (personChanges) {
					if(personChanges.length > 0){
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

						// get the company secretary
						Person.findOne({where: {company_id: companyId, person_type:'Secretary'}})
							.then(function (secretary) {
								let content = fs.readFileSync(path.resolve(__dirname, template_path), 'binary');
								let zip = new JSZip(content);
								let doc = new Docxtemplater();
								doc.loadZip(zip);
								let today = new Date();

								let data = {
									company_name: company.company_name,
									registration_no: company.registration_no,
									directors: persons,
									dated: `${today.getDate()}/${(today.getMonth() + 1)}/${today.getFullYear()}`,
									secretary_name: `${secretary.surname} ${secretary.other_names}`,
									secretary_postal_code: secretary.postal_code,
									secretary_box: secretary.box,
									secretary_town: secretary.town,
									secretary_email: secretary.email_address,
									secretary_phone: secretary.phone_number
								}

								doc.setData(data);

								try {
									doc.render();
									let buf = doc.getZip().generate({type: 'nodebuffer'})
									let date = Date.now().toString();
									let fileName = `CR7-${company.company_name}-${date}.docx`
									fs.writeFileSync(path.resolve(__dirname, `${output_path}/${fileName}`), buf);
									let cr7 = {
										name: fileName,
										from: new Date(from),
										to: new Date(to),
										date:new Date(),
										companyId: companyId
									};

									CR7.create(cr7)
										.then(function (cr7Item) {
											return cb(null, {success: 1, message: `CR7 form for  ${company.company_name} created successfully.`, path: fileName});
										})
										.catch(function (err) {
											return cb(err);
										})
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
								return cb(err);
							});

					}
					else{
						return cb(null, { success: 0, message:'There no changes for directors to be filed with the specified dates.'})
					}

				})
				.catch(function (err) {
					cb(err);
				});
		})
		.catch(function (err) {
			cb(err);
		});
}

module.exports = generateCR7;