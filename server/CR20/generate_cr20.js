'use strict';
let Promise = require('bluebird');
let app = require('../server');
let fs = require('fs');
let path = require('path');
let JSZip = require('jszip');
let Docxtemplater = require('docxtemplater');

function generateCR20 (companyId, from, to, cb) {
	let Person = app.models.Person;
	let Company = app.models.Company;
	let CR20 = app.models.CR20;
	let template_path = '../templates/CR20.docx';
	let output_path = '../output/CR20s';
	let NA = 'NA';
	let ds = Person.dataSource;

	let findCompanyPromise = Company.findById(companyId, {
		fields: ['id', 'company_name', 'registration_no', 'company_type_id'],
		include: ['CompanyType']
	});
	let getShareCountPromise = getShareCount(companyId, from, to);
	let getAmountsPaidPromise = getAmountsPaidCash(companyId, from, to);
	let getAmountsPaidNonCashPromise = getAmountsPaidNonCash(companyId, from, to);
	let getTransfereesPromise = getTransfereeDetails(companyId, from, to);

	Promise.all([findCompanyPromise, getShareCountPromise, getAmountsPaidPromise, getAmountsPaidNonCashPromise, getTransfereesPromise])
		.then(handlePromises)
		.catch((err) => { cb(err);});

	function handlePromises(promises_results) {
		let document_data = {};
		let company = promises_results[0];
		let shares_counts = promises_results[1];
		let cash_payments = promises_results[2];
		let noncash_payments = promises_results[3];
		let transferees_data = promises_results[4];

		company = JSON.parse(JSON.stringify(company));
		document_data.company_name = company.company_name;
		document_data.registration_no = company.registration_no;
		document_data.company_type = company.CompanyType.name;

		if (shares_counts !== undefined) {
			document_data.total_shares = shares_counts.total_shares;
			document_data.total_cost = shares_counts.total_cost;
		}
		else {
			document_data.total_shares = 0;
			document_data.total_cost = 0;
		}

		if (cash_payments !== undefined)
			document_data.amount_paid_cash = cash_payments.amount_paid;
		else
			document_data.amount_paid_cash = 0;

		if (noncash_payments !== undefined)
			document_data.amount_paid_noncash = noncash_payments.amount_paid;
		else
			document_data.amount_paid_noncash = 0;

		document_data.transferees = compileTransferees(transferees_data.transferees);
		document_data.total_allotted_shares = transferees_data.total_allotted_shares;
		let d = new Date();
		document_data.dated = `${d.getDay()}/${d.getMonth() + 1}/${d.getFullYear()}`;
		createCR20Form(document_data);
	}

	function compileTransferees (transferees) {
		return transferees.map(function (transferee) {
			transferee.name = `${transferee.salutation} ${transferee.surname} ${transferee.other_names}`.toUpperCase();
			return transferee;
		});
	}

	function createCR20Form (data) {
		let content = fs.readFileSync(path.resolve(__dirname, template_path), 'binary');
		let zip = new JSZip(content);
		let doc = new Docxtemplater();
		doc.loadZip(zip);
		doc.setData(data);

		try {
			doc.render();
			let buf = doc.getZip().generate({type: 'nodebuffer'});
			let date = Date.now().toString();
			let fileName = `CR20-${data.company_name}-${date}.docx`;
			fs.writeFileSync(path.resolve(__dirname, `${output_path}/${fileName}`), buf);
			let cr20 = {
				name: fileName,
				from: new Date(from),
				to: new Date(to),
				date: new Date(),
				companyId: companyId
			};

			let createCR20Promise = CR20.create(cr20);
			createCR20Promise.then(() => {
				cb(null, {
					success: 1,
					message: `CR20 form for  ${data.company_name} created successfully.`,
					path: fileName
				});
			});

			createCR20Promise.catch((err) => { cb(err); });
		}
		catch (error) { cb(error); }
	}

	function getShareCount (companyId, from, to) {
		let query = `
					SELECT
					  st.id,
					  SUM(sp.amount)/st.share_price AS total_shares,
					  SUM(sp.amount)/st.share_price * st.par_value AS total_cost
					FROM ShareTransfer st
					  INNER JOIN SharePayment sp ON
					                               st.id = sp.share_transfer_id
					                               AND (sp.payment_type = 'Cash')
					WHERE (st.company_id = ?)
					      AND (st.transferer_type = 'company')
					      AND (st.approved = 1)
					      AND (
					        DATE(st.createdAt) >= ? AND
					        DATE(st.createdAt) <= ?
					      )
					GROUP BY sp.share_transfer_id
					WITH ROLLUP`;

		return new Promise(function (resolve, reject) {
			ds.connector.query(query, [companyId, from, to], function (err, results) {
				if (err)
					return reject(err);
				else
					return resolve(results.pop()); //get the last row (use of WITH ROLLUP)
			});
		});
	}

	function getAmountsPaidCash (companyId, from, to) {
		let sql = `
				SELECT
				  st.id,
				  (st.number_of_shares * st.share_price) AS total_cost,
				  SUM(sp.amount) AS amount_paid
				FROM ShareTransfer st
				  INNER JOIN SharePayment sp
				    ON st.id = sp.share_transfer_id
				    AND (sp.payment_type = 'Cash')
				WHERE (st.company_id = ? )
				      AND (st.transferer_type = 'company')
				      AND (st.approved = 1)
				      AND (
				        DATE(st.createdAt) >= ? AND
				        DATE(st.createdAt) <= ?
				      )
				GROUP BY st.id
				WITH ROLLUP`;

		return new Promise(function (resolve, reject) {
			ds.connector.query(sql, [companyId, from, to], function (err, results) {
				if (err)
					return reject(err);
				else
					return resolve(results.pop()); //get the last row (use of WITH ROLLUP)
			});
		});
	}

	function getAmountsPaidNonCash (companyId, from, to) {
		let sql = `
				SELECT
				  st.id,
				  (st.number_of_shares * st.share_price) AS total_cost,
				  SUM(sp.amount) AS amount_paid
				FROM ShareTransfer st
				  INNER JOIN SharePayment sp
				    ON st.id = sp.share_transfer_id
				    AND (sp.payment_type = 'NonCash')
				WHERE (st.company_id = ? )
				      AND (st.transferer_type = 'company')
				      AND (st.approved = 1)
				      AND (
				        DATE(st.createdAt) >= ? AND
				        DATE(st.createdAt) <= ?
				      )
				GROUP BY st.id
				WITH ROLLUP`;

		return new Promise(function (resolve, reject) {
			ds.connector.query(sql, [companyId, from, to], function (err, results) {
				if (err)
					return reject(err);
				else
					return resolve(results.pop()); //get the last row (use of WITH ROLLUP)
			});
		});
	}

	function getTransfereeDetails (companyId, from, to) {
		let sql = `
				SELECT
				  st.id,
				  p.salutation,
				  p.surname,
				  p.other_names,
				  p.box,
				  p.postal_code,
				  p.town,
				  p.country,
				  st.number_of_shares,
				  stp.name AS sharetype,
				  SUM(st.number_of_shares) AS total_shares
				FROM ShareTransfer st
				  INNER JOIN Person p
				    ON st.transferee_id = p.id
				  INNER JOIN ShareType stp
				    ON st.share_type_id = stp.id
				WHERE (st.company_id = ?)
				      AND (st.transferer_type = 'company' )
				      AND (st.approved = 1)
				      AND (
				        DATE(st.createdAt) >= ? AND
				        DATE(st.createdAt) <= ?
				      )
				GROUP BY st.id
				WITH ROLLUP`;

		return new Promise(function (resolve, reject) {
			ds.connector.query(sql, [companyId, from, to], function (err, results) {
				if (err)
					return reject(err);
				else {
					let object = {};
					let total = results.pop();
					if (total !== undefined)
						object.total_allotted_shares = total.total_shares;
					else
						object.total_allotted_shares = NA;
					object.transferees = results;
					return resolve(object);
				}
			});
		});
	}
}

module.exports = generateCR20;