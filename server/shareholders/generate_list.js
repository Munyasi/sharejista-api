'use strict';
let Promise = require('bluebird');
let fs = require('fs');
let path = require('path');
let JSZip = require('jszip');
let Docxtemplater = require('docxtemplater');
let Excel = require('exceljs');
let _ = require('underscore');
let uuid = require('uuid/v4');

function generateList (company_id, export_config, res, cb) {
    let app = require('../server');
    let Shareholder = app.models.Shareholder;
    let Company = app.models.Company;
    let template_path = '';
    let output_path = '../output/shareholders_list';
    let filter = {
		where: { company_id: company_id },
		include: ['Shares']
    };

    //file type
    if(export_config.type === 'doc'){
        template_path = '../templates/list_of_shareholders.docx';
    }else if(export_config.type === 'xlsx'){
        template_path = '../templates/list_of_shareholders.xlsx';
    }else{
    	return cb('No such file type');
    }

    //name
    if(export_config.name !== ""){
		filter.order =
	    filter.order =`name ${export_config.name.toUpperCase()}`;
    }
	const shareholderPromise = Shareholder.find(filter);
    const findCompanyPromise = Company.findById(company_id,
		{
			fields: ['company_name', 'ro_postal_address', 'ro_postal_code', 'ro_town_city']
		});

    const p = Promise.all([findCompanyPromise, shareholderPromise]);

    p.then( results => {
		let company = results[0],
		    shareholders = results[1];
		shareholders = JSON.parse(JSON.stringify(shareholders));
		company = JSON.parse(JSON.stringify(company));
		shareholders = calculateTotalShares(shareholders);

		//sort by shares
		if (export_config.shares) {
			shareholders = sortByTotalShares(shareholders, export_config.shares);
		}

		if(export_config.sharesRange.min || export_config.sharesRange.min)
			shareholders = sortBySharesRanges(shareholders, export_config.sharesRange.min, export_config.sharesRange.max);

		//number shareholders
	    shareholders = numberShareholders(shareholders);

		if(export_config.type === 'doc'){

			let createDocumentPromise = createWordDocument(shareholders, company);
			createDocumentPromise.then((data) => { cb(null, data);});
			createDocumentPromise.catch((err) => { cb(err);});

		}else if(export_config.type === 'xlsx'){
			let createDocumentPromise = createExcelDocument(shareholders, company);
		}
    });

    p.catch( err => cb(err) );

    function sortByTotalShares (shareholders, ascDesc) {
		if(ascDesc === 'asc'){
			return _.sortBy(shareholders, 'total');
		}
		else if(ascDesc === 'desc'){
			return _.sortBy(shareholders, 'total').reverse();
		}
    }

    function sortBySharesRanges (shareholders, min, max) {
    	console.log({min, max});
	    return shareholders.filter( s => {
		    return (s.total >= parseInt(min) && s.total <= parseInt(max))
	    });
    }

    function calculateTotalShares (shareholders) {
		for (let i = 0; i < shareholders.length; i++) {
			let total = 0;
			for (let share of shareholders[i].Shares) {
				total += share.number_of_shares;
			}
			shareholders[i].total = total;
		}

		return shareholders;
    }

    function numberShareholders (shareholders) {
	    return shareholders.map((s, i) => {
		    s.n = i + 1;
		    return s;
	    });
    }

    /**
	 *
	 * @param shareholders
	 * @param company
	 * @Return A promise
	 */
    function createWordDocument (shareholders, company) {
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
				//console.log(fileName);
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


    function createExcelDocument(shareholders, company) {
        let workbook = new Excel.Workbook();

        workbook.xlsx.readFile(path.resolve(__dirname, template_path))
            .then(function() {
                let token = uuid().toString().substring(0, 7);
                let filename = `List-of-shareholders-${company.company_name}-${token}.xlsx`;
                let worksheet = workbook.getWorksheet(1);

                worksheet.getRow(1).getCell(1).value = company.company_name;
                worksheet.getRow(2).getCell(1).value = `P.O BOX ${company.ro_postal_code}- ${company.ro_postal_address}`;
                worksheet.getRow(3).getCell(1).value = company.ro_town_city;
                let rowCount = 5;

				_.forEach(shareholders,(value,index) => {
					let row = worksheet.getRow(rowCount);
					value = JSON.parse(JSON.stringify(value));
					row.getCell(1).value = value.id;
					row.getCell(2).value = value.name;
					row.getCell(3).value = value.email_address;
					row.getCell(4).value = `P.O BOX ${value.postal_code}- ${value.box}, ${value.town}`;
					row.getCell(5).value = value.total;
					row.commit();
					rowCount++;
				})
				workbook.xlsx.writeFile(path.resolve(__dirname, `${output_path}/${filename}`));
				cb(null,{success: 1, path: filename});

            })
            .catch(function (err) {
                cb(err);
            })
    }
}

module.exports = generateList;