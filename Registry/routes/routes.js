module.exports = (function(){
	// variables
	var retVal;

	// assign variables
	retVal = {};

	// define Init
	function Init(params){	//to call route Init()
		var providers = require("./providers");
		var consumers=require("./consumers");

		providers.Init(params);
		consumers.Init(params);
	}

	// return module
	retVal.Init = Init;

	return retVal;
})();