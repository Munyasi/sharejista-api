'use strict';
let generateCR6 = require('../CR6/generate-cr6');
let generateCR6ById = require('../CR6/generate-cr6-by-id');

module.exports = function(Cr6) {
	Cr6.generateCR6 = generateCR6;
	Cr6.generateCR6ById = generateCR6ById;

	Cr6.remoteMethod('generateCR6', {
		accepts: [
			{arg: 'companyId', type: 'string', required: true},
			{arg: 'from', type: 'string', required: true},
			{arg: 'to', type: 'string', required: true},
		],
		returns: {arg: 'data', type: 'Object'},
		http: {path: '/generateCR6', verb: 'post'}
	});

	Cr6.remoteMethod('generateCR6ById', {
		accepts: [
			{arg: 'cr6Id', type: 'number', required: true}
		],
		returns: {arg: 'data', type: 'Object'},
		http: {path: '/generateCR6ById', verb: 'post'}
	});
};
