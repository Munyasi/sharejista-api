'use strict';
const App = require('../server');
const toWords = require('../utils/number-to-word');
const monthInWords = require('../utils/month-in-words');
const uuid = require('uuid/v4');
const path = require('path');
let createWordDocument = require('../utils/create-word-doc-from-template');
const TEMPLATE_PATH = path.resolve(__dirname, '../templates/share_certificate.docx');
const OUTPUT_PATH = path.resolve(__dirname , '../output/share_certificates');


function generateShareCertificate(shareEntryId, cb) {
  const Shares = App.models.Shares;
  const Company = App.models.Company;
  let data = {};

  const p = Shares.findById(shareEntryId, {include: ['Shareholder','ShareType']});

  p.then(entry => {
    entry = JSON.parse(JSON.stringify(entry));
    data.name = entry.Shareholder.name.toUpperCase();
    data.shares = entry.number_of_shares;
    data.par_value = entry.ShareType.par_value;

    if(entry.action === 'CF')
      data.price = 'NA'; //entry.share_price;
    else
      data.price = entry.share_price || 'NA';

    data.type = entry.ShareType.name;
    data.address = `P.O BOX ${entry.Shareholder.postal_code}-${entry.Shareholder.box} ${entry.Shareholder.town}.`.toUpperCase();
    let words = toWords(entry.number_of_shares);
    data.shares_word = words.toUpperCase();
    data.no = entry.entry_no || '';

    let dated = entry.dated || entry.createdAt;
    dated = new Date(dated);

    data.day = dated.getDate() + nth(dated.getDate());
    data.month = monthInWords(dated.getMonth() + 1);
    data.year = dated.getFullYear();

    // get company details
    const companyPromise = Company.findById(entry.company_id);

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