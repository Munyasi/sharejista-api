'use strict';
let app = require('../../server/server');
let searchShareholder = require('../shareholders/search-shareholder');
let Promise = require('bluebird');

function searchAllotment (search_string, company_id, transferer_type, limit = null, skip = null, cb) {
	let ShareTransfer = app.models.ShareTransfer;

	let where = {
		company_id: company_id,
		transferer_type: transferer_type,
		or: [
				{
					number_of_shares: { like: `%${search_string}%` }
				},
				{
					payment_status: { like: `%${search_string}%` }
				},
				{
					par_value: { like: `%${search_string}%` }
				},
				{
					payment_type: { like: `%${search_string}%` }
				}
		]
	};

	let s = searchShareholders(search_string, company_id);
	s.then( ids => {
		if(ids.length > 0)
			where.or.push({ transferee_id: { inq: ids } });

		let count = ShareTransfer.count(where); // gets the total search results, without LIMIT
		let find = ShareTransfer.find({
			where: where,
			include: ['transferee','transferer', 'sharetype'],
			limit: limit,
			skip: skip
		});

		let p = Promise.all([find, count]);
		p.then( results => {
			let allotments = results[0];
			let total = results[1];
			let response = {
				shareallotments: allotments,
				total: total
			};

			cb(null, response);
		});

		p.catch( err => cb(err));
	});

	s.catch( err => cb(err));

	function searchShareholders (search_term, company_id) {
		return new Promise( (resolve, reject) => {
			searchShareholder(search_term, company_id, null, null, (err, results) => {
				if(err)
					reject(err);
				else {
					if(results.shareholders)
						resolve(results.shareholders.map( shareholder =>  shareholder.id ));
					else
						resolve([]);
				}
			});
		});
	}
}

module.exports = searchAllotment;