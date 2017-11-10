'use strict';
const executeQuery = require('../utils/execute-query');

/**
 * Get CR6 data
 * @param companyId Company ID
 * @param from From date
 * @param to To date
 * @param dataSource Loopback model data source instance
 * @returns {Promise}
 */
function getCR6Data (companyId, from, to, dataSource) {
	let sql = getCR6query();

	return executeQuery(sql,dataSource,  [companyId, from, to]);
}


/**
 * Helper function for CR6 query
 * @returns {string}
 */
function getCR6query () {
	let sql = `
		SELECT
			surname, 
		    other_names,
		    salutation,
		    former_names,
		    email_address, 
		    phone_number,
		    other_names,
		    postal_code,
		    box,
		    town,
		    nationality,
		    id_number,
		    occupation,
		    date_of_birth,
		    area_code,
		    phone_number,
		    email_address,
		    consent
		FROM Person 
		WHERE (company_id=?) 
		AND (
			DATE(appointment_date) >=? AND 
			DATE(appointment_date) <=?)
		AND (person_type='Director')`;

	return sql;
}

module.exports = getCR6Data;
