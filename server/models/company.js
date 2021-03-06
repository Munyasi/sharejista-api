'use strict';
const addCompany = require('../company/create_company');
const updateCompany = require('../company/update_company');
const annualReturn = require('../annual_return/annual_return');
const searchCompany = require('../company/search-company');
const generateAnnualReturnById = require('../annual_return/get-annual-return-by-id');

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

	Company.generateAnnualReturnById = generateAnnualReturnById;
	Company.remoteMethod('generateAnnualReturnById', {
		accepts: [
			{arg: 'annualReturnId', type: 'number', required: true}
		],
		returns: {arg: 'data', type: 'Object'},
		http: {path: '/generateAnnualReturnById', verb: 'post'}
	});

	Company.search = searchCompany;
	Company.remoteMethod('search', {
		accepts: [
			{ arg: 'q', type: 'string', required: true},
			{ arg: 'limit', type: 'number' },
			{ arg: 'skip', type: 'number'}
		],
		returns: {arg: 'data', type: 'Object'},
		http: {path: '/search', verb: 'get'}
	});

};
