'use strict';

let approveTransfer = require('../sharetransfer/approve-transfer');
let approveAllotment = require('../sharetransfer/approve-allotment');
let listTransfers = require('../sharetransfer/list-transfers');
let listAllotments = require('../sharetransfer/list-allotments');

module.exports = function(Sharetransfer) {
	Sharetransfer.approveTransfer = approveTransfer ;
	Sharetransfer.remoteMethod('approveTransfer', {
		accepts: [
			{arg: 'sharetransfer_id', type: 'number', required: true},
            {arg: 'action', type: 'number', required: true},
		],
		returns: {arg: 'data', type: 'Object'},
		http: {path: '/approvetransfer', verb: 'get'}
	})

    Sharetransfer.approveAllotment = approveAllotment ;
    Sharetransfer.remoteMethod('approveAllotment', {
        accepts: [
            {arg: 'sharetransfer_id', type: 'number', required: true},
            {arg: 'action', type: 'number', required: true},
        ],
        returns: {arg: 'data', type: 'Object'},
        http: {path: '/approveallotment', verb: 'get'}
    })

    Sharetransfer.listAllotments = listAllotments;
    Sharetransfer.remoteMethod('listAllotments', {
        accepts: [
            {arg: 'company_id', type: 'number', required: true},
        ],
        returns: {arg: 'data', type: 'Object'},
        http: {path: '/list-allotments', verb: 'get'}
    })

    Sharetransfer.listTransfers = listTransfers ;
    Sharetransfer.remoteMethod('listTransfers', {
        accepts: [
            {arg: 'company_id', type: 'number', required: true},
        ],
        returns: {arg: 'data', type: 'Object'},
        http: {path: '/list-transfers', verb: 'get'}
    })
};
