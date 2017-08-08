'use strict';
let addCompany = require('../company/create_company');
let updateCompany = require('../company/update_company');

module.exports = function(Company) {
    Company.addCompany = addCompany ;
    Company.remoteMethod('addCompany', {
        accepts: [
            {arg: 'companyObj', type: 'object', required: true},
        ],
        returns: {arg: 'data', type: 'Object'},
        http: {path: '/addCompany', verb: 'post'}
    })

    Company.updateCompany = updateCompany;
    Company.remoteMethod('updateCompany', {
        accepts: [
            {arg: 'companyObj', type: 'object', required: true},
        ],
        returns: {arg: 'data', type: 'Object'},
        http: {path: '/updateCompany', verb: 'post'}
    })
};
