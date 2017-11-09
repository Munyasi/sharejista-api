'use strict';
let Promise = require('bluebird');
let app = require('../server');
let fs = require('fs');
let path = require('path');
let uuid = require('uuid/v4');

let getCR7Data = require('./get-cr7-data');
let createCR7Document = require('./create-cr7-document');
let formatSecretary = require('../utils/format-secretary-data');
let compilePersonsChanges = require('./compile-persons-changes');

function generateCR7 (companyId, from, to, cb) {
	let PersonChanges = app.models.PersonChanges;
	let Person = app.models.Person;
	let Company = app.models.Company;
	let ds = PersonChanges.dataSource;

	let getCR7DataPromise = getCR7Data(companyId, from, to, ds);
	let findCompanyPromise = Company.findById(companyId, {
		fields: ['id','company_name', 'registration_no','company_type_id'],
		include: ['CompanyType']
	});

	let findSecPromise = Person.findOne({
		where: {
			company_id: companyId,
			person_type: 'Secretary'
		}
	});

	let p = Promise.all([getCR7DataPromise, findCompanyPromise, findSecPromise]);

	p.then( results => {
		handlePromise(results, companyId, from, to, cb);
	});

	p.catch( err => cb(err));
}

function handlePromise (results, companyId,from, to, cb) {
	let personChanges = JSON.parse(JSON.stringify(results[0]));
	let company =  JSON.parse(JSON.stringify(results[1]));
	let secretary = JSON.parse(JSON.stringify(results[2]));

	if (personChanges.length > 0) {
		let persons = compilePersonsChanges(personChanges);
		secretary = formatSecretary(secretary);
		let data = formatCR7Data(company, secretary, persons);
		let p = createCR7Item(companyId, from, to, data);

		p.then( item => {
			try {
				let fileName = createCR7Document(data);
				cb(null, {
					success: 1,
					path: fileName
				});
			}
			catch(err){
				cb(err);
			}
		});

		p.catch( err => cb(err));
	}
	else {
		cb(null, {
			success: 0,
			message: 'There no changes for directors to be filed with the specified dates.'
		});
	}
}


function formatCR7Data (company, secretary, directors) {
	let today = new Date();
	let data = {
		company_id: company.id,
		company_name: company.company_name.toUpperCase(),
		registration_no: company.registration_no.toUpperCase(),
		company_type: company.CompanyType.name.toUpperCase(),
		directors: directors,
		dated: `${today.getDate()}/${(today.getMonth() + 1)}/${today.getFullYear()}`,
		secretary_name: secretary.secretary_name,
		secretary_postal_code: secretary.secretary_postal_code,
		secretary_box: secretary.secretary_box,
		secretary_town: secretary.secretary_town,
		secretary_email: secretary.secretary_email,
		secretary_phone: secretary.secretary_phone,
		secretary_country: secretary.secretary_country
	};

	return data;
}

function createCR7Item(companyId, from, to, data) {
	let CR7 = app.models.CR7;
	let company_name = data.company_name || ' ';
	let token = uuid().toString().substring(0, 7);
	let name = `CR7-${company_name}-${token}`;

	let cr7 = {
		name: name,
		from: new Date(from),
		to: new Date(to),
		type: 'CR7',
		date: new Date(),
		companyId: companyId,
		data_object:  JSON.stringify(data)
	};

	return CR7.create(cr7);
}

module.exports = generateCR7;