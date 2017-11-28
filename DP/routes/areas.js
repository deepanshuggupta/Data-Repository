module.exports = (function(){
	// variables
	var retVal, sql, fs, path, config;

	// assign variables
	retVal = {};
	sql = require("mssql");
	fs = require("fs");
	path = require("path");

	// functions
	
	function handleAreasTemplate(req, res){
		res.sendFile(path.resolve('templates//areas.handlebars'));
	}


	function handleAreasGet(req, res){
		fs.readFile('data/areas.json', function (err, data) {  
			var areas = JSON.parse(data);
			res.send(areas);
		});
	}


	function handleAreasDelete(req, res){
		var areaId = req.body.areaId;

		fs.readFile('data/areas.json', function (err, data) {  
			 areas = JSON.parse(data);
			 index = areas.findIndex(function(argarea){
				if(argarea.id == areaId){
					return true;
				}
			});


			fs.readFile('data/datasets.json', function(err, data){

				var datasets=JSON.parse(data);
				var delIndex=datasets.findIndex(function(argdata){
					if(areaId==argdata.areaId){
						
						return true;
					}
				});

				console.log("delINDEX:"+delIndex+"INDEX"+index);
				if(delIndex==-1){
					areas.splice(index, 1);
					fs.writeFile('data/areas.json', JSON.stringify(areas), function(err, data){
						res.send(areaId);
					});
				}else{
					res.send("null");
				}

			});

		});
	}


	function handleAreasUpdate(req, res){
		var areaId = req.body.areaId;

		fs.readFile('data/areas.json', function (err, data) {  
			var areas = JSON.parse(data);
			var index = areas.findIndex(function(argarea){
				if(argarea.id == areaId){
					return true;
				}
			});

			var areaTU = areas[index];
			areaTU.name = req.body.name;

			fs.writeFile('data/areas.json', JSON.stringify(areas), function(err, data){
				res.send({
					areaId: areaTU.id,
					name: areaTU.name,
				});
			});
		});
	}


	function handleAreasInsert(req, res){
		fs.readFile('data/areas.json', function (err, data) {  
			var areaTA = {
				name: req.body.name.trim(),
			};
			var areas = JSON.parse(data);
			
			var index = areas.findIndex(function(argarea){	//trying to check if already existed
				if(argarea.name.trim() == areaTA.name){
					return true;
				}
			});

			if(index!=-1){
				res.send({
					oldRecord: true
				});
				return;
			}

			console.log("writeFileExecuted");

			areaTA.id = parseInt(areas.length > 0? areas[areas.length - 1].id: 0, 10) + 1;
			areas.push(areaTA);

			fs.writeFile('data/areas.json', JSON.stringify(areas), function(err, data){
				res.send({
					areaId: areaTA.id,
					name: areaTA.name,
					newRecord: true
				});
			});
		});
	}

	// define Init
	function Init(params){
		config = params.config;

		global.app.get('/areas-template/', handleAreasTemplate);
		global.app.get('/areas/', handleAreasGet);
		global.app.delete('/areas/', handleAreasDelete);
		global.app.put('/areas/', handleAreasUpdate);
		global.app.post('/areas/', handleAreasInsert);
	}

	// Call Init
	retVal.Init = Init;

	// return module
	return retVal;
})();