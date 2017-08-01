'use strict';
let generateCR7 = require('../CR7/generate_cr7');
module.exports = function(Cr7) {
	Cr7.generateCR7 = generateCR7;
	Cr7.remoteMethod('generateCR7', {
		accepts: [
			{arg: 'companyId', type: 'string', required: true},
			{arg: 'from', type: 'string', required: true},
			{arg: 'to', type: 'string', required: true},
		],
		returns: {arg: 'data', type: 'Object'},
		http: {path: '/generateCR7', verb: 'post'}
	});
};