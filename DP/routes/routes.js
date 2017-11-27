module.exports = (function(){
	// variables
	var retVal;

	// assign variables
	retVal = {};

	// define Init
	function Init(params){	//to call route Init()
		var login = require("./login");
		var logout = require("./logout");
		var init = require("./init");
		var indicators = require("./indicators");
		var units=require("./units");
		var areas=require("./areas");
		var subgroups=require("./subgroups");
		var datasets=require("./datasets");

		login.Init(params);
		logout.Init(params);
		init.Init(params);
		indicators.Init(params);
		units.Init(params);
		areas.Init(params);
		subgroups.Init(params);
		datasets.Init(params);
	}

	// return module
	retVal.Init = Init;

	return retVal;
})();