'use strict';
const path = require('path');
const uuid = require('uuid/v4');

const createWordDocument = require('../utils/create-word-doc-from-template');
const TEMPLATE_PATH = path.resolve(__dirname, '../templates/annual_return.docx');
const OUTPUT_PATH = path.resolve(__dirname , '../output/annual_returns');

/**
 * Create a CR7 document
 * @param data Formatted CR7 data for template
 * @returns {string}
 */
function createAnnualReturnDocument (data) {
	const token = uuid().toString().substring(0, 7);
	const companyName = data.company_name || ' ';
	const date = Date.now().toString();
	const fileName = `Annual-Return-Form-${companyName}-${date}-${token}.docx`;

	try {
		return createWordDocument(TEMPLATE_PATH, OUTPUT_PATH,fileName, data );
	}
	catch (e) {
		throw e;
	}
}

module.exports = createAnnualReturnDocument;
