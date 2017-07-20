let Promise = require('bluebird')
let fs = require('fs')
let path = require('path')
let JSZip = require('jszip')
let Docxtemplater = require('docxtemplater')

module.exports = function (company_id, res, cb) {
	console.log(company_id);
	//console.log(export_config);
	let app = require('../server')
	let Shareholder = app.models.Shareholder
	let Company = app.models.Company;
	let template_path = '../templates/list_of_shareholders.docx'
	let output_path = '../output/shareholders_list/list_of_shareholders.docx'

	let angularParser= function(tag){
		let expr=expressions.compile(tag);
		return {get:expr};
	}


	Company.findById(company_id, {fields: ['company_name', 'ro_postal_address', 'ro_postal_code','ro_town_city']})
		.then(function (company) {
			console.log(company);
			Shareholder.find({where:{company_id: company_id}})
				.then(function (shareholders) {
					shareholders = JSON.parse(JSON.stringify(shareholders));
					for(let i = 0; i < shareholders.length; i++){
						shareholders[i].num = i + 1;
						console.log(shareholders[i]);
					}

					let content = fs.readFileSync(path.resolve(__dirname, template_path), 'binary');
					let zip = new JSZip(content);
					let doc = new Docxtemplater();
					doc.loadZip(zip);
					let data = {
						name: company.company_name,
						box: company.ro_postal_address,
						postal_code: company.ro_postal_code,
						town: company.ro_town_city,
						shareholders: shareholders
					}
					doc.setData(data);

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
		})
		.catch(function (err) {
			console.log(err);
		})
}