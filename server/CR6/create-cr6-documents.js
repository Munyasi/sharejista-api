'use strict';
let Promise = require('bluebird');
let fs = require('fs');
let path = require('path');
let uuid = require('uuid/v4');
let createWordDocument = require('../utils/create-word-doc-from-template');

const TEMPLATE_PATH = path.resolve(__dirname, '../templates/CR6.docx');
const OUTPUT_PATH = path.resolve(__dirname, '../output/CR6s');

// if items found are more than ITEMS_PER_FORM
// they have to be output into n forms
// n = Math.ceil(directors.length/ITEMS_PER_FORM)
const ITEMS_PER_FORM = 5;

/**
 * Create CR6 documents from CR6 data object
 * @param data Formatted CR6 data
 */
function createCR6Documents(data) {
	let directors = data.directors || [];
	let groupCount = (directors.length > 0) ? Math.ceil(directors.length / ITEMS_PER_FORM) : 0;
	let formsPath = [];

	for (let i = 0; i < groupCount; i++) {
		data.directors = directors.slice(i * ITEMS_PER_FORM, (i + 1) * ITEMS_PER_FORM);
		let token = uuid().toString().substring(0, 7);
		let companyName = data.company_name || ' ';
		let fileName = `CR6-${companyName}-${token}.docx`;

		try {
			let filePath = createWordDocument(TEMPLATE_PATH, OUTPUT_PATH, fileName, data);
			formsPath.push(filePath);
		}
		catch (err) {
			// TODO: handle error well
			console.log('Create Document Error', err);
		}
	}

	return formsPath;
}

module.exports = createCR6Documents;