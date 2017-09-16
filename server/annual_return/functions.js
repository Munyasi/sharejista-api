'use strict';
let _ = require('underscore');
/**
 * get nominal capital of a company
 * @param ds connection to the database
 * @param companyId
 * @returns {Promise}
 */
function getNominalCapital (ds, companyId) {
	let sql = `
		SELECT
		    ty.name AS class,
		    ty.par_value,
		    cs.share_number AS shares,
		    c.nominal_share_capital AS nominal_capital
		FROM Company c
		    INNER JOIN CompanyShare cs
		    ON c.id = cs.company_id
		    INNER JOIN ShareType ty
		    ON cs.share_type_id = ty.id
		       AND ty.company_id = c.id
		WHERE (c.id = ? )
		ORDER BY ty.name;`;

	return new Promise(function (resolve, reject) {
		ds.connector.query(sql, [companyId], function (err, results) {
			if (err)
				return reject(err);
			else
				return resolve(results);
		});
	});
}
/**
 *  Get shares issued wholly in cash methods within specified period, from
 *  and to
 * @param ds
 * @param companyId
 * @param from
 * @param to
 * @returns {Promise}
 */
function getSharesIssuedWhollyInCash (ds, companyId, from, to) {
	let sql = `
			SELECT
			  ty.name as class,
			  SUM(st.number_of_shares) AS total
			FROM ShareTransfer st
			  INNER JOIN ShareType ty
			  ON st.share_type_id = ty.id
			WHERE (st.company_id = ? )
			      AND (st.transferer_type = 'company')
			      AND (st.approved = 1)
			      AND (st.payment_type = 'Cash')
			      AND (st.payment_status = 'Full')
			      AND (
			        DATE(st.createdAt) >= ? AND
			        DATE(st.createdAt) <= ?
			      )
			GROUP BY st.share_type_id
			ORDER BY ty.name;;`;

	return new Promise(function (resolve, reject) {
		ds.connector.query(sql, [companyId, from, to], function (err, results) {
			if (err)
				return reject(err);
			else
				return resolve(results);
		});
	});
}

/**
 * Get shares issued wholly in non cash within the specified period, from and to
 * @param ds
 * @param companyId
 * @param from Date from
 * @param to Date to
 * @returns {Promise}
 */
function getSharesIssuedWhollyNonCash(ds, companyId, from, to){
	let sql = `
		SELECT
		  ty.name AS class,
		  SUM(st.number_of_shares) AS total
		FROM ShareTransfer st
		  INNER JOIN ShareType ty
		    ON st.share_type_id = ty.id
		WHERE (st.company_id = ? )
		      AND (st.transferer_type = 'company')
		      AND (st.approved = 1)
		      AND (st.payment_type = 'NonCash')
		      AND (st.payment_status = 'Full')
		      AND (
		        DATE(st.createdAt) >= ? AND
		        DATE(st.createdAt) <= ?
		      )
		GROUP BY st.share_type_id
		ORDER BY ty.name;;`;

	return new Promise(function (resolve, reject) {
		ds.connector.query(sql, [companyId, from, to], function (err, results) {
			if (err)
				return reject(err);
			else
				return resolve(results);
		});
	});
}

function getSharesIssuedPartiallyNonCash(ds, companyId, from, to){
	let sql = `
		SELECT
		  ty.name AS class,
		  st.share_price as price,
		  SUM(st.number_of_shares) AS total
		FROM ShareTransfer st
		  INNER JOIN ShareType ty
		    ON st.share_type_id = ty.id
		WHERE (st.company_id = ? )
		      AND (st.transferer_type = 'company')
		      AND (st.approved = 1)
		      AND (st.payment_type = 'NonCash')
		      AND (st.payment_status = 'Partial')
		      AND (
		        DATE(st.createdAt) >= ? AND
		        DATE(st.createdAt) <= ?
		      )
		GROUP BY st.share_type_id
		ORDER BY ty.name;;`;

	return new Promise(function (resolve, reject) {
		ds.connector.query(sql, [companyId, from, to], function (err, results) {
			if (err)
				return reject(err);
			else
				return resolve(results);
		});
	});
}

function getSharesIssuedInDiscount(ds, companyId, from, to){
	let sql = `
		SELECT
		  ty.name AS class,
		  SUM(st.number_of_shares) AS total
		FROM ShareTransfer st
		  INNER JOIN ShareType ty
		  ON st.share_type_id = ty.id
		WHERE (st.company_id = ? )
		      AND (st.transferer_type = 'company')
		      AND (st.approved = 1)
		      AND (
		        DATE(st.createdAt) >= ? AND
		        DATE(st.createdAt) <= ?
		      )
		      AND st.share_price < ty.par_value
		GROUP BY st.share_type_id
		ORDER BY ty.name;;`;

	return new Promise(function (resolve, reject) {
		ds.connector.query(sql, [companyId, from, to], function (err, results) {
			if (err)
				return reject(err);
			else
				return resolve(results);
		});
	});
}

/**
 * Get already taken up in the company
 * @param ds
 * @param companyId
 * @returns {Promise}
 */
function getSharesTakenUp(ds, companyId){
	let sql = `
			SELECT
			  ty.name AS class,
			  cs.share_number AS share_number,
			  cs.unissued_shares AS unissued,
			  (cs.share_number - cs.unissued_shares) AS issued
			FROM Company c
			  INNER JOIN CompanyShare cs
			    ON c.id = cs.company_id
			  INNER JOIN ShareType ty
			    ON cs.share_type_id = ty.id
			       AND ty.company_id = c.id
			WHERE (c.id = ? )
			ORDER BY ty.name;`;

	return new Promise(function (resolve, reject) {
		ds.connector.query(sql, [companyId], function (err, results) {
			if (err)
				return reject(err);
			else
				return resolve(results);
		});
	});
}

/**
 * Get list of part and present members
 * Helper function for getShareholdersAndTransfers
 * @param ds
 * @param companyId
 * @returns {Promise}
 */
function getShareholderDetails (ds, companyId) {
	let sql = `
			SELECT
			  sh.id,
			  sh.name AS s_name,
			  sh.postal_code,
			  sh.box,
			  sh.town,
			  ty.name AS class,
			  CONCAT('P.O BOX ',sh.postal_code, ' - ', sh.box, ' ', sh.town) AS addr,
			  SUM(s.number_of_shares) AS total
			FROM Shareholder sh
			  INNER JOIN Shares s
			  ON sh.id = s.shareholder_id
			  INNER JOIN ShareType AS ty
			  ON ty.id = s.sharetype_id
			WHERE (sh.company_id = ? )
			GROUP BY s.shareholder_id, s.sharetype_id;`;

	return new Promise(function (resolve, reject) {
		ds.connector.query(sql, [companyId], function (err, results) {
			if (err)
				return reject(err);
			else
				return resolve(results);
		});
	});
}

/**
 * Get share transfers done within the specified period, from and to
 * Helper function for getShareholdersAndTransfers
 * @param ds
 * @param companyId
 * @param from
 * @param to
 * @returns {Promise}
 */
function getShareTransfers (ds, companyId, from, to) {
	let sql = `
			SELECT
			  sh.id,
			  st.transferer_id,
			  CONCAT(p.salutation, ' ', p.surname, ' ', p.other_names) AS transferee,
			  st.number_of_shares AS shares,
			  ty.name,
			  DATE_FORMAT(st.createdAt,'%d/%m/%Y') AS date
			FROM Shareholder sh
			  INNER JOIN ShareTransfer st
			    ON sh.id = st.transferer_id
			  INNER JOIN ShareType AS ty
			    ON ty.id = st.share_type_id
		      INNER JOIN Person p
		        ON p.id = st.transferee_id
			WHERE (sh.company_id = ? )
			      AND (
			        DATE(sh.appointment_date) >= ? AND
			        DATE(sh.appointment_date) <= ?
			      )
	        ORDER BY ty.name;`;

	return new Promise(function (resolve, reject) {
		ds.connector.query(sql, [companyId, from, to], function (err, results) {
			if (err)
				return reject(err);
			else
				return resolve(results);
		});
	});
}

/**
 * match each shareholders to his/her share transfers
 * add tr key to each, value is an array of transfers
 * @param ds
 * @param companyId
 * @param from
 * @param to
 * @returns {Promise}
 */
function getShareholdersAndTransfers(ds, companyId, from, to){
	let getShareholdersAndTransfers = getShareholderDetails(ds, companyId);

	return new Promise((resolve, reject) => {
		Promise.all([
			getShareholdersAndTransfers,
			getShareTransfers(ds, companyId, from, to)
		])
			.then((promise_results) => {
				let shareholders = promise_results[0];
				let transfers = promise_results[1];

				_.each(shareholders, function (sh, i) {
					shareholders[i].tr = [];
					_.each(transfers, function (tr) {
						if(tr.transferer_id === sh.id)
							shareholders[i].tr.push(tr);
					});
				});

				return resolve(shareholders);
			})
			.catch((err) => {
				return reject(err);
			});
	});
}

/**
 * Get particulars of the persons who are part of the company at the date of this return
 * @param ds
 * @param companyId
 * @returns {Promise}
 */
function getOfficers(ds, companyId){
	let sql = `
			SELECT
			  p.salutation,
			  p.surname,
			  p.other_names,
			   CONCAT(p.salutation, ' ', p.surname, ' ', p.other_names) AS name,
			  p.former_names AS fn,
			  p.nationality AS nat,
			  p.postal_code,
			  p.box,
			  p.town,
			  p.country,
			  CONCAT('P.O BOX ',p.postal_code, ' - ', p.box, ' ', p.town, ' ', p.country) AS addr,
			  p.occupation AS occ,
			  DATE_FORMAT(p.date_of_birth,'%d/%m/%Y') AS dob
			FROM Person p
			WHERE (p.company_id = ? )
			      AND p.resignation_date IS NULL
			ORDER BY p.surname, p.other_names;`;

	return new Promise(function (resolve, reject) {
		ds.connector.query(sql, [companyId], function (err, results) {
			if (err)
				return reject(err);
			else
				return resolve(results);
		});
	});
}

function getCompanySecretary(ds, companyId){

}

let functions = {
	getNominalCapital: getNominalCapital,
	getSharesIssuedWhollyInCash: getSharesIssuedWhollyInCash,
	getSharesIssuedWhollyNonCash: getSharesIssuedWhollyNonCash,
	getSharesIssuedPartiallyNonCash: getSharesIssuedPartiallyNonCash,
	getSharesIssuedInDiscount: getSharesIssuedInDiscount,
	getSharesTakenUp: getSharesTakenUp,
	getShareholdersAndTransfers: getShareholdersAndTransfers,
	getOfficers: getOfficers
};

module.exports = functions;