'use strict';
let addCompany = require('../company/create_company');
let updateCompany = require('../company/update_company');
let annualReturn = require('../annual_return/annual_return');

module.exports = function(Company) {
    Company.addCompany = addCompany ;
    Company.remoteMethod('addCompany', {
        accepts: [
            {arg: 'companyObj', type: 'object', required: true},
        ],
        returns: {arg: 'data', type: 'Object'},
        http: {path: '/addCompany', verb: 'post'}
    });

    Company.updateCompany = updateCompany;
    Company.remoteMethod('updateCompany', {
        accepts: [
            {arg: 'companyObj', type: 'object', required: true},
        ],
        returns: {arg: 'data', type: 'Object'},
        http: {path: '/updateCompany', verb: 'post'}
    });

    Company.annualReturn = annualReturn;
	Company.remoteMethod('annualReturn', {
		accepts: [
			{arg: 'companyId', type: 'string', required: true},
			{arg: 'from', type: 'string', required: true},
			{arg: 'to', type: 'string', required: true},
			{arg: 'return_date', type: 'string', required: true}
		],
		returns: {arg: 'data', type: 'Object'},
		http: {path: '/annualReturn', verb: 'post'}
	});

};
