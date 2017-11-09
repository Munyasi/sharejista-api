'use strict';
let fs = require('fs');
let path = require('path');
let JSZip = require('jszip');
let uuid = require('uuid/v4');
let Docxtemplater = require('docxtemplater');

/**
 * Create a Word document from a template form
 * @param data Object with keys for template
 * @param templatePath Absolute path to the document template
 * @param outputDir Absolute path to directory where doc will be stored
 * @param fileName Name to be assigned to the newly created file
 * @returns {string} Filename of file created
 */
function createWordDocument (templatePath, outputDir,fileName, data) {
	//check if output path is a directory
	fs.stat(outputDir, (err, stats) => {
		if(!stats.isDirectory())
			throw Error('outputDir is not a directory.');
	});

	try {
		let doc = new Docxtemplater();
		let content = fs.readFileSync(templatePath, 'binary');
		let zip = new JSZip(content);
		doc.loadZip(zip);
		doc.setData(data);

		doc.render();

		let buf = doc.getZip().generate({type: 'nodebuffer'});
		fs.writeFileSync(path.resolve(outputDir,fileName), buf);

		return fileName;
	}
	catch (error) {
		throw error;
	}
}

module.exports = createWordDocument;