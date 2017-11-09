'use strict';
let Promise = require('bluebird');
let app = require('../server');
let fs = require('fs');
let path = require('path');
let uuid = require('uuid/v4');
let async = require('async');
let getCR6Data = require('./get-cr6-data');
let createCR6Documents = require('./create-cr6-documents');
let formatSecretary = require('../utils/format-secretary-data');

function generateCR6 (companyId, from, to, cb) {
	let Company = app.models.Company;
	let Person = app.models.Person;
	let ds = Person.dataSource;

	let findCompanyPromise = Company.findById(companyId, {
		fields: ['id', 'company_type_id', 'company_name', 'registration_no'],
		include: ['CompanyType']
	});

	let findSecretaryPromise = Person.findOne({
		where: {
			company_id: companyId,
			person_type: 'Secretary'
		}
	});

	let getCR6DataPromise = getCR6Data(companyId, from, to, ds);

	let p = Promise.all([findCompanyPromise, findSecretaryPromise, getCR6DataPromise]);

	p.then(results => {
		let company = results[0];
		let secretary = results[1];
		let directors = results[2];

		if (directors.length > 0) {
			company = JSON.parse(JSON.stringify(company));
			secretary = JSON.parse(JSON.stringify(secretary));
			directors = JSON.parse(JSON.stringify(directors));

			secretary = formatSecretary(secretary);
			directors = formatDirectors(directors);

			// format data
			let cr6data = formatCR6Data(company, secretary, directors);
			//save CR6 item
			let create = createCR6Item(companyId, from, to, cr6data);
			create.then(cr6item => {
				//create CR6 documents
				let paths = createCR6Documents(cr6data);
				cb(null, paths);
			});

			create.catch(err => cb(err));
		}
		else {
			cb(null, {
				success: 0,
				message: 'There no directors appointed within the specified dates.'
			});
		}
	});

	p.catch(err => cb(err));
}

/**
 * Format each director: date of birth and number them
 * @param directors
 * @returns {*}
 */
function formatDirectors (directors) {
	let NA = 'NA';
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
 * @param directors Array of directors data objects
 * @returns {{company_name: string, registration_no: string, company_type, dated: string, secretary_name: string,
  * secretary_postal_code: string, secretary_box: string, secretary_town: string,
  * secretary_email: string, secretary_phone: string}}
 */
function formatCR6Data (company, secretary, directors) {
	let today = new Date();

	return {
		company_id: company.id,
		company_name: company.company_name.toUpperCase(),
		registration_no: company.registration_no.toUpperCase(),
		company_type: company.CompanyType.name.toUpperCase(),
		dated: `${today.getDate()}/${(today.getMonth() + 1)}/${today.getFullYear()}`,
		secretary_name: secretary.secretary_name,
		secretary_postal_code: secretary.secretary_postal_code,
		secretary_box: secretary.secretary_box,
		secretary_town: secretary.secretary_town,
		secretary_email: secretary.secretary_email,
		secretary_phone: secretary.secretary_phone,
		secretary_country: secretary.secretary_country,
		directors: directors
	};
}

/**
 * create a CR6 item
 * @param company_id
 * @param from
 * @param to
 * @param data
 * @returns Promise
 */
function createCR6Item (company_id, from, to, data) {
	let CR6 = app.models.CR6;
	let company_name = data.company_name || ' ';
	let token = uuid().toString().substring(0, 7);
	let name = `CR6-${company_name}-${token}`;
	let cr6 = {
		name: name,
		from: new Date(from),
		to: new Date(to),
		date: new Date(),
		companyId: company_id,
		data_object: JSON.stringify(data)
	};

	return CR6.create(cr6);
}

module.exports = generateCR6;