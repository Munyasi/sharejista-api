'use strict';
let fs = require('fs');
let path = require('path');
let Excel = require('exceljs');
// let _ = require('lodash');
let _ = require('lodash-addons');
let moment = require('moment');
let isEmail = require('isemail');

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


            sheet_content.then(res => {
                // fetch sheet by name
                let worksheet = workbook.getWorksheet('SHAREHOLDERS');
                let worksheetData = [];
                let results = [];
                let errors = [];

                shares_res.then(shares_results =>{
                    share_type_res.then(share_type_results=>{
                        //validate worksheet
                        const validate_worksheet = validateWorksheet(worksheet,share_type_results,shares_results);
                        const temp_key = _.generateKey(50);
                        validate_worksheet.then(validation_results => {
                            //store validated data
                            Temp.create({key:temp_key,value:JSON.stringify(validation_results)})
                                .then(res=>{
                                    ctx.result.sheet_data = {id:res.id,temp_key:temp_key};
                                    next();
                                })
                                .catch(err=>{
                                    ctx.result.errors = 'Failed creating temp file';
                                    next();
                                })

                        })
                            .catch(validation_error =>{
                                ctx.result.errors = validation_error;
                                next();
                            })
                    })
                })
            })
        }
        function validateWorksheet(worksheet,share_type_results,shares_list) {
            return new Promise(
                function (resolve, reject) {
                    let errors = [];
                    let id_type;
                    let shareholder_data = [];
                    let row_count = 0;
                    // Iterate over all rows that have values in a worksheet
                    worksheet.eachRow(function(row, rowNumber) {

                        if(rowNumber>4){
                            shareholder_data.push({});
                            row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
                                //shareholder name
                                if(colNumber==2){
                                    shareholder_data[row_count]['name']= cell.value;
                                    if(cell.value && cell.value.length<1){
                                        errors.push(`Shareholder name cannot be empty for column ${colNumber}, row ${rowNumber}`);
                                    }
                                    if(cell.value && cell.value.length<6){
                                        errors.push(`Shareholder name cannot be less than 5 characters for column ${colNumber}, row ${rowNumber}`);
                                    }
                                }

                                //shareholder certificate number
                                if(colNumber==3){
                                    shareholder_data[row_count]['share_certificate_no'] = cell.value;
                                    if(cell.value && cell.value.length<1){
                                        errors.push(`Share certificate number cannot be empty for column ${colNumber}, row ${rowNumber}`);
                                    }

                                    if(!_.isInteger(cell.value*1)){
                                        errors.push(`Share certificate number should be a valid integer for column ${colNumber}, row ${rowNumber}`);
                                    }

                                    //check for duplicate share certificate number
                                    if(_.find(shares_list, ['entry_no', cell.value])){
                                        errors.push(`Duplicate share certificate number for column ${colNumber}, row ${rowNumber}`);
                                    }
                                }

                                //shareholder share types
                                if(colNumber==4){
                                    let share_type_id;
                                    let share_types = '';
                                    _.forEach(share_type_results, value => {
                                        if(_.toLower(cell.value)===_.toLower(value.name)){
                                            share_type_id = value.id;
                                        }
                                        share_types+= value.name+' or ';
                                    })


                                    shareholder_data[row_count]['share_type_id']=share_type_id;


                                    if(cell.value && cell.value.length<1){
                                        errors.push(`Shareholder share types cannot be empty for column ${colNumber}, row ${rowNumber}`);
                                    }

                                    if(!share_type_id){
                                        errors.push(`Only ${share_types} accepted for column ${colNumber}, row ${rowNumber}`);
                                    }
                                }

                                //shareholder share number
                                if(colNumber==5){
                                    shareholder_data[row_count]['number_of_shares'] = cell.value;
                                    if(!_.isInteger(cell.value*1)){
                                        errors.push(`Enter a valid share number for column ${colNumber}, row ${rowNumber}`);
                                    }
                                }

                                //shareholder id type
                                if(colNumber==6){
                                    let shareholder_type;
                                    if(cell.value!=="National ID"){
                                        shareholder_type = 'individual';
                                    }else if(cell.value!=="Passport"){
                                        shareholder_type = 'individual';
                                    }else if(cell.value!=="Company Registration No."){
                                        shareholder_type = 'corporate';
                                    }
                                    shareholder_data[row_count]['shareholder_type'] = shareholder_type;

                                    id_type = cell.value;
                                    if(cell.value && cell.value.length<1){
                                        errors.push(`Shareholder id type cannot be empty for column ${colNumber}, row ${rowNumber}`);
                                    }
                                    if(!(cell.value==='National ID'||cell.value==='Passport'||cell.value==='Company Registration No.')){
                                        errors.push(`Only "National ID" or "Passport" or "Company Registration No." accepted for column ${colNumber}, row ${rowNumber}`);
                                    }
                                    //TODO: compare id types dynamically from db
                                }

                                //shareholder id type
                                if(colNumber==7){
                                    shareholder_data[row_count]['id_reg_number']=cell.value;
                                    if(cell.value && cell.value.length<1){
                                        errors.push(`Shareholder id number cannot be empty for column ${colNumber}, row ${rowNumber}`);
                                    }
                                    if(id_type==='National ID' && !_.isInteger(cell.value*1)){
                                        errors.push(`Enter a valid National ID number for column ${colNumber}, row ${rowNumber}`);
                                    }
                                }

                                //Shareholder date of birth
                                if(colNumber == 8){
                                    cell.value =  moment(cell.value).format("YYYY-MM-DD HH:MM:SS");
                                    shareholder_data[row_count]['date_of_birth']=cell.value;
                                    if(!cell.value){
                                        errors.push(`Enter a valid date in the format "YYYY-MM-DD" for column ${colNumber}, row ${rowNumber}`);
                                    }
                                }

                                //shareholder phone number
                                if(colNumber==9){
                                    shareholder_data[row_count]['phone_number']=cell.value;
                                    if(cell.value && !_.isInteger(cell.value*1)){
                                        errors.push(`Enter a valid phone number for column ${colNumber}, row ${rowNumber}`);
                                    }
                                }

                                //shareholder email
                                if(colNumber==10){
                                    shareholder_data[row_count]['email_address']=cell.value;
                                    if(cell.value && !isEmail.validate(cell.value)){
                                        errors.push(`Enter a valid email for column ${colNumber}, row ${rowNumber}`);
                                    }
                                }

                                //shareholder postal code
                                if(colNumber==11){
                                    shareholder_data[row_count]['postal_code']=cell.value;
                                    if(cell.value && cell.value.length<1){
                                        errors.push(`Shareholder postal code cannot be empty for column ${colNumber}, row ${rowNumber}`);
                                    }
                                    if(!_.isInteger(cell.value*1)){
                                        errors.push(`Enter a valid postal code for column ${colNumber}, row ${rowNumber}`);
                                    }
                                }

                                //shareholder postal box
                                if(colNumber==12){
                                    shareholder_data[row_count]['box'] = cell.value;
                                    if(cell.value && cell.value.length<1){
                                        errors.push(`Shareholder id number cannot be empty for column ${colNumber}, row ${rowNumber}`);
                                    }
                                    if(!_.isInteger(cell.value*1)){
                                        errors.push(`Enter a valid postal box for column ${colNumber}, row ${rowNumber}`);
                                    }
                                }

                                //shareholder postal town
                                if(colNumber==13){
                                    shareholder_data[row_count]['town'] = cell.value;
                                    if(cell.value && cell.value.length<1){
                                        errors.push(`Shareholder postal cannot be empty for column ${colNumber}, row ${rowNumber}`);
                                    }
                                }

                                //shareholder county
                                if(colNumber==14){
                                    shareholder_data[row_count]['county'] = cell.value;
                                }

                                //shareholder constituency
                                if(colNumber==15){
                                    shareholder_data[row_count]['constituency']= cell.value;
                                }

                                //shareholder location
                                if(colNumber==16){
                                    shareholder_data[row_count]['location'] = cell.value;
                                }

                                //shareholder sub location
                                if(colNumber==17){
                                    shareholder_data[row_count]['sublocation'] = cell.value;
                                }
                            });

                            row_count++;
                        }
                    });

                    if(errors.length){
                        reject(errors)
                    }else{
                        resolve(shareholder_data);
                    }
                }
            );
        }
    }); // works
};


