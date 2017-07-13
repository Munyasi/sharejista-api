let Promise = require('bluebird')
let fs = require('fs')
let path = require('path')
let JSZip = require('jszip')
let Docxtemplater = require('docxtemplater')

module.exports = function (company_id, res, cb) {
	console.log(company_id);
	let app = require('../server')
	let Shareholder = app.models.Shareholder
	let template_path = '../templates/list_of_shareholders.docx'
	let output_path = '../output/shareholders_list/list_of_shareholders.docx'

	Shareholder.find({company_id: company_id})
		.then(function (shareholders) {
			let content = fs.readFileSync(path.resolve(__dirname, template_path), 'binary')
			let zip = new JSZip(content)
			let doc = new Docxtemplater()
			doc.loadZip(zip)
			doc.setData({'shareholders': shareholders})

			try {
				doc.render();
				let buf = doc.getZip().generate({type: 'nodebuffer'})
				fs.writeFileSync(path.resolve(__dirname, output_path), buf);
				cb(null, {success: 1})
			}
			catch (error) {
				let e = {
					message: error.message,
					name: error.name,
					stack: error.stack,
					properties: error.properties,
				}

				cb(error);
			}
		})
		.catch(function (err) {
			cb(err);
		})
}