module.exports = (function(){
	// variables
	var retVal;

	// assign variables
	retVal = {};

	// define Init
	function Init(params){	//to call route Init()
		var datasheets = require("./datasheets");
		var chartings=require("./chartings");

		datasheets.Init(params);
		chartings.Init(params);
	}

	// return module
	retVal.Init = Init;

	return retVal;
})();