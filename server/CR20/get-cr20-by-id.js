'use strict';
let app = require('../server');
let createCR20Document = require('./create-cr20-document');

function generateCR9DocumentById (cr20Id, cb) {
	let p = getCR9Data(cr20Id);

	p.then( cr20Item => {
		if(cr20Item !== null){
			let data = JSON.parse(cr20Item.data_object);
			try {
				let fileName = createCR20Document(data);
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

function getCR9Data(cr20Id){
	let CR20 = app.models.CR20;
	let p = CR20.findOne({
		where: {
			id: cr20Id
		},
		fields: ['id', 'data_object']
	});

	return p;
}

module.exports = generateCR9DocumentById;