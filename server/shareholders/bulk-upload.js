'use strict';
let _ = require('lodash');
let moment = require('moment');
let async = require('async');

function bulkUpload (file, cb) {
    console.time('bulk');
    let app = require('../server');
    let Shareholder = app.models.Shareholder;
    let Shares = app.models.Shares;
    let Temp = app.models.Temp;

    //retrieve temp data
    let temp_res = Temp.findOne({where:{id:file.temp_id,key:file.temp_key}});

    temp_res.then(temp_result=>{
        let sheet_data = JSON.parse(temp_result.value);
        let new_shareholders = [];
        let current_shareholders = [];
        let all_shareholders = [];

        Shareholder.find({where:{company_id:file.company_id}})
            .then(shareholders=>{

                shareholders = JSON.parse(JSON.stringify(shareholders));
                _.forEach(sheet_data['shareholderNameRes'],(value,key)=>{
                    let shareholder = shareholders.filter(item=>{
                        if((item.id_reg_number==sheet_data['shareholderIdNumberRes'][key] || item.entry_number ==sheet_data['entryNumberRes'][key]) && item.company_id == file.company_id) {
                            return item;
                        }
                    })[0];

                    if(shareholder){
                        current_shareholders.push(shareholder);
                    }else{
                        new_shareholders.push({
                            "type": sheet_data['shareholderTypeRes'][key],
                            "entry_number": sheet_data['entryNumberRes'][key],
                            "name": sheet_data['shareholderNameRes'][key],
                            "email_address": sheet_data['shareholderEmailRes'][key],
                            "phone_number": sheet_data['shareholderPhoneNumberRes'][key],
                            "id_type": sheet_data['idTypeRes'][key],
                            "id_reg_number": sheet_data['shareholderIdNumberRes'][key],
                            "postal_code": sheet_data['shareholderPostalCodeRes'][key],
                            "box": sheet_data['shareholderPostalBoxRes'][key],
                            "town": sheet_data['shareholderPostalTownRes'][key],
                            "county": sheet_data['shareholderCountyRes'][key],
                            "constituency": sheet_data['shareholderConstituencyRes'][key],
                            "location": sheet_data['shareholderLocationRes'][key],
                            "sublocation": sheet_data['shareholderSubLocationRes'][key],
                            "company_id": file.company_id
                        });
                    }
                })

                //remove repeated shareholders
                new_shareholders = _.uniqBy(new_shareholders,'id_reg_number');
                current_shareholders = _.uniqBy(current_shareholders,'id_reg_number');

                let sh = createShareholders(new_shareholders);
                sh.then(res=>{
                    res = JSON.parse(JSON.stringify(res));
                    all_shareholders = res.concat(current_shareholders);
                    let share_certificate_nos = [];
                    _.each(all_shareholders,(value)=>{
                        _.forEach(sheet_data['shareholderNameRes'],(value2,key2)=>{
                            if(value.id_reg_number==sheet_data['shareholderIdNumberRes'][key2]){
                                share_certificate_nos.push({
                                    "certificate_no": sheet_data['shareCertificateNumberRes'][key2],
                                    "number_of_shares": sheet_data['shareholderNumberOfSharesRes'][key2],
                                    "action": "CF",
                                    "status": "VALID",
                                    "shareholder_id": value.id,
                                    "sharetype_id": sheet_data['shareholderShareTypesRes'][key2],
                                    "company_id": file.company_id
                                })
                            }
                        })
                    })

                    let sh_certificates = createShares(share_certificate_nos);
                    sh_certificates.then(res=>{cb(null,"Success");console.timeEnd('bulk');})
                    sh_certificates.catch(err=>cb(err));
                    //TODO: delete temp and uploaded file;
                })
            })
            .catch(err=>cb(err))
    })

    temp_res.catch(temp_err=>{
        cb(temp_err);
    })


    function createShareholders(shareholders) {
        return new Promise((resolve,reject)=>{
            Shareholder.create(shareholders)
            .then(res=>resolve(res))
            .catch(err=>reject(err))
        })
    }


    function createShares(shares) {
        return new Promise((resolve,reject)=>{
            Shares.create(shares)
                .then(res=>resolve(res))
                .catch(err=>reject(err));
        })
    }
}

module.exports = bulkUpload;

/*
process.on('UnhandledPromiseRejectionWarning', error => {
    // Will print "unhandledRejection err is not defined"
    console.log(error);
});*/
