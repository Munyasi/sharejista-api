'use strict';
let path = require('path');
let uuid = require('uuid/v4');
let createWordDocument = require('../utils/create-word-doc-from-template');
const TEMPLATE_PATH = path.resolve(__dirname, '../templates/CR9.docx');
const OUTPUT_PATH = path.resolve(__dirname , '../output/CR9s');

/**
 * Create a CR7 document
 * @param data Formatted CR7 data for template
 * @returns {string}
 */
function createCR9Document (data) {
	let token = uuid().toString().substring(0, 7);
	let companyName = data.company_name || ' ';
	let fileName = `CR9-${companyName}-${token}.docx`;

	try {
		return createWordDocument(TEMPLATE_PATH, OUTPUT_PATH,fileName, data );
	}
	catch (e) {
		throw e;
	}
}

module.exports = createCR9Document;