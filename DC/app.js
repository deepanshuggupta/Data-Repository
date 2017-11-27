(function(){
	// functions
	function httpServerConnected(){
		console.log('Http Server started at 5000');
	}

	// Init
	function Init(){
		// variables
		var express = require('express');
		var http = require('http');
		var cp = require("cookie-parser");
		var bp = require("body-parser");
		var routes = require("./routes/routes");

		// creating app and server
		global.app = express();
		var httpServer = http.Server(app);

		// setting up middleware
		app.use(cp());

		app.use(express.static(__dirname + '/public'));

		app.use(bp.urlencoded({
		  extended: true
		}));
		app.use(bp.json());


		// setting up routes
		routes.Init({
			config: {
			    dir: 'data',
			}
		});

		// starting server
		httpServer.listen(5000, httpServerConnected);
	}

	Init();
})();
