'use strict';
let Promise = require('bluebird');
let app = require('../server');
let _ = require('underscore');
let fs = require('fs');
let path = require('path');
let JSZip = require('jszip');
let Docxtemplater = require('docxtemplater');

function generateCR9 (companyId, from, to, cb) {
	let Person = app.models.Person;
	let Company = app.models.Company;
	let CR9 = app.models.CR9;
	let template_path = '../templates/CR9.docx';
	let output_path = '../output/CR9s';
	let NA = 'NA';
	let ds = Person.dataSource;

	let sql = `
	SELECT 
	    salutation,
	    surname,
	    salutation,
	    other_names,
	    resignation_date
	FROM Person
	WHERE (company_id=?) 
	AND (person_type = 'Director')
	AND (
		DATE(resignation_date) >=? AND
		DATE(resignation_date) <= ?
	)`;

	let findCompanyPromise = Company.findById(companyId, {
		fields: ['id','company_name', 'registration_no','company_type_id'],
		include: ['CompanyType']
	});

	findCompanyPromise.then(function (company) {
		company = JSON.parse(JSON.stringify(company));
		ds.connector.query(sql, [companyId,from, to], handleResults);

		function handleResults (err,directors) {
			if(err) return cb(err);
			if (directors.length > 0) {
				directors = compileDirectors(directors);
				// get the company secretary
				let findSecPromise = Person.findOne({
					where: {
						company_id: companyId,
						person_type: 'Secretary'
					}
				});

				findSecPromise.then(function (secretary) {
					let company_type = company.CompanyType.name.toString().toUpperCase();
					let data = formatCR9Data(company.company_name, company.registration_no,company_type, secretary, directors);
					createCR9Form(data);
				});

				findSecPromise.catch(function (err) { cb(err); });
			}
			else {
				cb(null, {
					success: 0,
					message: 'There no directors that ceased office within the specified dates.'
				});
			}
		}
	});

	findCompanyPromise.catch(function (err) { cb(err);});

	function compileDirectors (directors) {
		let persons = [];
		_.each(directors, function (director) {
			let person = {};
			person.name = `${director.salutation} ${director.surname} ${director.other_names}`.toUpperCase();
			let d = new Date(director.resignation_date);
			person.res_date = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
			persons.push(person);
		});

		return persons;
	}

	function formatCR9Data (company_name, registration_no,company_type, secretary, directors) {
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
			secCountry = secretary.country;
		}

		let today = new Date();
		return {
			company_name: company_name.toUpperCase(),
			registration_no: registration_no.toUpperCase(),
			company_type: company_type,
			directors: directors,
			dated: `${today.getDate()}/${(today.getMonth() + 1)}/${today.getFullYear()}`,
			secretary_name: secName.toUpperCase(),
			secretary_postal_code: secPostalCode,
			secretary_box: secPostalBox,
			secretary_town: secTown.toUpperCase(),
			secretary_email: secEmail,
			secretary_phone: secPhoneNo,
			secretary_country: secCountry.toUpperCase()
		};
	}

	function createCR9Form (data) {
		let content = fs.readFileSync(path.resolve(__dirname, template_path), 'binary');
		let zip = new JSZip(content);
		let doc = new Docxtemplater();
		doc.loadZip(zip);
		doc.setData(data);

		try {
			doc.render();
			let buf = doc.getZip().generate({type: 'nodebuffer'});
			let date = Date.now().toString();
			let fileName = `CR9-${data.company_name}-${date}.docx`;
			fs.writeFileSync(path.resolve(__dirname, `${output_path}/${fileName}`), buf);
			let cr9 = {
				name: fileName,
				from: new Date(from),
				to: new Date(to),
				date: new Date(),
				companyId: companyId
			};

			let createCR9Promise = CR9.create(cr9);
			createCR9Promise.then(() => {
				cb(null, {
					success: 1,
					message: `CR9 form for  ${data.company_name} created successfully.`,
					path: fileName
				});
			});

			createCR9Promise.catch((err) => { cb(err); });
		}
		catch (error) { cb(error); }
	}
}

module.exports = generateCR9;