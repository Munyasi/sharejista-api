'use strict';
let app = require('../../server/server');
let Promise = require('bluebird');

function searchCompany (search_string,limit = null, skip = null, cb) {
	let Company = app.models.Company;

	let where = {
		or: [
				{
					company_name: {like: `%${search_string}%`}
				},
				{
					registration_no: {like: `%${search_string}%`}
				}
		]
	};

	let count = Company.count(where); // gets the total search results, without LIMIT
	let find = Company.find({
		where: where,
		include: 'CompanyType',
		limit: limit,
		skip: skip
	});

	let p = Promise.all([find, count]);
	p.then( results => {
		let companies = results[0];
		let total = results[1];
		let response = {
			companies: companies,
			total: total
		};

		cb(null, response);
	});

	p.catch( err => cb(err));
}

module.exports = searchCompany;