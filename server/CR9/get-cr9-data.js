'use strict';

/**
 * Get CR9 data
 * @param companyId Company ID
 * @param from From date
 * @param to To Date
 * @param dataSource Loopback model data source instance
 * @returns {Promise}
 */
function getCR9Data(companyId, from, to, dataSource) {
	let sql = getCR9Query();
	let p = (resolve, reject) => {
		dataSource.connector.query(sql, [companyId, from, to], (err, directors) => {
			if(err)
				reject(err);
			resolve(directors);
		});
	};

	return new Promise(p);
}

/**
 * Helper function for CR6 query
 * @returns {string}
 */
function getCR9Query() {
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

	return sql;
}

module.exports = getCR9Data;