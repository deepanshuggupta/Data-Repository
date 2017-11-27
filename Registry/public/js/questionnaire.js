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
			case "providers":
				providers.handleHash();
				break;
			case "consumers":
				consumers.handleHash();
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
	function Init(){	//IFFI, always running, hashChange event is set  											
		$(window).on("hashchange", handleHashChange);
		providers.Init({ //this is calling indicators.init of public 
			injectContentToBody: injectContentToBody
		});                                                                                                     
		consumers.Init({
			injectContentToBody: injectContentToBody
		});

		handleHashChange();
	}

	// call init
	Init();
})();