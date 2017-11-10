'use strict';

/**
 * Helper function for running queries
 * @param query {string} SQL query to be executed
 * @param dataSource An instance of Loopback dataSource
 * @param queryParams {Array} Query parameters in the order the are in the query
 * @returns {Promise}
 */
function executeQuery(query, dataSource, queryParams = []) {
	const p = (resolve, reject) => {
		dataSource.connector.query(query, queryParams, (err, results) => {
			if(err)
				reject(err);
			resolve(results);
		});
	};

	return new Promise(p);
}

module.exports = executeQuery;