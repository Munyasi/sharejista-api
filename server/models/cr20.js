'use strict';
let generateCR20 = require('../CR20/generate_cr20');
module.exports = function(Cr20) {
	Cr20.generateCR20 = generateCR20;
	Cr20.remoteMethod('generateCR20', {
		accepts: [
			{arg: 'companyId', type: 'string', required: true},
			{arg: 'from', type: 'string', required: true},
			{arg: 'to', type: 'string', required: true},
		],
		returns: {arg: 'data', type: 'Object'},
		http: {path: '/generateCR20', verb: 'post'}
	});
};
