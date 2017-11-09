'use strict';
let generateCR9 = require('../CR9/generate-cr9');
let generateCR9ById = require('../CR9/get-cr9-by-id');

module.exports = function(Cr9) {
	Cr9.generateCR9 = generateCR9;
	Cr9.generateCR9ById = generateCR9ById;

	Cr9.remoteMethod('generateCR9', {
		accepts: [
			{arg: 'companyId', type: 'string', required: true},
			{arg: 'from', type: 'string', required: true},
			{arg: 'to', type: 'string', required: true},
		],
		returns: {arg: 'data', type: 'Object'},
		http: {path: '/generateCR9', verb: 'post'}
	});

	Cr9.remoteMethod('generateCR9ById', {
		accepts: [
			{arg: 'cr9Id', type: 'number', required: true}
		],
		returns: {arg: 'data', type: 'Object'},
		http: {path: '/generateCR9ById', verb: 'post'}
	});
};
