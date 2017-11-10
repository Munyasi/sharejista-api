'use strict';
let app = require('../server');
const createAnnualReturnDocument = require('./create-annual-return-document');

function generateAnnualReturnDocumentById (annualReturnId, cb) {
	const p = getAnnualReturnData(annualReturnId);

	p.then( item => {
		if(item !== null){
			let data = JSON.parse(item.data_object);
			try {
				let fileName = createAnnualReturnDocument(data);
				cb( null, {
					path: fileName
				});
			}
			catch(err) {
				cb(err);
			}
		}
		else {
			cb(new Error('Item not found'));
		}
	});
}

function getAnnualReturnData(annualReturnId){
	let AnnualReturn = app.models.AnnualReturn;

	return AnnualReturn.findOne({
		where: {
			id: annualReturnId
		},
		fields: ['id', 'data_object']
	});
}

module.exports = generateAnnualReturnDocumentById;
