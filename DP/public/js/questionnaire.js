(function(){
	// variables
	var $bodyContent;

	// assign variables
	$bodyContent = $('#bodyContent');

	// functions
	function handleHashChange(){
		var hash;

		if(location.hash.substring(1).indexOf("/") !== -1){
			hash = location.hash.substring(1, location.hash.substring(1).indexOf("/") + 1);
		}
		else {
			hash = location.hash.substring(1);
		}

		switch(hash){
			case "indicators":
				indicators.handleHash();
				break;
			case "units":
				units.handleHash();
				break;
			case "areas":
				areas.handleHash();
				break;
			case "subgroups":
				subgroups.handleHash();
				break;
			case "datasets":
				datasets.handleHash();
				break;
			case "login":
				login.handleHash();
				break;
			case "logout":
				logout.handleHash();
				break;
			default:
				break;
		}

		if(window.location.hash){
			$('nav.navbar ul li').removeClass('active');
			$('nav.navbar ul li a[href="#' + hash + '"]')
			.parent()
			.addClass('active');
		}
	}

	function injectContentToBody(bodyContentHtml){
		$bodyContent.empty();
		$bodyContent.html(bodyContentHtml);
	}
	
	function getInitData(){
		$.ajax({
			url: '/init/',
			data: null,
			dataType: 'json',
			method: 'GET',
			success: getInitDataSuccessHandler,
			error: null
		});
	}

	function getInitDataSuccessHandler(data){
		if(data.IsLoggedIn){
			$('#liUser, #liLogout').removeClass('hidden');
			$('#liUser a').html('Hi ' + data.user);
			$('#liLogin').addClass('hidden');
		}
		else{
			$('#liUser, #liLogout').addClass('hidden');
			$('#liUser a').html('');
			$('#liLogin').removeClass('hidden');
		}
	}

	// define init
	function Init(){
		$(window).on("hashchange", handleHashChange);
		indicators.Init({ //this is calling indicators.init of public 
			injectContentToBody: injectContentToBody
		});
		units.Init({
			injectContentToBody: injectContentToBody
		});
		areas.Init({
			injectContentToBody: injectContentToBody
		});
		subgroups.Init({
			injectContentToBody: injectContentToBody
		});
		datasets.Init({
			injectContentToBody: injectContentToBody
		});
		login.Init({
			injectContentToBody: injectContentToBody
		});
		logout.Init({
			injectContentToBody: injectContentToBody
		});

		handleHashChange();
		getInitData();
	}

	// call init
	Init();
})();