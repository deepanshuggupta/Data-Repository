module.exports = function(urlsToAuthenticate){
	return function(req, res, next){
		var url = req._parsedUrl || "/";
		var url = req._parsedUrl.pathname.substring(1);
		
		if(url.indexOf("/") !== -1){
			url = url.substring(0, url.indexOf("/"));
		}

		var foundAt = urlsToAuthenticate.findIndex(function(authenticatedUrl){
			return authenticatedUrl === url;
		});

		if(!req.session.IsLoggedIn && foundAt !== -1){
			res.send({
				IsLoggedIn: false
			});
			res.end();
		}
		else {
			next();
		}
	}
};