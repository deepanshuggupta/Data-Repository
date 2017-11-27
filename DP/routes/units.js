module.exports = (function(){
	// variables
	var retVal, sql, fs, path, config;

	// assign variables
	retVal = {};
	sql = require("mssql");
	fs = require("fs");
	path = require("path");

	// functions
	
	function handleUnitsTemplate(req, res){
		res.sendFile(path.resolve('templates//units.handlebars'));
	}


	function handleUnitsGet(req, res){
		fs.readFile('data/units.json', function (err, data) {  
			var units = JSON.parse(data);
			res.send(units);
		});
	}


	function handleUnitsDelete(req, res){
		var unitId = req.body.unitId;

		fs.readFile('data/units.json', function (err, data) {  
			var units = JSON.parse(data);
			var index = units.findIndex(function(argunit){
				if(argunit.id == unitId){
					return true;
				}
			});

			units.splice(index, 1);
			fs.writeFile('data/units.json', JSON.stringify(units), function(err, data){
				res.send(unitId);
			});
		});
	}


	function handleUnitsUpdate(req, res){
		var unitId = req.body.unitId;

		fs.readFile('data/units.json', function (err, data) {  
			var units = JSON.parse(data);
			var index = units.findIndex(function(argunit){
				if(argunit.id == unitId){
					return true;
				}
			});

			var unitTU = units[index];
			unitTU.name = req.body.name;
			unitTU.desc = req.body.desc;

			fs.writeFile('data/units.json', JSON.stringify(units), function(err, data){
				res.send({
					unitId: unitTU.id,
					name: unitTU.name,
					desc: unitTU.desc
				});
			});
		});
	}


	function handleUnitsInsert(req, res){
		fs.readFile('data/units.json', function (err, data) {  
			var unitTA = {
				name: req.body.name,
				desc: req.body.desc
			};
			var units = JSON.parse(data);
			unitTA.id = parseInt(units[units.length - 1].id, 10) + 1;
			units.push(unitTA);

			fs.writeFile('data/units.json', JSON.stringify(units), function(err, data){
				res.send({
					unitId: unitTA.id,
					name: unitTA.name,
					desc: unitTA.desc,
					newRecord: true
				});
			});
		});
	}

	// define Init
	function Init(params){
		config = params.config;

		global.app.get('/units-template/', handleUnitsTemplate);
		global.app.get('/units/', handleUnitsGet);
		global.app.delete('/units/', handleUnitsDelete);
		global.app.put('/units/', handleUnitsUpdate);
		global.app.post('/units/', handleUnitsInsert);
	}

	// Call Init
	retVal.Init = Init;

	// return module
	return retVal;
})();