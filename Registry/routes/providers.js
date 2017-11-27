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
	
	function handleProvidersTemplate(req, res){
		res.sendFile(path.resolve('templates//providers.handlebars'));
	}


	function handleProvidersGet(req, res){
		fs.readFile('data/providers.json', function (err, data) {  
			var providers = JSON.parse(data);
			res.send(providers);
		});
	}


	function handleProvidersDelete(req, res){
		var providerId = req.body.providerId;

		fs.readFile('data/providers.json', function (err, data) {  
			var providers = JSON.parse(data);
			var index = providers.findIndex(function(argprovider){
				if(argprovider.id == providerId){
					return true;		//with this return if true, index will get the value otherwise if false then -1
				}
			});

			providers.splice(index, 1);
			fs.writeFile('data/providers.json', JSON.stringify(providers), function(err, data){
				res.send(providerId);
			});
		});
	}


	function handleProvidersUpdate(req, res){
		var providerId = req.body.providerId;

		fs.readFile('data/providers.json', function (err, data) {  
			var providers = JSON.parse(data);
			var index = providers.findIndex(function(argprovider){
				if(argprovider.id == providerId){
					return true;
				}
			});

			var providerTU = providers[index];
			providerTU.name = req.body.name;
			providerTU.desc = req.body.desc;
			providerTU.link = req.body.link;

			//yahan par providers file me toh data change nahi ho raha par hum phle hi write kar rahe hain??

			fs.writeFile('data/providers.json', JSON.stringify(providers), function(err, data){
				options={
					protocol:'http:',
					host:req.body.link,
					pathname:'/save-registry',
					query:{registryURL:req.protocol+'://'+ req.get('host')}
				};

				var providerURL=url.format(options);

				request(providerURL, function(err, response, body){
					res.send({
						providerId: providerTU.id,
						name: providerTU.name,
						desc: providerTU.desc,
						link: providerTU.link
					});
				});
				
			});

		});
		
	}


	function handleProvidersInsert(req, res){
		fs.readFile('data/providers.json', function (err, data) {  
			var providerTA = {
				name: req.body.name,
				desc: req.body.desc,
				link: req.body.link
			};
			var providers = JSON.parse(data);
			providerTA.id = parseInt(providers.length>0?providers[providers.length - 1].id:0, 10) + 1;
			providers.push(providerTA);

			fs.writeFile('data/providers.json', JSON.stringify(providers), function(err, data){

				options={
					protocol:'http:',
					host:req.body.link,
					pathname:'/save-registry',
					query:{registryURL:req.protocol+'://'+ req.get('host')}
				};

				var providerURL=url.format(options);

					// console.log("hi:"+providerURL);

				request(providerURL, function(err, response, body){
					res.send({
						providerId: providerTA.id,
						name: providerTA.name,
						desc: providerTA.desc,
						link:providerTA.link,
						newRecord: true
					});
				});

			});
		});
	}

	function handleSaveMessage(req, res){
		fs.readFile('data/providers.json', function(err, data){
			var providers=JSON.parse(data);
			
			var index = providers.findIndex(function(argprovider){
				if(argprovider.link == req.body.url){
					return true;
				}
			});

			
 
			var pid = providers[index].id;
			console.log(index + '-' + providers[index].id);

			fs.readFile('data/consumers.json', function(err, data){
				var consumers = JSON.parse(data);
				var interestedConsumers = consumers.filter(function(argConsumer){
					if(argConsumer.subscription.indexOf(pid + "") != -1){
						return true;
					}
				});

				for(i = 0; i < interestedConsumers.length; i++){
					request.post({
						url: "http://" + interestedConsumers[i].link + "/send-message", 
						form: req.body
					});
				}

				res.send('');
			});
		});

		

		
	}

	// define Init
	function Init(params){
		config = params.config;

		global.app.get('/providers-template/', handleProvidersTemplate);
		global.app.get('/providers/', handleProvidersGet);
		global.app.delete('/providers/', handleProvidersDelete);
		global.app.put('/providers/', handleProvidersUpdate);
		global.app.post('/providers/', handleProvidersInsert);
		global.app.post('/send-message', handleSaveMessage);
	}

	// Call Init
	retVal.Init = Init;

	// return module
	return retVal;
})();