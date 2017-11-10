'use strict';
const executeQuery = require('../utils/execute-query');
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

	return executeQuery(sql, dataSource, [companyId, from, to])
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