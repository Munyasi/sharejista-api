'use strict';
let Promise = require('bluebird');
let fs = require('fs');
let path = require('path');
let JSZip = require('jszip');
let Docxtemplater = require('docxtemplater');
let _ = require('underscore');
let uuid = require('uuid/v4');

function generateList (company_id, export_config, res, cb) {
	let app = require('../server');
	let Shareholder = app.models.Shareholder;
	let Company = app.models.Company;
	let template_path = '../templates/list_of_shareholders.docx';
	let output_path = '../output/shareholders_list';
	let sortByShares = false;

	let findCompanyPromise = Company.findById(company_id,
		{
			fields: ['company_name', 'ro_postal_address', 'ro_postal_code', 'ro_town_city']
		});

	findCompanyPromise.then(function (company) {
		let sort_string = createSortString();

		let findShareholderPromise = Shareholder.find({
			where: {company_id: company_id},
			include: ['Shares'],
			order: sort_string
		});

		findShareholderPromise.then(function (shareholders) {
			shareholders = JSON.parse(JSON.stringify(shareholders));
			shareholders = calculateTotalShares(shareholders);

			if (sortByShares) {
				shareholders = _.sortBy(shareholders, 'total_shares').reverse();
			}

			let createDocumentPromise = createDocument(shareholders, company);
			createDocumentPromise.then((data) => { cb(null, data);});
			createDocumentPromise.catch((err) => { cb(err);});
		});

		findShareholderPromise.catch((err) => { cb(err);});
	});

	findCompanyPromise.catch((err) => { cb(err);});

	function createSortString () {
		let sortString = '';
		if (export_config) {
			if (export_config.field === 'name') {
				sortString = `${export_config.field} ${export_config.order}`;
			}
			else
				sortByShares = true;
		}
		else {
			sortString = `name ASC`;
		}

		return sortString;
	}

	function calculateTotalShares (shareholders) {
		for (let i = 0; i < shareholders.length; i++) {
			shareholders[i].n = i + 1;
			let total = 0;
			for (let share of shareholders[i].Shares) {
				total += share.number_of_shares;
			}
			shareholders[i].total = total;
		}

		return shareholders;
	}

	/**
	 *
	 * @param shareholders
	 * @param company
	 * @Return A promise
	 */
	function createDocument (shareholders, company) {
		let content = fs.readFileSync(path.resolve(__dirname, template_path), 'binary');
		let zip = new JSZip(content);
		let doc = new Docxtemplater();
		doc.loadZip(zip);

		let data = {
			name: company.company_name,
			box: company.ro_postal_address,
			postal_code: company.ro_postal_code,
			town: company.ro_town_city,
			s: shareholders
		};

		doc.setData(data);

		function createDocPromise(resolve, reject) {
			try {
				doc.render();
				let buf = doc.getZip().generate({type: 'nodebuffer'});
				let token = uuid().toString().substring(0, 7);
				let fileName = `List-of-shareholders-${company.company_name}-${token}.docx`;
				console.log(fileName);
				fs.writeFileSync(path.resolve(__dirname, `${output_path}/${fileName}`), buf);
				return resolve({success: 1, path: fileName});
			}
			catch (error) {
				let e = {
					message: error.message,
					name: error.name,
					stack: error.stack,
					properties: error.properties,
				};
				return reject(e);
			}
		}

		return new Promise(createDocPromise);
	}
}

module.exports = generateList;