'use strict';
let searchPerson = require('../person/search-person');
module.exports = function(Person) {
	Person.search = searchPerson;
	Person.remoteMethod('search', {
		accepts: [
			{ arg: 'q', type: 'string', required: true},
			{ arg: 'company_id', type: 'number', required: true},
			{ arg: 'limit', type: 'number' },
			{ arg: 'skip', type: 'number'}
		],
		returns: {arg: 'data', type: 'Object'},
		http: {path: '/search', verb: 'get'}
	});
};
