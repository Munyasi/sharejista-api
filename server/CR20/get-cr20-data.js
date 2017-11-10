'use strict';
const executeQuery = require('../utils/execute-query');

function getAmountsPaidCash (ds, companyId, from, to) {
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

	const cb = (resolve, reject) => {
		const p = executeQuery(sql, ds, [companyId, from, to]);
		//get the last row (use of WITH ROLLUP)
		p.then( results => resolve(results.pop()));
		p.catch( err => reject(err));
	};

	return new Promise(cb);
}

function getAmountsPaidNonCash (ds, companyId, from, to) {
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

	const cb = (resolve, reject) => {
		const p = executeQuery(sql, ds, [companyId, from, to]);
		//get the last row (use of WITH ROLLUP)
		p.then( results => resolve(results.pop()));
		p.catch( err => reject(err));
	};

	return new Promise(cb);
}

function getTransfereeDetails (ds, companyId, from, to) {
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

	const cb = (resolve, reject) => {
		const p = executeQuery(sql, ds, [companyId, from, to]);
		//get the last row (use of WITH ROLLUP)
		p.then( results => {
			let object = {};
			let total = results.pop();
			if (total !== undefined)
				object.total_allotted_shares = total.total_shares;
			else
				object.total_allotted_shares = NA;
			object.transferees = results;
			return resolve(object);
		});

		p.catch( err => reject(err));
	};

	return new Promise(cb);
}

function getShareCount (ds, companyId, from, to) {
	let sql = `
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

	const cb = (resolve, reject) => {
		const p = executeQuery(sql, ds, [companyId, from, to]);
		//get the last row (use of WITH ROLLUP)
		p.then( results => resolve(results.pop()));
		p.catch( err => reject(err));
	};

	return new Promise(cb);
}

module.exports = {
	getAmountsPaidCash: getAmountsPaidCash,
	getAmountsPaidNonCash: getAmountsPaidNonCash,
	getTransfereeDetails: getTransfereeDetails,
	getShareCount: getShareCount
};