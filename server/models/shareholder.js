'use strict'
let generateList = require('../shareholders/generate_list');
let afterRemoteFindById = require('../shareholders/after-remote-find-by-id');
let generateMembersLedger = require('../shares-ledger/members-ledger');
let generateMemberLedger = require('../shares-ledger/member-ledger');
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
	});

	Shareholder.afterRemote('findById', afterRemoteFindById);


    Shareholder.generateMembersLedger = generateMembersLedger;

    Shareholder.remoteMethod('generateMembersLedger', {
        accepts: [
            {arg: 'company_id', type: 'number', required: true},
		],
        returns: {arg: 'data', type: 'Object'},
        http: {path: '/generateMembersLedger', verb: 'get'}
    });

    Shareholder.generateMemberLedger= generateMemberLedger;

    Shareholder.remoteMethod('generateMemberLedger', {
        accepts: [
            {arg: 'company_id', type: 'string', required: true},
            {arg: 'member_id', type: 'string', required: true}
        ],
        returns: {arg: 'data', type: 'Object'},
        http: {path: '/generateMemberLedger', verb: 'get'}
    });
}
