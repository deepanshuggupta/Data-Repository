module.exports = (function(){
	// variables
	var retVal, sql, fs, path, config;

	// assign variables
	retVal = {};
	sql = require("mssql");
	fs = require("fs");
	path = require("path");

	// functions
	
	function handleIndicatorsTemplate(req, res){
		res.sendFile(path.resolve('templates//indicators.handlebars'));
	}


	function handleIndicatorsGet(req, res){
		fs.readFile('data/indicators.json', function (err, data) {  
			var indicators = JSON.parse(data);
			res.send(indicators);
		});
	}


	function handleIndicatorsDelete(req, res){
		var indicatorId = req.body.indicatorId;

		fs.readFile('data/indicators.json', function (err, data) {  
			var indicators = JSON.parse(data);
			var index = indicators.findIndex(function(argindicator){
				if(argindicator.id == indicatorId){
					return true;
				}
			});

			indicators.splice(index, 1);
			fs.writeFile('data/indicators.json', JSON.stringify(indicators), function(err, data){
				res.send(indicatorId);
			});
		});
	}


	function handleIndicatorsUpdate(req, res){
		var indicatorId = req.body.indicatorId;

		fs.readFile('data/indicators.json', function (err, data) {  
			var indicators = JSON.parse(data);
			var index = indicators.findIndex(function(argindicator){
				if(argindicator.id == indicatorId){
					return true;
				}
			});

			var indicatorTU = indicators[index];
			indicatorTU.name = req.body.name;
			indicatorTU.desc = req.body.desc;

			fs.writeFile('data/indicators.json', JSON.stringify(indicators), function(err, data){
				res.send({
					indicatorId: indicatorTU.id,
					name: indicatorTU.name,
					desc: indicatorTU.desc
				});
			});
		});
	}


	function handleIndicatorsInsert(req, res){
		fs.readFile('data/indicators.json', function (err, data) {  
			var indicatorTA = {
				name: req.body.name,
				desc: req.body.desc
			};
			var indicators = JSON.parse(data);
			indicatorTA.id = parseInt(indicators[indicators.length - 1].id, 10) + 1;
			indicators.push(indicatorTA);

			fs.writeFile('data/indicators.json', JSON.stringify(indicators), function(err, data){
				res.send({
					indicatorId: indicatorTA.id,
					name: indicatorTA.name,
					desc: indicatorTA.desc,
					newRecord: true
				});
			});
		});
	}

	// define Init
	function Init(params){
		config = params.config;

		global.app.get('/indicators-template/', handleIndicatorsTemplate);
		global.app.get('/indicators/', handleIndicatorsGet);
		global.app.delete('/indicators/', handleIndicatorsDelete);
		global.app.put('/indicators/', handleIndicatorsUpdate);
		global.app.post('/indicators/', handleIndicatorsInsert);
	}

	// Call Init
	retVal.Init = Init;

	// return module
	return retVal;
})();