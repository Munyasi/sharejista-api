'use strict';
const app = require('../server');
const executeQuery = require('../utils/execute-query');


function getShareTypes (cb) {
	const ShareType = app.models.ShareType,
		ds = ShareType.dataSource,
		sql = "SELECT DISTINCT name FROM ShareType",
		p = executeQuery(sql, ds);

	p.then( shareTypes => { cb(null, shareTypes) });
	p.catch( err => cb(err));
}

module.exports = getShareTypes;