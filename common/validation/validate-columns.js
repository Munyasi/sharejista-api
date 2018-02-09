"use strict"
let _ = require('lodash-addons');
let isEmail = require('isemail');
let moment = require('moment');
let async = require('async');

module.exports = {
    entryNumber: entryNumber,
    shareholdersName: shareholdersName,
    shareCertificateNumber:shareCertificateNumber,
    shareholderShareTypes:shareholderShareTypes,
    shareholderNumberOfShares:shareholderNumberOfShares,
    shareholderIdType:shareholderIdType,
    shareholderIdNumber:shareholderIdNumber,
    shareholderEmail:shareholderEmail,
    shareholderDateOfBirth:shareholderDateOfBirth,
    shareholderPhoneNumber:shareholderPhoneNumber,
    shareholderPostalCode:shareholderPostalCode,
    shareholderPostalBox:shareholderPostalBox,
    shareholderPostalTown:shareholderPostalTown,
    shareholderCounty:shareholderCounty,
    shareholderConstituency:shareholderConstituency,
    shareholderLocation:shareholderLocation,
    shareholderSubLocation:shareholderSubLocation
}


/**
 * @param {Object} colEntryNumber
 * @param {Object} colEntryNumber2
 * @param @function callback
 * @returns {Object}
 * @description Validates Entry Number for the parsed column.
 */
function entryNumber(colEntryNumber,colEntryNumber2,callback) {
        let entry_numbers = {errors:[],data:[]};
        colEntryNumber.eachCell({includeEmpty: true}, (cell, rowNumber) => {
            //Check starting from column 3 which has data
            if(rowNumber<3) return;

            //Check for null values
            if(!cell.value){
                entry_numbers.errors.push(`Entry number should not be blank for row ${rowNumber}`);
            }

            //Check for integers
            if(cell.value && !_.isInteger(cell.value*1)){
                entry_numbers.errors.push(`Entry number should be a valid integer for row ${rowNumber}`);
            }

            entry_numbers.data.push(cell.value);
        });

        if(entry_numbers.errors.length){
            callback(entry_numbers.errors);
        }else{
            let labelA = 'Id numbers ';
            let labelB = 'Entry numbers '
            let compare_cols_res = compareCols(entry_numbers['data'],colEntryNumber2,labelA,labelB);
            if(compare_cols_res.length>0){
                entry_numbers.errors = compare_cols_res;
                callback(entry_numbers.errors);
            }else {
                callback(null,entry_numbers.data);
            }
        }
}

/**
* @param {Object} colA
 * @param {Object} colB
 * @return {Object}
 * @description checks for data inconsistency between two columns
* */
function compareCols(colA,colB,labelA,labelB) {
    let duplicate = repeatedValues(colA);
    let colB_values = [];
    let corresponding_colB_values = {};
    let non_corresponding_values = [];
    //Set colB values into an array
    colB.eachCell({includeEmpty: true}, (cell,rowNumber) => {
        //Check starting from column 3 which has data
        if(rowNumber<3) return;
        colB_values.push(cell.value);
    })

    //Get colB values corresponding to duplicate rows for colA
    let c_index = 0;
    _.forEach(duplicate,(value,index)=>{
        corresponding_colB_values[index] = [];
        _.forEach(colA,(value2,index2)=>{
            if(value2==value){
                corresponding_colB_values[index].push(colB_values[index2]);
            }
        })
        c_index++;
    });

    _.each(corresponding_colB_values,(value)=>{
        let uni = _.uniq(value);
        if(uni.length>1){
            non_corresponding_values.push(`The following ${labelA} {${value.toString()}} do not correspond with their respective ${labelB}`)
        }
    })

    return non_corresponding_values;
}


/**
 * @param {string} colShareholdersName
 * @param @function callback
 * @returns {Object}
 * @description Validates Shareholders' Names for the parsed column object.
 */
function shareholdersName(colShareholdersName,callback) {
    let share_holders_names = {errors:[],data:[]};
    colShareholdersName.eachCell({includeEmpty: true}, (cell, rowNumber) => {
        //Check starting from column 3 which has data
        if(rowNumber<3) return;

        //Check for null values
        if(!cell.value){
            share_holders_names.errors.push(`Shareholder's name should not be blank for row ${rowNumber}`);
        }

        share_holders_names.data.push(cell.value);
    });

    if(share_holders_names.errors.length){
        callback(share_holders_names.errors);
    }else{
        callback(null,share_holders_names.data);
    }

    //TODO: Return possible duplicates. Same names different entry/id numbers
}


/**
 * @param {string} colShareholderCertificateNumber
 * @param {Object} shares_list
 * @param @function callback
 * @returns {Object}
 * @description Validates Shareholders' Certificate Number for the parsed column object.
 */
function shareCertificateNumber(colShareholderCertificateNumber,shares_list,callback) {
    let share_certificate_number = {errors:[],data:[]};
    colShareholderCertificateNumber.eachCell({includeEmpty: true}, (cell, rowNumber) => {
        //Check starting from column 3 which has data
        if(rowNumber<3) return;

        //check for duplicate share certificate number from db
        if(_.find(shares_list, ['certificate_no', cell.value])){
            share_certificate_number.errors.push(`Share certificate number for row ${rowNumber} already exists`);
        }

        //Check for null values
        if(!cell.value){
            share_certificate_number.errors.push(`Share certificate number should not be blank for row ${rowNumber}`);
        }

        //Check for integers
        if(cell.value && !_.isInteger(cell.value*1)){
            share_certificate_number.errors.push(`Share certificate number should be a valid integer for row ${rowNumber}`);
        }

        share_certificate_number.data.push(cell.value);
    });

    //Check for duplicates in the worksheet
    let duplicates;
    duplicates = repeatedValues(share_certificate_number.data);

    if(duplicates.length){
        share_certificate_number.errors.push(`Share certificate ${duplicates.toString()} have been repeated in the data sheet`);
    }

    if(share_certificate_number.errors.length){
        callback(share_certificate_number.errors);
    }else{
        callback(null,share_certificate_number.data);
    }
}


/**
 * @param {string} colShareholderShareTypes
 * @param {Object} share_type_results
 * @param @function callback
 * @returns {Object}
 * @description Validates share types for the parsed column object.
 */
function shareholderShareTypes(colShareholderShareTypes,share_type_results,callback) {
    let share_types = {errors:[],data:[]};
    colShareholderShareTypes.eachCell({includeEmpty: true}, (cell, rowNumber) => {
        //Check starting from column 3 which has data
        if(rowNumber<3) return;

        //Check for null values
        if(!cell.value){
            share_types.errors.push(`Share type should not be blank for row ${rowNumber}`);
        }

        // Check for ids from db
        let share_type_id = -1;
        let share_types_str = [];
        //TODO: share-types should be based on existing company share types
        _.forEach(share_type_results, value => {
            if(_.toLower(cell.value)===_.toLower(value.name)){
                share_type_id = value.id;
            }
            share_types_str.push(cell.value);
        })
        share_types.errors.push(share_type_results);

        share_types_str = _.uniq(share_types_str);

        if(cell.value && share_type_id==-1){
            share_types.errors.push(`Share type for row ${rowNumber} does not correspond with what you have in this company profile. If missing, kindly add it before proceeding`);
        }
        share_types.data.push(share_type_id);
    });

    if(share_types.errors.length){
        callback(share_types.errors);
    }else{
        callback(null,share_types.data);
    }
}



/**
 * @param {string} colShareholderNumberOfShares
 * @param @function callback
 * @returns {Object}
 * @description Validates Shareholders' Number of shares for the parsed column object.
 */
function shareholderNumberOfShares(colShareholderNumberOfShares,callback) {
    let number_of_shares = {errors:[],data:[]};
    colShareholderNumberOfShares.eachCell({includeEmpty: true}, (cell, rowNumber) => {
        //Check starting from column 3 which has data
        if(rowNumber<3) return;

        //Check for null values
        if(!cell.value){
            number_of_shares.errors.push(`Number of shares should not be blank for row ${rowNumber}`);
        }

        //Check for integers
        if(cell.value && !_.isInteger(cell.value*1)){
            number_of_shares.errors.push(`Number of shares should be a valid integer for row ${rowNumber}`);
        }

        number_of_shares.data.push(cell.value);
    });

    if(number_of_shares.errors.length){
        callback(number_of_shares.errors);
    }else{
        callback(null,number_of_shares.data);
    }
}


/**
 * @param {string} colShareholderIdType
 * @param @function callback
 * @returns {Object}
 * @description Validates id type for the parsed column object.
 */
function shareholderIdType(colShareholderIdType,callback) {
    let id_type = {errors:[],data:[]};
    let shareholder_type = [];
    colShareholderIdType.eachCell({includeEmpty: true}, (cell, rowNumber) => {
        //Check starting from column 3 which has data
        if(rowNumber<3) return;

        //Check for null values
        if(!cell.value){
            id_type.errors.push(`Id type should not be blank for row ${rowNumber}`);
        }

        let type;
        if(cell.value && cell.value==="National ID"){
            type = 'individual';
        }else if(cell.value && cell.value==="Passport"){
            type = 'individual';
        }else if(cell.value && cell.value==="Company Registration No."){
            type = 'corporate';
        }

        shareholder_type.push(type);

        if(!(cell.value==='National ID'||cell.value==='Passport'||cell.value==='Company Registration No.')){
            id_type.errors.push(`Id type column only accepts "National ID" or "Passport" or "Company Registration No."  row ${rowNumber}`);
        }
        id_type.data.push(cell.value);
    });

    if(id_type.errors.length){
        callback(id_type.errors);
    }else{
        callback(null,[id_type.data,shareholder_type]);
    }
}


/**
 * @param {Object} colShareholderIdNumber
 * @param {Object} colIdNumber2
 * @param @function callback
 * @returns {Object}
 * @description Validates Shareholders' Number of shares for the parsed column object.
 */
function shareholderIdNumber(colShareholderIdNumber,colIdNumber2,callback) {
    let id_number = {errors:[],data:[]};
    colShareholderIdNumber.eachCell({includeEmpty: true}, (cell, rowNumber) => {
        //Check starting from column 3 which has data
        if(rowNumber<3) return;

        //Check for null values
        if(!cell.value){
            id_number.errors.push(`Id number should not be blank for row ${rowNumber}`);
        }

        //Check for integers
        if(cell.value && !_.isInteger(cell.value*1)){
            id_number.errors.push(`Id number should be a valid integer for row ${rowNumber}`);
        }

        id_number.data.push(cell.value);
    });

    if(id_number.errors.length){
        callback(id_number.errors);
    }else{
        let labelA = 'Entry numbers ';
        let labelB = 'ID numbers '
        let compare_cols_res = compareCols(id_number['data'],colIdNumber2,labelA,labelB);
        if(compare_cols_res.length>0){
            id_number.errors = compare_cols_res;
            callback(id_number.errors);
        }else {
            callback(null,id_number.data);
        }
    }
}


/**
 * @param {string} colShareholderEmail
 * @param @function callback
 * @returns {Object}
 * @description Validates emails of shares for the parsed column object.
 */
function shareholderEmail(colShareholderEmail,callback) {
    let email = {errors:[],data:[]};
    colShareholderEmail.eachCell({includeEmpty: true}, (cell, rowNumber) => {
        //Check starting from column 3 which has data
        if(rowNumber<3) return;


        if(cell.value && Object.keys(cell.value)){
            cell.value = cell.value.text;
        }
        if(cell.value && !isEmail.validate(cell.value)){
            email.errors.push(`Enter a valid email for row ${rowNumber}`);
        }

        email.data.push(cell.value);
    });

    if(email.errors.length){
        callback(email.errors);
    }else{
        callback(null,email.data);
    }
}


/**
 * @param {string} colShareholderDateOfBirth
 * @param @function callback
 * @returns {Object}
 * @description Validates date of birth of shareholders for the parsed column object.
 */
function shareholderDateOfBirth(colShareholderDateOfBirth,callback) {
    let dob = {errors:[],data:[]};

    colShareholderDateOfBirth.eachCell({includeEmpty: true}, (cell, rowNumber) => {
        //Check starting from column 3 which has data
        if(rowNumber<3) return;

        cell.value =  moment(cell.value).format("YYYY-MM-DD HH:MM:SS");
        if(cell.value=='Invalid date'){
            dob.data.push(null);
        }else{
            dob.data.push(cell.value);
        }
    });

    if(dob.errors.length){
        callback(dob.errors);
    }else{
        callback(null,dob.data);
    }
}



/**
 * @param {string} colShareholderPhoneNumber
 * @param @function callback
 * @returns {Object}
 * @description Validates phone number of shareholders for the parsed column object.
 */
function shareholderPhoneNumber(colShareholderPhoneNumber,callback) {
    let phone_number = [];
    colShareholderPhoneNumber.eachCell({includeEmpty: true}, (cell, rowNumber) => {
        //Check starting from column 3 which has data
        if(rowNumber<3) return;
        phone_number.push(cell.value);
    });

    callback(null,phone_number);
}


/**
 * @param {string} colShareholderPostalCode
 * @param @function callback
 * @returns {Object}
 * @description Validates postal code of shareholders for the parsed column object.
 */
function shareholderPostalCode(colShareholderPostalCode,callback) {
    let postal_code = [];
    colShareholderPostalCode.eachCell({includeEmpty: true}, (cell, rowNumber) => {
        //Check starting from column 3 which has data
        if(rowNumber<3) return;
        postal_code.push(cell.value);
    });

    callback(null,postal_code);
}



/**
 * @param {string} colShareholderPostalBox
 * @param @function callback
 * @returns {Object}
 * @description Validates postal box of shareholders for the parsed column object.
 */
function shareholderPostalBox(colShareholderPostalBox,callback) {
    let postal_box = [];
    colShareholderPostalBox.eachCell({includeEmpty: true}, (cell, rowNumber) => {
        //Check starting from column 3 which has data
        if(rowNumber<3) return;
        postal_box.push(cell.value);
    });

    callback(null,postal_box);
}


/**
 * @param {string} colShareholderPostalTown
 * @param @function callback
 * @returns {Object}
 * @description Validates postal town of shareholders for the parsed column object.
 */
function shareholderPostalTown(colShareholderPostalTown,callback) {
    let postal_town = [];
    colShareholderPostalTown.eachCell({includeEmpty: true}, (cell, rowNumber) => {
        //Check starting from column 3 which has data
        if(rowNumber<3) return;
        postal_town.push(cell.value);
    });

    callback(null,postal_town);
}



/**
 * @param {string} colShareholderCounty
 * @param @function callback
 * @returns {Object}
 * @description Validates postal town of shareholders for the parsed column object.
 */
function shareholderCounty(colShareholderCounty,callback) {
    let county = [];
    colShareholderCounty.eachCell({includeEmpty: true}, (cell, rowNumber) => {
        //Check starting from column 3 which has data
        if(rowNumber<3) return;
        county.push(cell.value);
    });

    callback(null,county);
}



/**
 * @param {string} colShareholderConstituency
 * @param @function callback
 * @returns {Object}
 * @description Validates constituency of shareholders for the parsed column object.
 */
function shareholderConstituency(colShareholderConstituency,callback) {
    let constituency = [];
    colShareholderConstituency.eachCell({includeEmpty: true}, (cell, rowNumber) => {
        //Check starting from column 3 which has data
        if(rowNumber<3) return;
        constituency.push(cell.value);
    });

    callback(null,constituency);
}




/**
 * @param {string} colShareholderLocation
 * @param @function callback
 * @returns {Object}
 * @description Validates postal town of shareholders for the parsed column object.
 */
function shareholderLocation(colShareholderLocation,callback) {
    let location = [];
    colShareholderLocation.eachCell({includeEmpty: true}, (cell, rowNumber) => {
        //Check starting from column 3 which has data
        if(rowNumber<3) return;
        location.push(cell.value);
    });

    callback(null,location);
}


/**
 * @param {string} colShareholderSubLocation
 * @param @function callback
 * @returns {Object}
 * @description Validates postal town of shareholders for the parsed column object.
 */
function shareholderSubLocation(colShareholderSubLocation,callback) {
    let sub_location = [];
    colShareholderSubLocation.eachCell({includeEmpty: true}, (cell, rowNumber) => {
        //Check starting from column 3 which has data
        if(rowNumber<3) return;
        sub_location.push(cell.value);
    });

    callback(null,sub_location);
}


/**
 * @param {Object}  data
 * @return {Object}
 * @description checks to see whether there are repeated values
*/
function repeatedValues(data) {
    //Check for duplicates in the worksheet
    let duplicates = [];
    let uniq = data
        .map((item) => {
            return {count: 1, item: item}
        })
        .reduce((a, b) => {
            a[b.item] = (a[b.item] || 0) + b.count
            return a
        }, {})

    duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1)
    return duplicates;
}