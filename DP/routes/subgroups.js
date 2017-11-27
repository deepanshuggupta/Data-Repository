module.exports = (function(){
	// variables
	var retVal, sql, fs, path, config;

	// assign variables
	retVal = {};
	sql = require("mssql");
	fs = require("fs");
	path = require("path");

	// functions
	
	function handleSubgroupsTemplate(req, res){
		res.sendFile(path.resolve('templates//subgroups.handlebars'));
	}


	function handleSubgroupsGet(req, res){
		fs.readFile('data/subgroups.json', function (err, data) {  
			var subgroups = JSON.parse(data);
			res.send(subgroups);
		});
	}


	function handleSubgroupsDelete(req, res){
		var subgroupId = req.body.subgroupId;

		fs.readFile('data/subgroups.json', function (err, data) {  
			var subgroups = JSON.parse(data);
			var index = subgroups.findIndex(function(argsubgroup){
				if(argsubgroup.id == subgroupId){
					return true;
				}
			});

			subgroups.splice(index, 1);
			fs.writeFile('data/subgroups.json', JSON.stringify(subgroups), function(err, data){
				res.send(subgroupId);
			});
		});
	}


	function handleSubgroupsUpdate(req, res){
		var subgroupId = req.body.subgroupId;

		fs.readFile('data/subgroups.json', function (err, data) {  
			var subgroups = JSON.parse(data);
			var index = subgroups.findIndex(function(argsubgroup){
				if(argsubgroup.id == subgroupId){
					return true;
				}
			});

			var subgroupTU = subgroups[index];
			subgroupTU.name = req.body.name;
			subgroupTU.desc = req.body.desc;

			fs.writeFile('data/subgroups.json', JSON.stringify(subgroups), function(err, data){
				res.send({
					subgroupId: subgroupTU.id,
					name: subgroupTU.name,
					desc: subgroupTU.desc
				});
			});
		});
	}


	function handleSubgroupsInsert(req, res){
		fs.readFile('data/subgroups.json', function (err, data) {  
			var subgroupTA = {
				name: req.body.name,
				desc: req.body.desc
			};
			var subgroups = JSON.parse(data);
			subgroupTA.id = parseInt(subgroups[subgroups.length - 1].id, 10) + 1;
			subgroups.push(subgroupTA);

			fs.writeFile('data/subgroups.json', JSON.stringify(subgroups), function(err, data){
				res.send({
					subgroupId: subgroupTA.id,
					name: subgroupTA.name,
					desc: subgroupTA.desc,
					newRecord: true
				});
			});
		});
	}

	// define Init
	function Init(params){
		config = params.config;

		global.app.get('/subgroups-template/', handleSubgroupsTemplate);
		global.app.get('/subgroups/', handleSubgroupsGet);
		global.app.delete('/subgroups/', handleSubgroupsDelete);
		global.app.put('/subgroups/', handleSubgroupsUpdate);
		global.app.post('/subgroups/', handleSubgroupsInsert);
	}

	// Call Init
	retVal.Init = Init;

	// return module
	return retVal;
})();