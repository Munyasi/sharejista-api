'use strict'
let generateList = require('../shareholders/generate_list');
module.exports = function (Shareholder) {
	Shareholder.generatelist = generateList;

	Shareholder.remoteMethod('generatelist', {
		accepts: [
			{arg: 'company_id', type: 'string', required: true},
			{arg: 'export_config', type: 'object', required: false,  http: { source: 'body' }},
			{arg: 'res', type: 'object', 'http': {source: 'res'}}
		],
		returns: {arg: 'data', type: 'Object'},
		http: {path: '/generatelist', verb: 'post'}
	})
}
