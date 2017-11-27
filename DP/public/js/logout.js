var logout = (function(){
	var retval = {};
	var injectContentToBody;

	function Init(params){
		injectContentToBody = params.injectContentToBody;
	}

	function handleHash(){
		$.ajax({
			url: '/logout/',
			data: null,
			dataType: 'text',
			method: 'GET',
			success: logoutSuccessHandler,
			error: null
		});
	}

	function logoutSuccessHandler(){
		window.location.href = "/";
	}

	retval.Init = Init;
	retval.handleHash = handleHash;

	return retval;
})();