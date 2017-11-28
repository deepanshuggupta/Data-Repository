module.exports = (function(){
	// variables
	var retVal, sql, fs, path, config;

	// assign variables
	retVal = {};
	sql = require("mssql");
	fs = require("fs");
	path = require("path");
	var request =require("request");
	var url =require("url");


	// functions
	
	function handleDatasetsTemplate(req, res){
		res.sendFile(path.resolve('templates//datasets.handlebars'));
	}


	function handleDatasetsGet(req, res){
		var result={};

		fs.readFile('data/datasets.json', function (err, data) {  
			var datasets = JSON.parse(data);
			result.datasets=datasets;
			sendResponse(res, result);
		});

		fs.readFile('data/indicators.json', function (err, data) {  
			var indicators = JSON.parse(data);
			result.indicators=indicators;
			sendResponse(res, result);
		});

		fs.readFile('data/subgroups.json', function (err, data) {  
			var subgroups=JSON.parse(data);
			result.subgroups=subgroups;
			sendResponse(res, result);
		});

		fs.readFile('data/units.json', function (err, data) {  
			var units = JSON.parse(data);
			result.units=units;
			sendResponse(res, result);
		});

		fs.readFile('data/areas.json', function (err, data) {  
			var areas = JSON.parse(data);
			result.areas=areas;
			sendResponse(res, result);
		});
	}

	function sendResponse(res, result){
		if(result.datasets && result.indicators && result.subgroups && result.units && result.areas){
			
			result.datasets.forEach(function(elem){

				var unitId=elem.unitId;
				var unitIdIndex=result.units.findIndex(function(argunit){
					if(argunit.id==unitId){
						return true;
					}
				});		
				elem.unitName=result.units[unitIdIndex].name;


				var areaId=elem.areaId;
				var areaIdIndex=result.areas.findIndex(function(argarea){
					if(argarea.id==areaId){
						return true;
					}
				});
				elem.areaName=result.areas[areaIdIndex].name;


				var subgroupId=elem.subgroupId;
				var subgroupIdIndex=result.subgroups.findIndex(function(argsubgroup){
					if(argsubgroup.id==subgroupId){
						return true;
					}
				});

				// console.log(subgroupId);
				console.log(subgroupIdIndex);


				elem.subgroupName=result.subgroups[subgroupIdIndex].name;

				var indicatorId=elem.indicatorId;
				var indicatorIdIndex=result.indicators.findIndex(function(argindicator){
					if(argindicator.id==indicatorId){
						return true;	
					}
				});
				// indicatorIdIndex=indicatorIdIndex.trim();
				elem.indicatorName=result.indicators[indicatorIdIndex].name;

			});

			res.send(result);
		}
	}


	function handleDatasetsDelete(req, res){
		var datasetId = req.body.datasetId;

		fs.readFile('data/datasets.json', function (err, data) {  
			var datasets = JSON.parse(data);
			var index = datasets.findIndex(function(argdataset){
				if(argdataset.id == datasetId){
					return true;
				}
			});

			datasets.splice(index, 1);
			fs.writeFile('data/datasets.json', JSON.stringify(datasets), function(err, data){
				res.send(datasetId);
			});
		});
	}


	function handleDatasetsUpdate(req, res){
		console.log(global.registryLink);
		var datasetId = req.body.datasetId;
		var datasetTU = {};
		
		fs.readFile('data/datasets.json', function (err, data) {  
			var datasets = JSON.parse(data);
			var index = datasets.findIndex(function(argdataset){
				if(argdataset.id == datasetId){
					return true;
				}
			});
			datasetTU=datasets[index];
			datasetTU.indicatorId=req.body.indicatorId;
			datasetTU.indicatorName=req.body.indicatorName;
			datasetTU.unitId=req.body.unitId;
			datasetTU.unitName=req.body.unitName;
			datasetTU.areaId=req.body.areaId;
			datasetTU.areaName=req.body.areaName;
			datasetTU.subgroupId=req.body.subgroupId;
			datasetTU.subgroupName=req.body.subgroupName;
			datasetTU.timeperiod = req.body.timeperiod;
			datasetTU.url = req.get('host');
			datasetTU.data = req.body.data;

			fs.writeFile('data/datasets.json', JSON.stringify(datasets), function(err, data){
					request.post({
						url:global.registryLink + "/send-message", 
						form: datasetTU
					}, function(err,httpResponse,body){
						res.send({
							datasetId: datasetTU.id,
							datasetIndicatorId:datasetTU.indicatorId,
							datasetIndicatorName: datasetTU.indicatorName,
							datasetUnitId:datasetTU.unitId,
							datasetUnitName: datasetTU.unitName,
							datasetAreaId:datasetTU.areaId,
							datasetAreaName:datasetTU.areaName,
							datasetSubgroupId:datasetTU.subgroupId,
							datasetSubgroupName:datasetTU.subgroupName,
							datasetTimeperiod:datasetTU.timeperiod,
							datasetData:datasetTU.data
						});
					});
				});
		});
	}


	function handleDatasetsInsert(req, res){
		var datasetId = req.body.datasetId;
		var datasetTU = {};
		
		fs.readFile('data/datasets.json', function (err, data) {  
			var datasets = JSON.parse(data);
			datasetTU.id = parseInt(datasets.length>0?datasets[datasets.length - 1].id:0, 10) + 1;
			datasetTU.indicatorId=req.body.indicatorId;
			datasetTU.indicatorName=req.body.indicatorName;
			datasetTU.unitId=req.body.unitId;
			datasetTU.unitName=req.body.unitName;
			datasetTU.areaId=req.body.areaId;
			datasetTU.areaName=req.body.areaName;
			datasetTU.subgroupId=req.body.subgroupId;
			datasetTU.subgroupName=req.body.subgroupName;
			datasetTU.timeperiod = req.body.timeperiod;
			datasetTU.data = req.body.data;
			datasetTU.url = req.get('host');
			datasets.push(datasetTU);

			fs.writeFile('data/datasets.json', JSON.stringify(datasets), function(err, data){
					request.post({
						url:global.registryLink + "/send-message", 
						form: datasetTU
					}, function(err,httpResponse,body){
						res.send({
							datasetId: datasetTU.id,
							datasetIndicatorId:datasetTU.indicatorId,
							datasetIndicatorName: datasetTU.indicatorName,
							datasetUnitId:datasetTU.unitId,
							datasetUnitName: datasetTU.unitName,
							datasetAreaId:datasetTU.areaId,
							datasetAreaName:datasetTU.areaName,
							datasetSubgroupId:datasetTU.subgroupId,
							datasetSubgroupName:datasetTU.subgroupName,
							datasetTimeperiod:datasetTU.timeperiod,
							datasetData:datasetTU.data,
							newRecord: true
						});
					});
				});
		});

	}

	// define Init
	function Init(params){
		config = params.config;

		global.app.get('/datasets-template/', handleDatasetsTemplate);
		global.app.get('/datasets/', handleDatasetsGet);
		global.app.delete('/datasets/', handleDatasetsDelete);
		global.app.put('/datasets/', handleDatasetsUpdate);
		global.app.post('/datasets/', handleDatasetsInsert);
	}

	// Call Init
	retVal.Init = Init;

	// return module
	return retVal;
})();