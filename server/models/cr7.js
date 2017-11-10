'use strict';

const generateCR7 = require('../CR7/generate-cr7');
const generateCR8 = require('../CR8/generate-cr8');
const generateCR7ById = require('../CR7/get-cr7-by-id');
const generateCR8ById = require('../CR8/get-cr8-by-id');

module.exports = function(Cr7) {
	Cr7.generateCR7 = generateCR7;
	Cr7.generateCR8 = generateCR8;
	Cr7.generateCR7ById = generateCR7ById;
	Cr7.generateCR8ById = generateCR8ById;


	Cr7.remoteMethod('generateCR7', {
		accepts: [
			{arg: 'companyId', type: 'string', required: true},
			{arg: 'from', type: 'string', required: true},
			{arg: 'to', type: 'string', required: true},
		],
		returns: {arg: 'data', type: 'Object'},
		http: {path: '/generateCR7', verb: 'post'}
	});

	Cr7.remoteMethod('generateCR8', {
		accepts: [
			{arg: 'companyId', type: 'string', required: true},
			{arg: 'from', type: 'string', required: true},
			{arg: 'to', type: 'string', required: true},
		],
		returns: {arg: 'data', type: 'Object'},
		http: {path: '/generateCR8', verb: 'post'}
	});

	Cr7.remoteMethod('generateCR7ById', {
		accepts: [
			{arg: 'cr7Id', type: 'number', required: true}
		],
		returns: {arg: 'data', type: 'Object'},
		http: {path: '/generateCR7ById', verb: 'post'}
	});

	Cr7.remoteMethod('generateCR8ById', {
		accepts: [
			{arg: 'cr8Id', type: 'number', required: true}
		],
		returns: {arg: 'data', type: 'Object'},
		http: {path: '/generateCR8ById', verb: 'post'}
	});
};
