'use strict';
let Promise = require('bluebird');
let app = require('../server');
let _ = require('underscore');
let fs = require('fs');
let path = require('path');
let uuid = require('uuid/v4');
let async = require('async');
let Excel = require('exceljs');
let request = require('request');


function generateMembersLedger(company_id,cb) {
    let ShareTransfer = app.models.ShareTransfer;

    let template_path = '../templates/register-of-members.xlsx';
    let output_path = '../output/ledgers/';


    let workbook = new Excel.Workbook();

    workbook.xlsx.readFile(path.resolve(__dirname, template_path))
        .then(function() {
            let token = uuid().toString().substring(0, 7);
            let filename = token+"-ms.xlsx";
            let worksheet = workbook.getWorksheet(1);
            let rowCount = 5;
            ShareTransfer.find({where:{company_id:company_id,approved:true,transferer_type:'shareholder'},include: ['transferer', 'transferee', 'sharetype']})
                .then((res)=>{
                    _.forEach(res,(value,index) => {
                        let row = worksheet.getRow(rowCount);
                        value = JSON.parse(JSON.stringify(value));
                        row.getCell(2).value = value.updatedAt;
                        row.getCell(3).value = value.id;
                        row.getCell(5).value = value.transferer.name;
                        row.getCell(6).value = `${value.transferer.postal_code}- ${value.transferer.box}, ${value.transferer.town}`;
                        row.getCell(7).value = value.transferee.name;
                        row.getCell(8).value = `${value.transferee.postal_code}- ${value.transferee.box}, ${value.transferee.town}`;

                        if(value.sharetype.name=='Ordinary Shares'){
                            row.getCell(10).value = value.number_of_shares;
                        }
                        if(value.sharetype.name=='Preference shares'){
                            row.getCell(11).value = value.number_of_shares;
                        }

                        row.getCell(14).value = value.share_price;
                        row.commit();
                        rowCount++;
                    })
                    workbook.xlsx.writeFile(path.resolve(__dirname, output_path+filename));
                    cb(null,filename);
                })
        })
        .catch(function (err) {
            cb(err);
        })

}

module.exports = generateMembersLedger;