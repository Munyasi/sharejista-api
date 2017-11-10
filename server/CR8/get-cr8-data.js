'use strict';
const executeQuery = require('../utils/execute-query');

function getCR8Data(dataSource, companyId, from, to) {
	let sql = _getCR8Query();

	return executeQuery(sql, dataSource, [companyId, from, to]);
}

function _getCR8Query() {
	return `SELECT 
		PersonChanges.id,
		PersonChanges.key,
	    PersonChanges.value, 
	    Person.id AS personId,
	    Person.salutation,
	    Person.surname,
	    Person.salutation,
	    Person.other_names,
	    Person.house_number,
	    Person.building_name,
	    Person.street,
	    Person.town,
	    Person.country
	FROM PersonChanges
	INNER JOIN Person on PersonChanges.personId = Person.id
	WHERE (PersonChanges.companyId=?) 
	AND (
		DATE(PersonChanges.date_modified) >=? AND 
		DATE(PersonChanges.date_modified) <= ?)
	AND (
	    (PersonChanges.key='street') OR 
	    (PersonChanges.key='house_number') OR 
	    (PersonChanges.key='building_name') OR 
	    (PersonChanges.key='estate') OR 
	    (PersonChanges.key='town') OR 
	    (PersonChanges.key='country')
	)`;
}

module.exports = getCR8Data;