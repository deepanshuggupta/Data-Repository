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
			case "datasheets":
				datasheets.handleHash();
				break;
			case "chartings":
				chartings.handleHash();
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
	
	// define init
	function Init(){
		$(window).on("hashchange", handleHashChange);
		datasheets.Init({ //this is calling indicators.init of public 
			injectContentToBody: injectContentToBody
		});
		chartings.Init({
			injectContentToBody: injectContentToBody
		});

		handleHashChange();
	}

	// call init
	Init();
})();