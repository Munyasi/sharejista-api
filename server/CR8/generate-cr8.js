'use strict';
const async = require('async');
const app = require('../server');
const fs = require('fs');
const uuid = require('uuid/v4');
const moment = require('moment');

const getCR8Data = require('./get-cr8-data');
const compilePersonsChanges = require('./compile-persons-changes');
const formatSecretary = require('../utils/format-secretary-data');
const createCR8Documents = require('./create-cr8-documents');

function generateCR8 (companyId, from, to, cb) {
	from = new Date(from);
	from = moment(new Date(from)).format('YYYY-MM-DD HH:mm:ss');
	to = moment(new Date(to)).format('YYYY-MM-DD HH:mm:ss');

	const PersonChanges = app.models.PersonChanges;
	const Person = app.models.Person;
	const Company = app.models.Company;
	const NA = 'NA';
	const ds = PersonChanges.dataSource;

	const findCompanyPromise = Company.findById(companyId, {
		fields: ['id','company_name', 'registration_no','company_type_id'],
		include: ['CompanyType']
	});

	const findSecPromise = Person.findOne({
		where: {
			company_id: companyId, person_type: 'Secretary'
		}
	});

	const getCR8DataPromise = getCR8Data(ds, companyId, from, to);

	const p = Promise.all([findCompanyPromise, findSecPromise, getCR8DataPromise]);

	p.then( results => { _generateCR8(companyId, from, to, results, cb); });

	p.catch( err => cb(err));
}

function _generateCR8 (companyId, from, to, results, cb) {
	let company = JSON.parse(JSON.stringify(results[0]));
	let secretary = JSON.parse(JSON.stringify(results[1]));
	let personChanges = JSON.parse(JSON.stringify(results[2]));

	if (company === null) {
		cb( null, {
			success: 0,
			message: 'Company information not found. Please try again.'
		});
	}

	if (personChanges.length > 0) {
		let persons = compilePersonsChanges(personChanges);
		secretary = formatSecretary(secretary);
		let cr8data = formatCR8Data(company, secretary, persons);

		const create = createCR8Item(companyId, from, to, cr8data);

		create.then( () => {
			let paths = createCR8Documents(cr8data);

			cb( null, {
				success: 1,
				message: `CR8 form for  ${company.company_name} created successfully.`,
				paths: paths
			});
		});
	}
	else {
		return cb( null, {
			success: 0,
			message: 'There no residential changes for directors to be filed within the specified dates.'
		});
	}
}

/**
 * Format CR8 data
 * @param company
 * @param secretary
 * @param persons
 * @returns {{company_name, registration_no, dated: string, company_type: string, secretary_name: *, secretary_postal_code: *,
  * secretary_box: *, secretary_town: *, secretary_email: *, secretary_phone: *, secretary_country: *, directors: *}}
 */
function formatCR8Data (company, secretary, persons) {
	let today = new Date();
	return {
		company_name: company.company_name.toUpperCase(),
		registration_no: company.registration_no.toUpperCase(),
		dated: `${today.getDate()}/${(today.getMonth() + 1)}/${today.getFullYear()}`,
		company_type: company.CompanyType.name.toString().toUpperCase(),
		secretary_name: secretary.secretary_name,
		secretary_postal_code: secretary.secretary_postal_code,
		secretary_box: secretary.secretary_box,
		secretary_town: secretary.secretary_town,
		secretary_email: secretary.secretary_email,
		secretary_phone: secretary.secretary_phone,
		secretary_country: secretary.secretary_country,
		directors: persons
	};
}

/**
 * create a CR8 item
 * @param companyId
 * @param from
 * @param to
 * @param data
 * @returns Promise
 */
function createCR8Item (companyId, from, to, data) {
	let CR7 = app.models.CR7;
	let company_name = data.company_name || ' ';
	let token = uuid().toString().substring(0, 7);
	let name = `CR6-${company_name}-${token}`;
	let cr8 = {
		name: name,
		from: new Date(from),
		to: new Date(to),
		type: 'CR8',
		date: new Date(),
		companyId: companyId,
		data_object: JSON.stringify(data)
	};

	return CR7.create(cr8);
}

module.exports = generateCR8;