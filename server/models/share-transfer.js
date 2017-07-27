'use strict';

let approveTransfer = require('../sharetransfer/approve-transfer');
let listTransfers = require('../sharetransfer/list-shares');

module.exports = function(Sharetransfer) {
	Sharetransfer.approveTransfer = approveTransfer ;
	Sharetransfer.remoteMethod('approveTransfer', {
		accepts: [
			{arg: 'sharetransfer_id', type: 'number', required: true},
            {arg: 'transferer_type', type: 'string', required: true},
            {arg: 'action', type: 'number', required: true},
		],
		returns: {arg: 'data', type: 'Object'},
		http: {path: '/approvetransfer', verb: 'get'}
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
