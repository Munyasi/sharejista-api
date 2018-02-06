'use strict';

let generateShareCertificate = require('../sharetransfer/generate-share-certificate');

module.exports = function(Shares) {
  Shares.generateShareCertificate = generateShareCertificate;
  Shares.remoteMethod('generateShareCertificate', {
    accepts: [
      {arg: 'shareEntryId', type: 'number', required: true}
    ],
    returns: {arg: 'data', type: 'Object'},
    http: {path: '/generate-share-certificate', verb: 'get'}
  });
};
