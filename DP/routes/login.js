module.exports = (function(){
	// variables
	var retVal, sql, fs, path, config;

	// assign variables
	retVal = {};
	sql = require("mssql");
	fs = require("fs");
	path = require("path");

	// functions
	function handleLoginPost(req, res){
		var user = req.body.user;
		var pwd = req.body.password;

		fs.readFile('data/users.json', function (err, data) {  
			var users = JSON.parse(data);
			var index = users.findIndex(function(arguser){
				if(arguser.name == user && arguser.pwd == pwd){
					return true;
				}
			});

			if(index != -1){
				req.session.user = users[index].name;
				req.session.IsLoggedIn = true;
				res.send({
					result: true
				});
			} else {
				req.session.user = undefined;
				req.session.IsLoggedIn = false;		        	
				res.send({
					result: false
				});
			}
		});
	}

	function handleLoginTemplate(req, res){
		res.sendFile(path.resolve('templates//login.handlebars'));
	}	

	// define Init
	function Init(params){
		config = params.config;

		global.app.get('/login/', handleLoginTemplate);
		global.app.post('/login/', handleLoginPost);
	}

	// Call Init
	retVal.Init = Init;

	// return module
	return retVal;
})();