'use strict';
let app = require('../server');
let createCR9Document = require('./create-cr9-document');

function generateCR9DocumentById (cr7Id, cb) {
	let p = getCR9Data(cr7Id);

	p.then( cr9Item => {
		if(cr9Item !== null){
			let data = JSON.parse(cr9Item.data_object);
			try {
				let fileName = createCR9Document(data);
				cb(null, {
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

function getCR9Data(cr9Id){
	let CR9 = app.models.CR9;
	let p = CR9.findOne({
		where: {
			id: cr9Id
		},
		fields: ['id', 'data_object']
	});

	return p;
}

module.exports = generateCR9DocumentById;