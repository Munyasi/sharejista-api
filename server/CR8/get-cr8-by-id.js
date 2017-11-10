'use strict';
const app = require('../server');
const createCR8Documents = require('./create-cr8-documents');

function generateCR8DocumentsById (cr8Id, cb) {
	const p = getCR6Data(cr8Id);

	p.then( cr8Item => {
		if(cr8Item !== null){
			let data = JSON.parse(cr8Item.data_object);
			let paths = createCR8Documents(data);
			cb(null, paths);
		}
		else {
			cb(new Error('Item not found'));
		}
	});
}

function getCR6Data(cr8Id) {
	const CR7 = app.models.CR7;
	const p = CR7.findOne({
		where: {
			id: cr8Id,
			type: 'CR8'
		},
		fields: ['id', 'data_object']
	});

	return p;
}

module.exports = generateCR8DocumentsById;