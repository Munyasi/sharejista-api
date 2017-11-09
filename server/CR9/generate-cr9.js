'use strict';
let Promise = require('bluebird');
let app = require('../server');
let _ = require('underscore');
let fs = require('fs');
let path = require('path');
let uuid = require('uuid/v4');

let formatSecretary = require('../utils/format-secretary-data');
let getCR9Data = require('./get-cr9-data');
let createCR9Document = require('./create-cr9-document');

function generateCR9 (companyId, from, to, cb) {
	let Person = app.models.Person;
	let Company = app.models.Company;
	let ds = Person.dataSource;

	let getCR9DataPromise = getCR9Data(companyId, from, to, ds);

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

	let p = Promise.all([getCR9DataPromise, findCompanyPromise, findSecPromise]);

	p.then( results => {
		handlePromise(results, companyId, from, to, cb);
	});

	p.catch( err => cb(err));
}

function handlePromise (results, companyId, from, to, cb) {
	let directors = JSON.parse(JSON.stringify(results[0]));
	let company = JSON.parse(JSON.stringify(results[1]));
	let secretary = JSON.parse(JSON.stringify(results[2]));

	if (directors.length > 0) {
		directors = compileDirectors(directors);
		secretary = formatSecretary(secretary);
		let data = formatCR9Data(company, secretary, directors);
		let itemP = createCR9Item(companyId, from, to, data);

		itemP.then( () => {
			try{
				let fileName = createCR9Document(data);
				cb(null, {
					success: 1,
					message: `CR9 form for  ${data.company_name} created successfully.`,
					path: fileName
				});
			}
			catch(err){
				cb(err);
			}
		});

		itemP.catch( err => cb(err));
	}
	else {
		cb(null, {
			success: 0,
			message: 'There no directors that ceased office within the specified dates.'
		});
	}
}

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

function formatCR9Data (company, secretary, directors) {
	let today = new Date();
	let data = {
		company_name: company.company_name.toUpperCase(),
		registration_no: company.registration_no.toUpperCase(),
		company_type: company.CompanyType.name.toString().toUpperCase(),
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

function createCR9Item(companyId, from, to, data) {
	let CR9  = app.models.CR9;
	let company_name = data.company_name || ' ';
	let token = uuid().toString().substring(0, 7);
	let name = `CR9-${company_name}-${token}`;

	let cr9 = {
		name: name,
		from: new Date(from),
		to: new Date(to),
		date: new Date(),
		companyId: companyId,
		data_object: JSON.stringify(data)
	};

	return CR9.create(cr9);
}

module.exports = generateCR9;