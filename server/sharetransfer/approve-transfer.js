let app = require('../server')
let Promise = require('bluebird')
function transfer (shareTransferId, cb) {
	let Sharetransfer = app.models.ShareTransfer
	let Shares = app.models.Shares

	Sharetransfer.findById(shareTransferId, {include: ['transferer', 'transferee']})
		.then(function (shareTransfer) {
			//check approval status
			if (shareTransfer.approved) {
				let err = new Error()
				err.name = 'ALREADY_APPROVED'
				err.message = 'This share transfer has already been approved.'
				return cb(null,err)
			}

			//get shares of specified type
			Shares.find({
				where: {
					shareholder_id: shareTransfer.transferer_id,
					sharetype_id: shareTransfer.share_type_id
				}
			})
				.then(function (shares) {
					// calculate total shares
					let total = 0
					shares.forEach(function (share) {
						total += share.number_of_shares
					})
					// check if there are enough shares.
					if (total >= shareTransfer.number_of_shares) {
						// create positive entry for transferee
						// create negative entry for transferer
						let shareObj = [{
							number_of_shares: shareTransfer.number_of_shares,
							shareholder_id: shareTransfer.transferee_id,
							sharetype_id: shareTransfer.share_type_id
						}, {
							number_of_shares: -shareTransfer.number_of_shares,
							shareholder_id: shareTransfer.transferer_id,
							sharetype_id: shareTransfer.share_type_id
						}]

						Shares.create(shareObj)
							.then(function (shareEntry) {
								// make the transfer approved
								shareTransfer.approved = 1
								shareTransfer.save()
									.then(function (success) {
										return cb(null, 'Share transfer complete')
									})
									.catch(function (err) {
										return cb(err)
									})
							})
							.catch(function (err) {
								return cb(err)
							})
					}
					else {
						let err = new Error()
						err.name = 'INADEQUATE_SHARES'
						err.message = 'Number of shares to transfer exceeds available shares.'
						return cb(null,err)
					}
				})
				.catch(function (err) {
					return cb(err)
				})
		})
		.catch(function (err) {
			return cb(err)
		})
}

module.exports = transfer