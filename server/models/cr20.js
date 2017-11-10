'use strict';
const generateCR20 = require('../CR20/generate-cr20');
const generateCR20ById = require('../CR20/get-cr20-by-id');

module.exports = function(Cr20) {
	Cr20.generateCR20 = generateCR20;
	Cr20.generateCR20ById = generateCR20ById;

	Cr20.remoteMethod('generateCR20', {
		accepts: [
			{arg: 'companyId', type: 'string', required: true},
			{arg: 'from', type: 'string', required: true},
			{arg: 'to', type: 'string', required: true},
		],
		returns: {arg: 'data', type: 'Object'},
		http: {path: '/generateCR20', verb: 'post'}
	});

	Cr20.remoteMethod('generateCR20ById', {
		accepts: [
			{arg: 'cr20Id', type: 'number', required: true}
		],
		returns: {arg: 'data', type: 'Object'},
		http: {path: '/generateCR20ById', verb: 'post'}
	});
};
