'use strict'

const async = require('async');
let _ = require('lodash-addons');
let fs = require('fs');
let path = require('path');
let Excel = require('exceljs');
const isValid = require('./validate-columns');

module.exports = validate;

function validate(worksheet,share_type_results,shares_list) {
    return new Promise(
        function (resolve, reject) {
            let errors = [];
            let id_type;
            let shareholder_data = [];
            let row_count = 0;
            let share_certificate_no = [];

            //Column names
            let colEntryNumber                  = worksheet.getColumn('A');
            let colShareholdersName             = worksheet.getColumn('B');
            let colShareholderCertificateNumber = worksheet.getColumn('C');
            let colShareholderShareTypes        = worksheet.getColumn('D');
            let colShareholderNumberOfShares    = worksheet.getColumn('E');
            let colShareholderIdType            = worksheet.getColumn('F');
            let colShareholderIdNumber          = worksheet.getColumn('G');
            let colShareholderDateOfBirth       = worksheet.getColumn('H');
            let colShareholderPhoneNumber       = worksheet.getColumn('I');
            let colShareholderEmail             = worksheet.getColumn('J');
            let colShareholderPostalCode        = worksheet.getColumn('K');
            let colShareholderPostalBox         = worksheet.getColumn('L');
            let colShareholderPostalTown        = worksheet.getColumn('M');
            let colShareholderCounty            = worksheet.getColumn('N');
            let colShareholderConstituency      = worksheet.getColumn('O');
            let colShareholderLocation          = worksheet.getColumn('P');
            let colShareholderSubLocation       = worksheet.getColumn('Q');

            async.parallel({
            entryNumberRes:(callback) => isValid.entryNumber(colEntryNumber,colShareholderIdNumber,callback),
            shareholderNameRes:(callback) => isValid.shareholdersName(colShareholdersName,callback),
            shareCertificateNumberRes:(callback) => isValid.shareCertificateNumber(colShareholderCertificateNumber,shares_list,callback),
            shareholderShareTypesRes:(callback) => isValid.shareholderShareTypes(colShareholderShareTypes,share_type_results,callback),
            shareholderNumberOfSharesRes:(callback) => isValid.shareholderNumberOfShares(colShareholderNumberOfShares,callback),
            shareholderIdTypeRes:(callback) => isValid.shareholderIdType(colShareholderIdType,callback),
            shareholderIdNumberRes:(callback) => isValid.shareholderIdNumber(colShareholderIdNumber,colEntryNumber,callback),
            shareholderDateOfBirthRes:(callback) => isValid.shareholderDateOfBirth(colShareholderDateOfBirth,callback),
            shareholderPhoneNumberRes:(callback) => isValid.shareholderPhoneNumber(colShareholderPhoneNumber,callback),
            shareholderEmailRes:(callback) => isValid.shareholderEmail(colShareholderEmail,callback),
            shareholderPostalCodeRes:(callback) => isValid.shareholderPostalCode(colShareholderPostalCode,callback),
            shareholderPostalBoxRes:(callback) => isValid.shareholderPostalBox(colShareholderPostalBox,callback),
            shareholderPostalTownRes:(callback) => isValid.shareholderPostalTown(colShareholderPostalTown,callback),
            shareholderCountyRes:(callback) => isValid.shareholderCounty(colShareholderCounty,callback),
            shareholderConstituencyRes:(callback) => isValid.shareholderConstituency(colShareholderConstituency,callback),
            shareholderLocationRes:(callback) => isValid.shareholderLocation(colShareholderLocation,callback),
            shareholderSubLocationRes:(callback) => isValid.shareholderSubLocation(colShareholderSubLocation,callback)
            },(validation_err,validation_res)=>{
                if(validation_err){
                    reject(validation_err)
                 }else{
                    resolve(validation_res);
                 }
            });
        }
    );
}
