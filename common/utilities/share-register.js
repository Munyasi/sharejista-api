"use strict";
const async = require('async');

let shareRegisterValidate = require('../validation/validate-share-register');

module.exports = {
    processShareRegister: processShareRegister
}

function processShareRegister(workbook,share_type_results,shares_results) {
    return new Promise((resolve,reject)=>{
    async.waterfall([
        function(callback) {
            // fetch sheet by name
            let shareholders_worksheet = workbook.getWorksheet('SHAREHOLDERS');
            if(shareholders_worksheet){
                shareRegisterValidate(shareholders_worksheet,share_type_results,shares_results)
                    .then(res=> { callback(null,res)})
                    .catch(err => callback(err))
            }else{
                reject(['Incorrect Worksheet, "SHAREHOLDERS" worksheet name expected ']);
            }
        }
    ], function (err, result) {
        if(err){
            reject(err);
        }else{
            resolve(result);
        }
    });


    })

}

/*

process.on('unhandledRejection', error => {
    // Will print "unhandledRejection err is not defined"
    console.log(error);
});*/
