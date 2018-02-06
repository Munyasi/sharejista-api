'use strict';
let fs = require('fs');
let path = require('path');
let Excel = require('exceljs');
let _ = require('lodash-addons');
let async = require('async');

let shareRegisterUtilities = require('../utilities/share-register');

module.exports = function(Document) {
    Document.afterRemote('upload', function(ctx, unused, next) {
        let file = unused.result.files.file[0];
        let app = require('../../server/server');
        let Shareholder = app.models.Shareholder;
        let Shares = app.models.Shares;
        let ShareType = app.models.ShareType;
        let Company = app.models.Company;
        let Temp = app.models.Temp;
        let workbook = new Excel.Workbook();
        const template_path = `../../storage/documents/${file.container}/${file.name}`;
        if(ctx.result) {
            //read excel file
            let sheet_content = workbook.xlsx.readFile(path.resolve(__dirname, template_path));

            //retrieve company share types
            const share_type_res = ShareType.find({where:{company_id: file.company_id }});

            //retrieve company certificate numbers
            const shares_res = Shares.find({where:{company_id: file.company_id }});


            async.parallel([
                    (callback) => {
                        sheet_content.then((sheet_content) => {callback(null,sheet_content)}).catch(err=>callback(err));
                    },
                    (callback) => {
                        share_type_res.then(share_type_results =>{callback(null,share_type_results)}).catch(err=>callback(err));
                    },
                    (callback) => {
                        shares_res.then(shares_results=>{callback(null,shares_results)}).catch(err=>callback(err));
                    }
                ],
                function(data_error, data_results) {
                    // const sheet_content = data_results[0];
                    const share_type_results = data_results[1];
                    const shares_results = data_results[2];
                    if(data_error){
                        ctx.result.errors = data_error;
                        next();
                    }else{
                        shareRegisterUtilities.processShareRegister(workbook,share_type_results,shares_results)
                            .then(validation_results=>{
                                processResults(validation_results);
                            })
                            .catch(err=>{
                                //console.log(err);
                                ctx.result.errors = err;
                                next();
                            })
                    }
                });
        }

        function processResults( validation_results) {
                const temp_key = _.generateKey(50);
                let consolidated_data = [];
                validation_results['idTypeRes'] = validation_results['shareholderIdTypeRes'][0];
                validation_results['shareholderTypeRes'] = validation_results['shareholderIdTypeRes'][1];
                delete validation_results['shareholderIdTypeRes'];

                Temp.create({key:temp_key,value:JSON.stringify(validation_results)})
                    .then(res=>{
                        ctx.result.sheet_data = {id:res.id,temp_key:temp_key};
                        next();
                    })
                    .catch(err=>{
                        ctx.result.errors = ['Failed creating temp file'];
                        next();
                    })
        }
    }); // works
};


