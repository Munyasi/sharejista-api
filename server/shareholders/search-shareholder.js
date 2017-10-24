'use strict';
let app = require('../../server/server');
let Promise = require('bluebird');

function searchShareholder (search_string, company_id, limit = null, skip = null, cb) {
	let Shareholder = app.models.Shareholder;

	let where = {
		company_id: company_id,
		or: [
			{
				name: { like: `%${search_string}%` }
			},
			{
				email_address: { like: `%${search_string}%` }
			},
			{
				id_reg_number: { like: `%${search_string}%` }
			},
			{
				town: { like: `%${search_string}%` }
			},
			{
				phone_number: { like: `%${search_string}%` }
			}
		]
	};

	let count = Shareholder.count(where); // gets the total search results, without LIMIT
	let find = Shareholder.find({
		where: where,
		limit: limit,
		skip: skip
	});

	let p = Promise.all([find, count]);
	p.then( results => {
		let shareholders = results[0];
		let total = results[1];
		let response = {
			shareholders: shareholders,
			total: total
		};

		cb(null, response);
	});

	p.catch( err => cb(err));
}

module.exports = searchShareholder;