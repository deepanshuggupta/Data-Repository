(function(){
	// functions
	function httpServerConnected(){
		console.log('Http Server started at 3000');
	}

	// Init
	function Init(){
		// variables
		var express = require('express');
		var http = require('http');
		var cp = require("cookie-parser");
		var session = require("./middleware/session");
		var authentication = require("./middleware/authentication");
		var bp = require("body-parser");
		var routes = require("./routes/routes");

		// creating app and server
		global.app = express();
		var httpServer = http.Server(app);

		// setting up middleware
		app.use(cp());
		app.use(session);
		app.use(authentication([
			"indicators",
			"units",
			"areas",
			"subgroups",
			"datasets"
		]));

		app.use(express.static(__dirname + '/public'));

		app.use(bp.urlencoded({		//what is this??
		  extended: true
		}));
		app.use(bp.json());


		// setting up routes
		routes.Init({
			config: {
			    dir: 'data',		//ye kaunsa data hai?? Data folder
			}
		});

		// starting server
		httpServer.listen(3000, httpServerConnected);

		app.get('/save-registry', function(req, res){
			global.registryLink=req.query.registryURL;
			console.log(global.registryLink);
			
			res.send({});
		});


	}

	Init();
})();
