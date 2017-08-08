let app = require('../server')
let Promise = require('bluebird')
let _ = require('lodash');
let async = require('async');

function listTransfers(company_id, cb) {
    let Sharetransfer = app.models.ShareTransfer;
    let Shareholder = app.models.Shareholder;
    let Company = app.models.Company;
    Sharetransfer.find({
        where: {'company_id': company_id, 'approved': 0, 'transferer_type': 'shareholder'},
        include: ['transferee', 'sharetype']
    }).then(function (shareTranfers) {
        shareTranfers = JSON.parse(JSON.stringify(shareTranfers));
        async.forEachOf(shareTranfers, function (value, index, callback) {
            value = JSON.parse(JSON.stringify(value));

            Shareholder.findById(value.transferer_id)
                .then(function (info) {

                    info = JSON.parse(JSON.stringify(info))
                    shareTranfers[index]['transferer'] = info;
                    callback();
                })
                .catch(function (err) {
                    callback(err);
                })

        }, function (err) {
            if (!err) {
                cb(null, shareTranfers);
            } else {
                cb(err);
            }
        })
    })
}

module.exports = listTransfers;