'use strict';
let generateCR6 = require('../CR6/generate_cr6');
module.exports = function(Cr6) {
	Cr6.generateCR6 = generateCR6;
	Cr6.remoteMethod('generateCR6', {
		accepts: [
			{arg: 'companyId', type: 'string', required: true},
			{arg: 'from', type: 'string', required: true},
			{arg: 'to', type: 'string', required: true},
		],
		returns: {arg: 'data', type: 'Object'},
		http: {path: '/generateCR6', verb: 'post'}
	});
};
