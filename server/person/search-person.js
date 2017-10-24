'use strict';
let app = require('../../server/server');
let Promise = require('bluebird');

function searchPerson (search_string, company_id, limit = null, skip = null, cb) {
	let Person = app.models.Person;

	let where = {
		company_id: company_id,
		or: [
				{
					surname: { like: `%${search_string}%` }
				},
				{
					other_names: { like: `%${search_string}%` }
				},
				{
					salutation: { like: `%${search_string}%` }
				},
				{
					email_address: {like: `%${search_string}%`}
				},
				{
					phone_number: { like: `%${search_string}%` }
				},
				{
					nationality: { like: `%${search_string}%` }
				},
				{
					town: { like: `%${search_string}%` }
				},
				{
					person_type: { like: `%${search_string}%` }
				}
			]
	};

	let count = Person.count(where); // gets the total search results, without LIMIT
	let find = Person.find({
		where: where,
		limit: limit,
		skip: skip
	});

	let p = Promise.all([find, count]);
	p.then( results => {
		let officers = results[0];
		let total = results[1];
		let response = {
			officers: officers,
			total: total
		};

		cb(null, response);
	});

	p.catch( err => cb(err));
}

module.exports = searchPerson;