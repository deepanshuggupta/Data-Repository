module.exports = (function(){
	// variables
	var retVal;

	// assign variables
	retVal = {};

	// functions
	function handleLogout(req, res){
		req.session.user = undefined;
    	req.session.IsLoggedIn = false;		        	
    	res.send(true);
	}	

	// define Init
	function Init(params){
		global.app.get('/logout/', handleLogout);
	}

	// Call Init
	retVal.Init = Init;

	// return module
	return retVal;
})();