let app = require('../server')
let Promise = require('bluebird')
let _ = require('lodash')
let async = require('async')

function updateCompany (companyObj,cb) {
    let Company = app.models.Company;
    let CompanyShare = app.models.CompanyShare;
    let ShareType = app.models.ShareType;
    Company.upsert(companyObj.company)
        .then(function (companyRes) {
            async.forEachOf(companyObj.company_shares, function (value, key, callback) {
                CompanyShare.upsert(value)
                    .then(function (cmpSharesRes) {
                        /*console.log(cmpSharesRes);*/
                    })
                    .catch(function (err) {
                        callback(err)
                    })

                ShareType.upsert(
                    {
                        id:value.share_type_id,
                        name:value.type_name,
                        description:value.share_type_description,
                        transferrable:value.share_type_transferrable,
                        company_id:value.company_id,
                        par_value:value.par_value,
                    })
                    .then(function (shareTypeRes) {
                        /*console.log(shareTypeRes);*/
                    })
                    .catch(function (err) {
                        callback(err)
                    })
                callback();
            }, function (err) {
                if (!err) {
                    cb(null,companyRes);
                }else{
                    cb(err);
                }
            })

        })
        .catch(function (err) {
            return cb(err);
        });
}

module.exports = updateCompany;