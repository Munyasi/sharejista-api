let app = require('../server')
let Promise = require('bluebird')
let _ = require('lodash')
let async = require('async')

function addCompany (companyObj,cb) {
    let Company = app.models.Company;
    let ShareType = app.models.ShareType;
    let CompanyShare = app.models.CompanyShare;
    Company.create(companyObj.company)
        .then(function (companyRes) {
            let shareTypeObj = [];
            let companySharesObj = [];
            async.forEachOf(companyObj.share_types,function (data,index,callback) {
                if(data['value']>0&&data['par_value']>0){
                    ShareType.create(
                        {
                            name:data.name,
                            par_value:data.par_value,
                            description:data.name,
                            transferrable:1,
                            company_id:companyRes.id
                        }
                    )
                        .then(function (shareTypeRes) {
                            shareTypeObj.push(shareTypeRes);
                            CompanyShare.create(
                                {
                                    share_number:data['value'],
                                    company_id:companyRes.id,
                                    unissued_shares:data['value'],
                                    share_type_id:shareTypeRes.id
                                }
                            )
                                .then(function (cmpSharesRes) {
                                    companySharesObj.push(cmpSharesRes);
                                })
                                .catch(function (err) {
                                    callback(err)
                                })
                        })
                        .catch(function (err) {
                            callback(err)
                        })
                }
                callback();
            },function (err) {
                if(!err){
                    return cb(null,companyRes);
                }else{
                    return cb(err);
                }
            })
        })
        .catch(function (err) {
            return cb(err);
        });
}

module.exports = addCompany;