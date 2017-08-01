'use strict';
let getShareTypes = require('../sharetypes/get-share-types');

module.exports = function(Sharetype) {
    Sharetype.getShareTypes = getShareTypes ;
    Sharetype.remoteMethod('getShareTypes', {
        returns: {arg: 'data', type: 'Object'},
        http: {path: '/getShareTypes', verb: 'get'}
    })
};
