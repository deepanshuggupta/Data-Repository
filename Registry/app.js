(function(){
	// functions
	function httpServerConnected(){
		console.log('Http Server started 4000');
	}

	// Init
	function Init(){
		// variables
		var express = require('express');
		var http = require('http');
		var bp = require("body-parser");
		var routes = require("./routes/routes");


		// creating app and server
		global.app = express();
		var httpServer = http.Server(app);

		// setting up middleware

		app.use(express.static(__dirname + '/public'));

		app.use(bp.urlencoded({
		  extended: true
		}));
		app.use(bp.json());


		// setting up routes
		routes.Init({
			config: {
			    dir: 'data',	//which data is this?? This is 
			}
		});

		// starting server
		httpServer.listen(4000, httpServerConnected);
	}

	Init();
})();
