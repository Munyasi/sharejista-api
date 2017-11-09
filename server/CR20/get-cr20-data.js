'use strict';

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

	return new Promise(function (resolve, reject) {
		ds.connector.query(sql, [companyId, from, to], function (err, results) {
			if (err)
				return reject(err);
			else
				return resolve(results.pop()); //get the last row (use of WITH ROLLUP)
		});
	});
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

	return new Promise(function (resolve, reject) {
		ds.connector.query(sql, [companyId, from, to], function (err, results) {
			if (err)
				return reject(err);
			else
				return resolve(results.pop()); //get the last row (use of WITH ROLLUP)
		});
	});
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

function getShareCount (ds, companyId, from, to) {
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

module.exports = {
	getAmountsPaidCash: getAmountsPaidCash,
	getAmountsPaidNonCash: getAmountsPaidNonCash,
	getTransfereeDetails: getTransfereeDetails,
	getShareCount: getShareCount
};