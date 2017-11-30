'use strict';
const App = require('../server');
const toWords = require('../utils/number-to-word');
const monthInWords = require('../utils/month-in-words');
const uuid = require('uuid/v4');
const path = require('path');
let createWordDocument = require('../utils/create-word-doc-from-template');
const TEMPLATE_PATH = path.resolve(__dirname, '../templates/share_certificate.docx');
const OUTPUT_PATH = path.resolve(__dirname , '../output/share_certificates');


function generateShareCertificate(transferId, cb) {
  const ShareTransfer = App.models.ShareTransfer;
  const Company = App.models.Company;
  let data = {};

  const p = ShareTransfer.findById(transferId, {include: ['transferee','sharetype']});

  p.then(transfer => {
    transfer = JSON.parse(JSON.stringify(transfer));
    data.name = transfer.transferee.name.toUpperCase();
    data.shares = transfer.number_of_shares;
    data.par_value = transfer.sharetype.par_value;
    data.price = transfer.share_price;
    data.type = transfer.sharetype.name;
    data.address = `P.O BOX ${transfer.transferee.postal_code}-${transfer.transferee.box} ${transfer.transferee.town}.`.toUpperCase();
    let words = toWords(transfer.number_of_shares);
    data.shares_word = words.toUpperCase();
    data.no = transfer.share_certificate_no || '';

    let dated = transfer.dated || transfer.createdAt;
    dated = new Date(dated);

    data.day = dated.getDate() + nth(dated.getDate());
    data.month = monthInWords(dated.getMonth() + 1);
    data.year = dated.getFullYear();

    // get company details
    const companyPromise = Company.findById(transfer.company_id);

    companyPromise.then( results => {
      let company = JSON.parse(JSON.stringify(results));
      data.company = company.company_name.toUpperCase();
      data.capital = company.nominal_share_capital;

      let token = uuid().toString().substring(0, 7);
      let name = `Share-Certificate-${token}.docx`;
      let fileName = createWordDocument(TEMPLATE_PATH, OUTPUT_PATH, name, data );
      cb(null, {path: fileName});
    });

    companyPromise.catch( err => { cb(err); });
  });

  p.catch( err => { cb(err); });
}

function nth(d) {
  if(d > 3 && d < 21) return 'th';
  switch (d % 10) {
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  }
}

module.exports = generateShareCertificate;