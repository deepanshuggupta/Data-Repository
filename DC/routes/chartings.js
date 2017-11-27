module.exports = (function(){
	// variables
	var retVal, sql, fs, path, config;

	// assign variables
	retVal = {};
	fs = require("fs");
	path = require("path");

	// functions
	
	function handleChartingsGet(req, res){
		var result={};

		fs.readFile('data/datasheets.json', function (err, data) {  
			var datasets = JSON.parse(data);
			result.datasets=datasets;

			result.indicators = [];
			result.units = [];
			result.subgroups = [];
			result.areas = [];

			for(i = 0; i < datasets.length; i++){
				// indicators
				var indicator = {
					id: datasets[i].indicatorId,
					name: datasets[i].indicatorName
				};

				var indIndx = result.indicators.findIndex(function(argind){
					if(argind.id == indicator.id){
						return true;
					}
				});

				if(indIndx == -1){
					result.indicators.push(indicator);
				}

				// units
				var unit = {
					id: datasets[i].unitId,
					name: datasets[i].unitName
				};

				var unitIndx = result.units.findIndex(function(argunit){
					if(argunit.id == unit.id){
						return true;
					}
				});

				if(unitIndx == -1){
					result.units.push(unit);
				}

				// subgroups
				var subgroup = {
					id: datasets[i].subgroupId,
					name: datasets[i].subgroupName
				};

				var subgroupIndx = result.subgroups.findIndex(function(argsubgroup){
					if(argsubgroup.id == subgroup.id){
						return true;
					}
				});

				if(subgroupIndx == -1){
					result.subgroups.push(subgroup);
				}

				// areas
				var area = {
					id: datasets[i].areaId,
					name: datasets[i].areaName
				};

				var areaIndx = result.areas.findIndex(function(argarea){
					if(argarea.id == area.id){
						return true;
					}
				});

				if(areaIndx == -1){
					result.areas.push(area);
				}
			}


			sendResponse(res, result);
		});
	}

	function sendResponse(res, result){
		if(result.datasets && result.indicators && result.subgroups && result.units && result.areas){
			res.send(result);
		}
	}

	function handleChartingsTemplate(req, res){
		res.sendFile(path.resolve('templates//chartings.handlebars'));
	}


	function handlePostCharting(req, res){
		var result=[];

		fs.readFile('data/datasheets.json', function (err, data) {  
			var datasets = JSON.parse(data);
			
			if(req.body.areaId != ""){
				datasets.forEach(function(elem,idx){
					if(elem.indicatorId==req.body.indicatorId&&
						elem.unitId==req.body.unitId&&
						elem.subgroupId==req.body.subgroupId &&
						elem.areaId == req.body.areaId){

						var tempRes={};
						tempRes.name=elem.indicatorName + " for " + elem.timeperiod;
						tempRes.value=elem.data;

						result.push(tempRes);
					}
				});
			} else {
				datasets.forEach(function(elem,idx){
					if(elem.indicatorId==req.body.indicatorId&&
						elem.unitId==req.body.unitId&&
						elem.subgroupId==req.body.subgroupId &&
						elem.timeperiod == req.body.timeperiod){

						var tempRes={};
						tempRes.name=elem.indicatorName + " for " + elem.areaName;;
						tempRes.value=elem.data;

						result.push(tempRes);
					}
				});
			}

			res.send( JSON.stringify(result));
		});
		

	}

	// define Init
	function Init(params){
		config = params.config;
		global.app.get('/chartings', handleChartingsGet );
		global.app.get('/chartings-template/', handleChartingsTemplate);
		global.app.post('/chartings', handlePostCharting);
	}

	// Call Init
	retVal.Init = Init;

	// return module
	return retVal;
})();