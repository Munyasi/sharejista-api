'use strict';

let app = require('../server');
let CompanyType = app.models.CompanyType;

//create default company types
createDefaultCompanyTypes();

function createDefaultCompanyTypes () {
    checkIfCompanyTypesExist()
        .then(function (count) {
            if(!count){
                CompanyType.create(
                    [
                        {'name': 'Private company limited by shares (Ltd)'},
                        {'name': 'Public company limited by shares (Plc)'},
                        {'name': 'Foreign company'}
                    ], (err, company_type) => {
                    if(err){
                        console.error(err);
                    }else{
                        console.log('Default company types created')
                    }
                });
            }
        })
        .catch(function (err) {
            //Logger.error(err);
        });
}

//check if there are any company types
function checkIfCompanyTypesExist () {
    return new Promise(function (resolve, reject) {
        CompanyType.count({}, (err, count) => {
            if(err)
                reject(err);
            resolve(count);
        });
    });
}