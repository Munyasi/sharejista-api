let app = require('../server')
let Promise = require('bluebird')
function transfer(shareTransferId, action, cb) {
    let Sharetransfer = app.models.ShareTransfer;
    let Shares = app.models.Shares;
    let Company = app.models.Company;
    let CompanyShare = app.models.CompanyShare;

    Sharetransfer.findById(shareTransferId, {include: ['transferee']})
        .then(function (shareTransfer) {
            //check approval status
            if (shareTransfer.approved) {
                let err = new Error()
                err.name = 'ALREADY_APPROVED'
                err.message = 'This share transfer has already been approved.'
                return cb(null, err)
            }

            //if action selected is cancel
            if (action == 0) {
                // make the transfer cancelled
                shareTransfer.approved = 2
                shareTransfer.save()
                    .then(function (success) {
                        return cb(null, 'Share transfer cancelled')
                    })
                    .catch(function (err) {
                        return cb(err)
                    })
                return;
            }

            //update action for allotment
            CompanyShare.findOne(
                {
                    where: {
                        company_id: shareTransfer.company_id,
                        share_type_id: shareTransfer.share_type_id
                    }
                })
                .then(function (companyShares) {
                    if (companyShares.unissued_shares >= shareTransfer.number_of_shares) {
                        let shareObj = {
                            number_of_shares: shareTransfer.number_of_shares,
                            shareholder_id: shareTransfer.transferee_id,
                            sharetype_id: shareTransfer.share_type_id
                        }
                        //update shares table
                        createShares(shareObj, shareTransfer, companyShares);
                    } else {
                        let err = new Error()
                        err.name = 'INADEQUATE_SHARES'
                        err.message = 'Number of shares to transfer exceeds available shares.'
                        return cb(null, err)
                    }
                })
                .catch(function (err) {
                    return cb(err)
                })
        })
        .catch(function (err) {
            return cb(err)
        })


    function createShares(shareObj, shareTransfer, companyShares) {
        Shares.create(shareObj)
            .then(function (shareEntry) {
                // make the transfer approved
                shareTransfer.approved = 1
                shareTransfer.save()
                    .then(function (success) {
                        companyShares.unissued_shares -= shareTransfer.number_of_shares;
                        companyShares.save()
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
            })
            .catch(function (err) {
                return cb(err)
            })
    }
}

module.exports = transfer