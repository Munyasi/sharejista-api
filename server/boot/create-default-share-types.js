'use strict';

let app = require('../server');
let ShareType = app.models.ShareType;

//create default share types
createDefaultShareTypes();

function createDefaultShareTypes () {
    checkIfShareTypesExist()
        .then(function (count) {
            if(!count){
                ShareType.create(
                    [
                        {'name': 'Ordinary Shares','description':'Ordinary Shares'},
                        {'name': 'Preference shares','description':'Preference shares'}
                    ], (err, share_type) => {
                        if(err){
                            console.error(err);
                        }else{
                            console.log('Default share types created')
                        }
                    });
            }
        })
        .catch(function (err) {
            //Logger.error(err);
        });
}

//check if there are any share types
function checkIfShareTypesExist () {
    return new Promise(function (resolve, reject) {
        ShareType.count({}, (err, count) => {
            if(err)
                reject(err);
            resolve(count);
        });
    });
}