let app = require('../server')
let Promise = require('bluebird')
let _ = require('lodash')



function getShareTypes (cb) {
    let ShareType = app.models.ShareType;
    var ds = ShareType.dataSource;
    var sql = "SELECT DISTINCT name FROM ShareType";
    ds.connector.query(sql,function (err, shareTypes) {
        if (err) console.error(err);
        /*_.forEach(shareTypes,function (value,index) {
            shareTypes[index]
            _.extend(shareTypes[index],{par_value:0});
        })*/
        cb(err, shareTypes);
    });

}

module.exports = getShareTypes;