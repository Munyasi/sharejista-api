'use strict';
let app = require('../server');
let createCR7Document = require('./create-cr7-document');

function generateCR7DocumentById (cr7Id, cb) {
	let p = getCR7Data(cr7Id);

	p.then( cr7Item => {
		if(cr7Item !== null){
			let data = JSON.parse(cr7Item.data_object);
			try {
				let fileName = createCR7Document(data);
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

function getCR7Data(cr7Id){
	let CR7 = app.models.CR7;
	let p = CR7.findOne({
		where: {
			id: cr7Id
		},
		fields: ['id', 'data_object']
	});

	return p;
}

module.exports = generateCR7DocumentById;
