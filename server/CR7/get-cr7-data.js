'use strict';
const executeQuery = require('../utils/execute-query');

/**
 * Get CR7 data
 * @param companyId Company ID
 * @param from From date
 * @param to To Date
 * @param dataSource Loopback model data source instance
 * @returns {Promise}
 */
function getCR7Data(companyId, from, to, dataSource){
	let sql = getCR7Query();

	return executeQuery(sql, dataSource, [companyId, from, to]);
}

/**
 * Helper function for CR7 query
 * @returns {string}
 */
function getCR7Query () {
	let sql = `
		SELECT 
			PersonChanges.id,
			PersonChanges.key,
		    PersonChanges.value, 
		    PersonChanges.date_modified,
		    Person.id AS personId,
		    Person.salutation,
		    Person.surname,
		    Person.salutation,
		    Person.other_names
		FROM PersonChanges
		INNER JOIN Person on PersonChanges.personId = Person.id
		WHERE (PersonChanges.companyId=?) 
		AND (
			DATE(PersonChanges.date_modified) >=? AND
			DATE(PersonChanges.date_modified) <= ?
		)`;

	return sql;
}

module.exports = getCR7Data;