var JSZipUtils = require('jszip-utils');
loadFile=function(path,callback){
	JSZipUtils.getBinaryContent(path,function(err,data){
		callback(null,data)
	});
}

module.exports = loadFile;