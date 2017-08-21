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
	let ds = Person.dataSource;
		let sql = `
		SELECT
			surname, 
		    other_names,
		    salutation,
		    former_names,
		    email_address, 
		    phone_number,
		    other_names,
		    postal_code,
		    box,
		    town,
		    nationality,
		    id_number,
		    occupation,
		    date_of_birth,
		    area_code,
		    phone_number,
		    email_address,
		    consent
		FROM Person 
		WHERE (company_id=?) 
		AND (
			DATE(appointment_date) >=? AND 
			DATE(appointment_date) <=?)
		AND (person_type='Director')`;

	let findCompanyPromise = Company.findById(companyId, {
		fields: ['id', 'company_type_id', 'company_name', 'registration_no'],
		include: ['CompanyType']
	});

	findCompanyPromise.then((company) => {
		// select directors whose appointment date lies within
		// from and to dates
		// TODO: Add 'Alternate Directors'
		ds.connector.query(sql, [companyId, from, to], function (err, directors) {
			if(err) return cb(err);
			if (directors.length > 0) {
				company = JSON.parse(JSON.stringify(company));
				directors = JSON.parse(JSON.stringify(directors));
				directors = formatDirectors(directors);

				// get the company secretary
				let secretaryPromise = Person.findOne({
					where: {
						company_id: companyId,
						person_type: 'Secretary'
					}
				});

				secretaryPromise.then((secretary) => {
					processCR6(company, secretary, directors);
				});

				secretaryPromise.catch((err) => { cb(err);});
			}
			else {
				return cb(null, {
					success: 0,
					message: 'There no directors appointed within the specified dates.'
				});
			}
		});
	});

	findCompanyPromise.catch((err) => { cb(err);});

	/**
	 * Format each director: date of birth and number them
	 * @param directors
	 * @returns {*}
	 */
	function formatDirectors (directors) {
		for (let i = 0; i < directors.length; i++) {
			let d = directors[i];
			d.num = i + 1;
			let dob = new Date(d.date_of_birth);
			d.dob = `${dob.getDate()}/${dob.getMonth() + 1}/${dob.getFullYear()}`;

			Object.keys(d).forEach(function (key) {
				if (d[key] === null && d.hasOwnProperty(key)) d[key] = NA;
			});
		}

		return directors;
	}

	/**
	 * Format data for CR6 form
	 * @param company
	 * @param secretary
	 * @returns {{company_name: *, registration_no: *, company_type, dated: string, secretary_name: string, secretary_postal_code: string, secretary_box: string, secretary_town: string, secretary_email: string, secretary_phone: string}}
	 */
	function formatCR6Data (company, secretary) {
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
		return  {
			company_name: company.company_name.toUpperCase(),
			registration_no: company.registration_no.toUpperCase(),
			company_type: company.CompanyType.name.toUpperCase(),
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

	/**
	 * Create a CR6 form
	 * @param data Object with keys for CR6 template
	 * @returns {string} Filename of CR6 file created
	 */
	function createCR6Form (data) {
		let content = fs.readFileSync(path.resolve(__dirname, template_path), 'binary');
		let zip = new JSZip(content);
		let doc = new Docxtemplater();
		doc.loadZip(zip);
		doc.setData(data);

		try {
			doc.render();
			let buf = doc.getZip().generate({type: 'nodebuffer'});
			let token = uuid().toString().substring(0, 7);
			let fileName = `CR6-${data.company_name}-${token}.docx`;
			fs.writeFileSync(path.resolve(__dirname, `${output_path}/${fileName}`), buf);
			return fileName;
		}
		catch (error) { cb(error); }
	}

	/**
	 * Combine all the elements for CR6 form
	 * @param company
	 * @param secretary
	 * @param directors
	 */
	function processCR6(company, secretary,directors) {
		let itemsPerForm = 5;
		// if items found are more than itemsPerForm
		// they have to be output into n forms
		// n = Math.ceil(directors.length/itemsPerForm)
		let groupCount = Math.ceil(directors.length / itemsPerForm);
		let data = formatCR6Data(company, secretary);
		let formsPath = [];

		for (let i = 0; i < groupCount; i++) {
			data.directors = directors.slice(i * itemsPerForm, (i + 1) * itemsPerForm);
			let filePath = createCR6Form(data);
			formsPath.push(filePath);
		}

		let cr6 = {
			from: new Date(from),
			to: new Date(to),
			date: new Date(),
			companyId: companyId
		};

		function createCRItemTask (formPath, callback) {
			cr6.name = formPath;
			let createCR6 = CR6.create(cr6);
			createCR6.then((cr6Item) => { callback(null, cr6Item); });
			createCR6.catch((err) => { callback(err); });
		}

		function finalize (err) {
			if (err) cb(err);
			else
				return cb(null, {
					success: 1,
					message: `CR6 form for  ${company.company_name} created successfully.`,
					paths: formsPath
				});
		}

		async.each(formsPath, createCRItemTask, finalize);
	}
}

module.exports = generateCR6;