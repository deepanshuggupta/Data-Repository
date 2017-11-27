module.exports = (function(){
	// variables
	var retVal, sql, fs, path, config;

	// assign variables
	retVal = {};
	sql = require("mssql");
	fs = require("fs");
	path = require("path");

	// functions
	
	function handleConsumersTemplate(req, res){
		res.sendFile(path.resolve('templates//consumers.handlebars'));
	}


	function handleConsumersGet(req, res){
		result={};

		fs.readFile('data/consumers.json', function (err, data) {  
			var consumers = JSON.parse(data);
			result.consumers=consumers;
			sendResponse(result, res);
		});

		fs.readFile('data/providers.json', function(err, data){
			var providers=JSON.parse(data);
			result.providers=providers;
			sendResponse(result, res);
		});

	}

	function sendResponse(result, res){
		if(result.providers&&result.consumers){
			res.send(result);
		}

	}


	function handleConsumersDelete(req, res){
		var consumerId = req.body.consumerId;

		fs.readFile('data/consumers.json', function (err, data) {  
			var consumers = JSON.parse(data);
			var index = consumers.findIndex(function(argconsumer){
				if(argconsumer.id == consumerId){
					return true;
				}
			});

			consumers.splice(index, 1);
			fs.writeFile('data/consumers.json', JSON.stringify(consumers), function(err, data){
				res.send(consumerId);
			});
		});
	}


	function handleConsumersUpdate(req, res){
		var consumerId = req.body.consumerId;

		fs.readFile('data/consumers.json', function (err, data) {  
			var consumers = JSON.parse(data);
			var index = consumers.findIndex(function(argconsumer){
				if(argconsumer.id == consumerId){
					return true;
				}
			});

			var consumerTU = consumers[index];
			consumerTU.name = req.body.name;
			consumerTU.desc=req.body.desc;
			consumerTU.link = req.body.link;
			consumerTU.subscription = req.body.multiselectIds;

			fs.writeFile('data/consumers.json', JSON.stringify(consumers), function(err, data){
				res.send({
					consumerId: consumerTU.id,
					name: consumerTU.name,
					desc: consumerTU.desc,
					link: consumerTU.link,
					subscription: consumerTU.subscription
				});
			});
		});
	}


	function handleConsumersInsert(req, res){
		fs.readFile('data/consumers.json', function (err, data) {  
			var consumerTA = {
				name: req.body.name,
				desc:req.body.desc,
				link: req.body.link,
				subscription: req.body.multiselectIds
			};
			var consumers = JSON.parse(data);
			consumerTA.id = parseInt(consumers.length>0?consumers[consumers.length - 1].id:0, 10) + 1;
			consumers.push(consumerTA);

			fs.writeFile('data/consumers.json', JSON.stringify(consumers), function(err, data){
				res.send({
					consumerId: consumerTA.id,
					name: consumerTA.name,
					desc:consumerTA.desc,
					link: consumerTA.link,
					subscription: consumerTA.subscription,
					newRecord: true
				});
			});
		});
	}

	// define Init
	function Init(params){
		config = params.config;

		global.app.get('/consumers-template/', handleConsumersTemplate);
		global.app.get('/consumers/', handleConsumersGet);
		global.app.delete('/consumers/', handleConsumersDelete);
		global.app.put('/consumers/', handleConsumersUpdate);
		global.app.post('/consumers/', handleConsumersInsert);
	}

	// Call Init
	retVal.Init = Init;

	// return module
	return retVal;
})();