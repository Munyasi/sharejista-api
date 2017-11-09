'use strict';

let app = require('../server');
let createCR6Documents = require('./create-cr6-documents');

function generateCR6DocumentsById (cr6Id, cb) {
	let p = getCR6Data(cr6Id);

	p.then( cr6Item => {
		if(cr6Item !== null){
			let data = JSON.parse(cr6Item.data_object);
			let paths = createCR6Documents(data);
			cb(null, paths);
		}
		else {
			cb(new Error('Item not found'));
		}
	});
}

function getCR6Data(cr6Id) {
	let CR6 = app.models.CR6;
	let p = CR6.findOne({
		where: {
			id: cr6Id
		},
		fields: ['id', 'data_object']
	});

	return p;
}

module.exports = generateCR6DocumentsById;