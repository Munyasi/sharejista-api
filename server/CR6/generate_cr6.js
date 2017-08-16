'use strict';
let Promise = require('bluebird');
let app = require('../server');
let _ = require('underscore');
let fs = require('fs');
let path = require('path');
let JSZip = require('jszip');
let uuid = require('uuid/v4');
let async = require('async');
let Docxtemplater = require('docxtemplater');
function generateCR6 (companyId, from, to, cb) {
	let Company = app.models.Company;
	let Person = app.models.Person;
	let CR6 = app.models.CR6;
	let template_path = '../templates/CR6.docx';
	let output_path = '../output/CR6s';
	let NA = 'NA';
	Company.findById(companyId, {
		fields: ['id', 'company_type_id', 'company_name', 'registration_no'],
		include: ['CompanyType']
	})
	.then((company) => {
		// select directors whose appointment date lies within
		// from and to dates
		// TODO: Add 'Alternate Directors'
		Person.find({
			where: {
				company_id: companyId,
				person_type: 'Director',
				and: [{appointment_date: {gte: from}}, {appointment_date: {lte: to}}]
			}
		})
			.then((directors) => {
				if (directors.length > 0) {
					company = JSON.parse(JSON.stringify(company));
					directors = JSON.parse(JSON.stringify(directors));
					for (let i = 0; i < directors.length; i++) {
						let d = directors[i];
						d.num = i + 1;
						let dob = new Date(d.date_of_birth);
						d.dob = `${dob.getDate()}/${dob.getMonth() + 1}/${dob.getFullYear()}`;

						Object.keys(d).forEach(function (key) {
							if (d[key] === null && d.hasOwnProperty(key)) d[key] = NA;
						});
					}

					// get the company secretary
					Person.findOne({where: {company_id: companyId, person_type: 'Secretary'}})
						.then((secretary) => {
							let today = new Date();
							let itemsPerForm = 5;
							// if items found are more than itemsPerForm
							// they have to be output into n forms
							// n = Math.ceil(directors.length/itemsPerForm)

							let secName =NA;
							let secPostalCode = NA;
							let secPostalBox = NA;
							let secTown = NA;
							let secEmail = NA;
							let secPhoneNo = NA;

							if(secretary !== null){
								secName = `${secretary.surname} ${secretary.other_names}`;
								secPostalCode = secretary.postal_code;
								secPostalBox = secretary.box;
								secTown = secretary.town;
								secEmail = secretary.email_address;
								secPhoneNo = secretary.phone_number;
							}

							let groupCount = Math.ceil(directors.length / itemsPerForm);
							let formsPath = [];
							let data = {
								company_name: company.company_name,
								registration_no: company.registration_no,
								company_type: company.CompanyType.name,
								dated: `${today.getDate()}/${(today.getMonth() + 1)}/${today.getFullYear()}`,
								secretary_name: secName,
								secretary_postal_code: secPostalCode,
								secretary_box: secPostalBox,
								secretary_town: secTown,
								secretary_email: secEmail,
								secretary_phone: secPhoneNo
							};

							for (let i = 0; i < groupCount; i++) {
								let content = fs.readFileSync(path.resolve(__dirname, template_path), 'binary');
								let zip = new JSZip(content);
								let doc = new Docxtemplater();
								doc.loadZip(zip);
								data.directors = directors.slice(i * itemsPerForm, (i + 1) * itemsPerForm);
								doc.setData(data);

								try {
									doc.render();
									let buf = doc.getZip().generate({type: 'nodebuffer'});
									let token = uuid().toString().substring(0, 7);
									let fileName = `CR6-${company.company_name}-${token}.docx`;
									fs.writeFileSync(path.resolve(__dirname, `${output_path}/${fileName}`), buf);
									formsPath.push(fileName);
								}
								catch (error) {
									let e = {
										message: error.message,
										name: error.name,
										stack: error.stack,
										properties: error.properties,
									};
									cb(e);
								}
							}

							let cr6 = {
								from: new Date(from),
								to: new Date(to),
								date: new Date(),
								companyId: companyId
							};

							async.each(formsPath, (formPath, callback) => {
									cr6.name = formPath;
									CR6.create(cr6)
										.then((cr6Item) => {
											callback(null, cr6Item);
										})
										.catch((err) => {
											callback(err);
										});
								},
								(err) => {
									if (err)
										cb(err);
									else
										return cb(null, {
											success: 1,
											message: `CR6 form for  ${company.company_name} created successfully.`,
											paths: formsPath
										});
								});

						})
						.catch((error) => {
							return cb(error);
						});
				}
				else {
					return cb(null, {
						success: 0,
						message: 'There no directors appointed within the specified dates.'
					});
				}
			})
			.catch((error) => {
				return cb(error);
			});
	})
	.catch((err) => {
		cb(err);
	});
}

module.exports = generateCR6;