'use strict';
let generateCR9 = require('../CR9/generate_cr9');
module.exports = function(Cr9) {
	Cr9.generateCR9 = generateCR9;
	Cr9.remoteMethod('generateCR9', {
		accepts: [
			{arg: 'companyId', type: 'string', required: true},
			{arg: 'from', type: 'string', required: true},
			{arg: 'to', type: 'string', required: true},
		],
		returns: {arg: 'data', type: 'Object'},
		http: {path: '/generateCR9', verb: 'post'}
	});
};
