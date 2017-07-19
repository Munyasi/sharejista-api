'use strict';

let approveTransfer = require('../sharetransfer/approve-transfer');
module.exports = function(Sharetransfer) {
	Sharetransfer.approveTransfer = approveTransfer ;
	Sharetransfer.remoteMethod('approveTransfer', {
		accepts: [
			{arg: 'sharetransfer_id', type: 'number', required: true},
		],
		returns: {arg: 'data', type: 'Object'},
		http: {path: '/approvetransfer', verb: 'get'}
	})
};
