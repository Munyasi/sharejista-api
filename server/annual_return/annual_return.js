'use strict';
let Promise = require('bluebird');
let app = require('../server');
let fs = require('fs');
let path = require('path');
let JSZip = require('jszip');
let Docxtemplater = require('docxtemplater');
let f = require('./functions');

function annualReturn(companyId, from, to, return_date, cb){
	let Company = app.models.Company;
	let AnnualReturn = app.models.AnnualReturn;
	let ds = Company.dataSource;
	let template_path = '../templates/annual_return.docx';
	let output_path = '../output/annual_returns';
	let annual_return_data = {};

	let timestamp = Date.parse(return_date);
	if(!isNaN(timestamp)){
		let d = new Date(timestamp);
		let monthNames = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"
		];

		annual_return_data.date = d.getDate();
		annual_return_data.month = monthNames[d.getMonth()].toUpperCase();
		annual_return_data.year = d.getFullYear();
	}
	else{
		return cb(null, {success: 0, message: 'Invalid return date.'});
	}

	let findCompanyPromise = Company.findById(companyId, {
		fields: ['id', 'company_name', 'registration_no','ro_postal_address','ro_postal_code','ro_town_city', 'company_type_id'],
		include: ['CompanyType']
	});
	let getNominalCapital = f.getNominalCapital(ds, companyId);
	let getSharesIssuedWhollyInCash = f.getSharesIssuedWhollyInCash(ds, companyId, from, to);
	let getSharesIssuedWhollyNonCash = f.getSharesIssuedWhollyNonCash(ds, companyId, from, to);
	let getSharesIssuedPartiallyNonCash = f.getSharesIssuedPartiallyNonCash(ds, companyId, from, to);
	let getSharesIssuedInDiscount = f.getSharesIssuedInDiscount(ds, companyId, from, to);
	let getSharesTakenUp = f.getSharesTakenUp(ds, companyId);
	let getShareholdersAndTransfers = f.getShareholdersAndTransfers(ds, companyId, from, to);
	let getOfficers = f.getOfficers(ds, companyId);

	Promise.all([
		getNominalCapital,
		getSharesIssuedWhollyInCash,
		getSharesIssuedWhollyNonCash,
		getSharesIssuedPartiallyNonCash,
		getSharesIssuedInDiscount,
		getSharesTakenUp,
		getShareholdersAndTransfers,
		getOfficers,
		findCompanyPromise
	])
		.then(handlePromises)
		.catch((err) => { cb(err);});

	function handlePromises (promises_results) {
		let nominal_capital = promises_results[0];
		let shares_wholly_cash = promises_results[1];
		let shares_wholly_noncash = promises_results[2];
		let shares_partially_noncash = promises_results[3];
		let shares_in_discount = promises_results[4];
		let shares_taken = promises_results[5];
		let shareholders = promises_results[6];
		let officers = promises_results[7];
		let company = promises_results[8];
		company = JSON.parse(JSON.stringify(company));

		annual_return_data.nominal = nominal_capital;
		annual_return_data.total_capital = nominal_capital[0].nominal_capital;
		annual_return_data.cash = shares_wholly_cash;
		annual_return_data.w_noncash =shares_wholly_noncash;
		annual_return_data.p_ncash = shares_partially_noncash;
		annual_return_data.disc = shares_in_discount;
		annual_return_data.taken = shares_taken;
		annual_return_data.off = officers;
		annual_return_data.sh = shareholders;

		annual_return_data.company_name = company.company_name.toUpperCase();
		annual_return_data.registration_no = company.registration_no;
		annual_return_data.company_type = company.CompanyType.name.toUpperCase();
		annual_return_data.address = company.ro_postal_address;
		annual_return_data.code = company.ro_postal_code;
		annual_return_data.town = company.ro_town_city.toUpperCase();

		createAnnualReturnForm(annual_return_data);
		// return cb(null, annual_return_data);
	}

	function createAnnualReturnForm (data) {
		let content = fs.readFileSync(path.resolve(__dirname, template_path), 'binary');
		let zip = new JSZip(content);
		let doc = new Docxtemplater();
		doc.loadZip(zip);
		doc.setData(data);

		try {
			doc.render();
			let buf = doc.getZip().generate({type: 'nodebuffer'});
			let date = Date.now().toString();
			let fileName = `Annual-Return-Form-${data.company_name}-${date}.docx`;
			fs.writeFileSync(path.resolve(__dirname, `${output_path}/${fileName}`), buf);
			let annual_return_item = {
				name: fileName,
				from: new Date(from),
				to: new Date(to),
				date: new Date(),
				companyId: companyId
			};

			let annualReturnPromise = AnnualReturn.create(annual_return_item);
			annualReturnPromise.then(() => {
				cb(null, {
					success: 1,
					message: `Annual return form for  ${data.company_name} created successfully.`,
					path: fileName
				});
			});

			annualReturnPromise.catch((err) => { cb(err); });
		}
		catch (error) { cb(error); }
	}
}

module.exports = annualReturn;