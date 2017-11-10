'use strict';
const app = require('../server');
const fs = require('fs');
const uuid = require('uuid/v4');

const getCR20Data = require('./get-cr20-data');
const createCR20Document = require('./create-cr20-document');

function generateCR20 (companyId, from, to, cb) {
	let Person = app.models.Person;
	let Company = app.models.Company;
	let NA = 'NA';
	let ds = Person.dataSource;

	const findCompanyPromise = Company.findById(companyId, {
		fields: ['id', 'company_name', 'registration_no', 'company_type_id'],
		include: ['CompanyType']
	});

	const getShareCountPromise = getCR20Data.getShareCount(ds, companyId, from, to);
	const getAmountsPaidPromise = getCR20Data.getAmountsPaidCash(ds, companyId, from, to);
	const getAmountsPaidNonCashPromise = getCR20Data.getAmountsPaidNonCash(ds, companyId, from, to);
	const getTransfereesPromise = getCR20Data.getTransfereeDetails(ds, companyId, from, to);

	Promise.all([
			findCompanyPromise,
			getShareCountPromise,
			getAmountsPaidPromise,
			getAmountsPaidNonCashPromise,
			getTransfereesPromise
		])
		.then((results) => {
			handlePromises(companyId, from, to, cb, results);
		})
		.catch((err) => { cb(err);});
}

function handlePromises(companyId, from, to, cb, promises_results) {
	let data = {};
	let company = promises_results[0];
	let shares_counts = promises_results[1];
	let cash_payments = promises_results[2];
	let noncash_payments = promises_results[3];
	let transferees_data = promises_results[4];

	company = JSON.parse(JSON.stringify(company));
	data.company_name = company.company_name;
	data.registration_no = company.registration_no;
	data.company_type = company.CompanyType.name;

	if (shares_counts !== undefined) {
		data.total_shares = shares_counts.total_shares;
		data.total_cost = shares_counts.total_cost;
	}
	else {
		data.total_shares = 0;
		data.total_cost = 0;
	}

	if (cash_payments !== undefined)
		data.amount_paid_cash = cash_payments.amount_paid;
	else
		data.amount_paid_cash = 0;

	if (noncash_payments !== undefined)
		data.amount_paid_noncash = noncash_payments.amount_paid;
	else
		data.amount_paid_noncash = 0;

	data.transferees = compileTransferees(transferees_data.transferees);
	data.total_allotted_shares = transferees_data.total_allotted_shares;
	let d = new Date();
	data.dated = `${d.getDay()}/${d.getMonth() + 1}/${d.getFullYear()}`;

	let itemP = createCR20Item(companyId, from, to, data);

	itemP.then( item => {
		try{
			let fileName = createCR20Document(data);
			cb(null, {
				success: 1,
				message: `CR20 form for  ${data.company_name} created successfully.`,
				path: fileName
			});
		}
		catch(err){
			cb(err);
		}
	});

	itemP.catch( err => cb(err));
}

function compileTransferees (transferees) {
	return transferees.map(function (transferee) {
		transferee.name = `${transferee.salutation} ${transferee.surname} ${transferee.other_names}`.toUpperCase();
		return transferee;
	});
}

function createCR20Item(companyId, from, to, data) {
	let CR20 = app.models.CR20;
	let company_name = data.company_name || ' ';
	let token = uuid().toString().substring(0, 7);
	let name = `CR20-${company_name}-${token}`;

	let cr20 = {
		name: name,
		from: new Date(from),
		to: new Date(to),
		date: new Date(),
		companyId: companyId,
		data_object: JSON.stringify(data)
	};

	return CR20.create(cr20);
}

module.exports = generateCR20;