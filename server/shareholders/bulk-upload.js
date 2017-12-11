'use strict';
let _ = require('lodash');
let moment = require('moment');
let async = require('async');

function bulkUpload (file, cb) {
    let app = require('../server');
    let Shareholder = app.models.Shareholder;
    let Shares = app.models.Shares;
    let ShareType = app.models.ShareType;
    let Company = app.models.Company;
    let Temp = app.models.Temp;

    //retrieve temp data
    let temp_res = Temp.findOne({where:{id:file.temp_id,key:file.temp_key}});


    temp_res.then(temp_result=>{
        let sheet_data = JSON.parse(temp_result.value);
        let shareholder_id;
        async.forEachOf(sheet_data,(value,index,callback)=>{
            Shareholder.findOne({where:{id_reg_number:value.id_reg_number}})
                .then(shareholder_res=>{
                    if(shareholder_res){
                        createShares(shareholder_res.id,value)
                            .then(res=>{
                                callback();
                            })
                            .catch(err=>{
                                callback(err);
                                // console.log(err);
                            })
                    }else{
                        Shareholder.create(
                            {
                                "type": value.shareholder_type,
                                "name": value.name,
                                "email_address": value.email_address,
                                "phone_number": value.phone_number,
                                "id_reg_number": value.id_reg_number,
                                "postal_code": value.postal_code,
                                "box": value.box,
                                "town": value.town,
                                "county": value.county,
                                "constituency": value.constituency,
                                "location": value.location,
                                "sublocation": value.sublocation,
                                "company_id": file.company_id
                            }
                        )
                            .then(res=>{
                                createShares(res.id, value)
                                    .then(res=>{
                                        callback();
                                    })
                                    .catch(err=>{
                                        callback(err);
                                        console.log(res);
                                    })
                            })
                            .catch(err=>{
                                callback(err);
                                console.log(err);
                            })
                    }
                })
                .catch(err=>{

                })

        }, err => {
           if(!err){
               cb()
           }else {
               cb(err);
           }
        });

    })
    temp_res.catch(temp_err=>{
        cb(temp_err);
        console.log(temp_err);
    })


    function createShares(shareholder_id,share_data) {
        console.log(share_data);
        console.log('____________')
      return Shares.create(
          {
              "entry_no": share_data['share_certificate_no'],
              "number_of_shares": share_data.number_of_shares,
              "action": "CF",
              "status": "VALID",
              "sharetype_id": share_data.share_type_id,
              "shareholder_id": shareholder_id,
              "company_id": file.company_id
          }
      )
    }
}

module.exports = bulkUpload;