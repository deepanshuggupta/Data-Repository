module.exports = (function(){
	// variables
	var retVal;

	// assign variables
	retVal = {};

	// functions
	function handleInit(req, res){		        	
    	res.send({
    		user: req.session.user? req.session.user: null,
    		IsLoggedIn: req.session.IsLoggedIn
    	});
	}	

	// define Init
	function Init(params){
		global.app.get('/init/', handleInit);
	}

	// Call Init
	retVal.Init = Init;

	// return module
	return retVal;
})();