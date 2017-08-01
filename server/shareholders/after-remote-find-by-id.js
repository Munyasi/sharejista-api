'use strict';

let _ = require('underscore');
let Promise = require('bluebird');
let async = require('async');
let app = require('../server');
function AfterRemoteFindById (ctx,remoteMethodOutput, next) {
	let Shares = app.models.Shares;
	let ShareTransfer = app.models.ShareTransfer;
	let shareholder = ctx.result;

	//get shares
	Shares.find({
		where: { shareholder_id: shareholder.id},
		include: { relation: 'ShareType', fields: ['name'] }})
		.then((shares) => {
			shares = _.groupBy(shares, 'sharetype_id');
			shareholder["shares_totals"] = [];
			_.each(shares, function (share, key) {
				let total_shares = 0;

				_.each(share, function (s) {
					total_shares += s.number_of_shares;
				});

				let obj = {
					"share_type": JSON.parse(JSON.stringify(share[0])).ShareType.name,
					"total_shares": total_shares
				}

				shareholder.shares_totals.push(obj);
			});

			// get transferred away shares
			function getTransferredAwayShares () {
				ShareTransfer.find({ where: { transferer_id: shareholder.id, approved: 1},
					include:[{
						relation: 'sharetype',
						scope: {
							fields: ['name']
						}
					},{
						relation: 'transferee',
						scope: {
							fields: ['name']
						}
					}]})
					.then((transfersAway) => {
						console.log(transfersAway);
						for(let ta of transfersAway){
							shareholder.transfers.push(ta);
						}

						next(null,shareholder);
					},
					(error) => {
						next(error);
					});
			}

			// get allotted shares
			function getAllotedShares () {
				ShareTransfer.find({ where: { transferee_id: shareholder.id, approved: 1},
					include:[{
						relation: 'sharetype',
						scope: {
							fields: ['name']
						}
					},{
						relation: 'transferee',
						scope: {
							fields: ['name']
						}
					}],

					})
					.then((allotments) => {
							shareholder["transfers"] = allotments;
							getTransferredAwayShares();
						},
						(error) => {
							next(error);
						});
			}

			getAllotedShares();
		})
		.catch((err) => {
			next(err);
		})
}

module.exports = AfterRemoteFindById;