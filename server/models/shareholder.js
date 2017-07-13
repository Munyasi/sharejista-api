'use strict'
var generateList = require('../shareholders/generate_list');
module.exports = function (Shareholder) {
	Shareholder.generatelist = generateList;

	Shareholder.remoteMethod('generatelist', {
		accepts: [
			{arg: 'company_id', type: 'string', required: true},
			{arg: 'res', type: 'object', 'http': {source: 'res'}}
		],
		returns: {arg: 'data', type: 'Object'},
		http: {path: '/generatelist', verb: 'get'}
	})
}
