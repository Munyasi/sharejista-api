'use strict';
const Promise = require('bluebird');
const app = require('../server');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v4');
const f = require('./functions');
const createAnnualReturnDocument = require('./create-annual-return-document');

function annualReturn(companyId, from, to, return_date, cb){
	const timestamp = Date.parse(return_date);
	const Company = app.models.Company;
	const ds = Company.dataSource;
	let annualReturnData = {};
	if(!isNaN(timestamp)){
		let d = new Date(timestamp);
		let monthNames = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"
		];

		annualReturnData.date = d.getDate();
		annualReturnData.month = monthNames[d.getMonth()].toUpperCase();
		annualReturnData.year = d.getFullYear();
	}
	else {
		return cb(null, {success: 0, message: 'Invalid return date.'});
	}

	let findCompanyPromise = Company.findById(companyId, {
		fields: ['id', 'company_name', 'registration_no','ro_postal_address','ro_postal_code','ro_town_city', 'company_type_id'],
		include: ['CompanyType']
	});

	const getNominalCapital = f.getNominalCapital(ds, companyId);
	const getSharesIssuedWhollyInCash = f.getSharesIssuedWhollyInCash(ds, companyId, from, to);
	const getSharesIssuedWhollyNonCash = f.getSharesIssuedWhollyNonCash(ds, companyId, from, to);
	const getSharesIssuedPartiallyNonCash = f.getSharesIssuedPartiallyNonCash(ds, companyId, from, to);
	const getSharesIssuedInDiscount = f.getSharesIssuedInDiscount(ds, companyId, from, to);
	const getSharesTakenUp = f.getSharesTakenUp(ds, companyId);
	const getShareholdersAndTransfers = f.getShareholdersAndTransfers(ds, companyId, from, to);
	const getOfficers = f.getOfficers(ds, companyId);
	const p = Promise.all([
		getNominalCapital,
		getSharesIssuedWhollyInCash,
		getSharesIssuedWhollyNonCash,
		getSharesIssuedPartiallyNonCash,
		getSharesIssuedInDiscount,
		getSharesTakenUp,
		getShareholdersAndTransfers,
		getOfficers,
		findCompanyPromise
	]);

	p.then( results => { _generateAnnualReturn(companyId, from, to, annualReturnData, results, cb); });
	p.catch((err) => { cb(err); });
}

function _generateAnnualReturn (companyId, from, to, annualReturnData, results, cb) {
	let [
		nominal_capital,
		shares_wholly_cash,
		shares_wholly_noncash,
		shares_partially_noncash,
		shares_in_discount,
		shares_taken,
		shareholders,
		officers,
		company] = results;

	company = JSON.parse(JSON.stringify(company));

	annualReturnData.nominal = nominal_capital;
	annualReturnData.total_capital = nominal_capital[0].nominal_capital;
	annualReturnData.cash = shares_wholly_cash;
	annualReturnData.w_noncash =shares_wholly_noncash;
	annualReturnData.p_ncash = shares_partially_noncash;
	annualReturnData.disc = shares_in_discount;
	annualReturnData.taken = shares_taken;
	annualReturnData.off = officers;
	annualReturnData.sh = shareholders;

	annualReturnData.company_name = company.company_name.toUpperCase();
	annualReturnData.registration_no = company.registration_no;
	annualReturnData.company_type = company.CompanyType.name.toUpperCase();
	annualReturnData.address = company.ro_postal_address;
	annualReturnData.code = company.ro_postal_code;
	annualReturnData.town = company.ro_town_city.toUpperCase();

	const create = createAnnualReturnItem(companyId, from, to, annualReturnData);

	create.then( () => {
		try {
			const fileName = createAnnualReturnDocument(annualReturnData);
			cb(null, {
				success: 1,
				message: `Annual return form for ${annualReturnData.company_name} created successfully.`,
				path: fileName
			});
		}
		catch(e) {
			cb(e);
		}
	});

	create.catch( err => cb(err) );
}

function createAnnualReturnItem(companyId, from, to, data) {
	let AnnualReturn = app.models.AnnualReturn;
	const token = uuid().toString().substring(0, 7);
	const companyName = data.company_name || ' ';
	const date = Date.now().toString();
	const name = `Annual-Return-Form-${companyName}-${date}-${token}.docx`;

	let ar = {
		name: name,
		from: new Date(from),
		to: new Date(to),
		date: new Date(),
		companyId: companyId,
		data_object:  JSON.stringify(data)
	};

	return AnnualReturn.create(ar);
}

module.exports = annualReturn;