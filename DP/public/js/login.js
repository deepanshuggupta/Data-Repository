var login = (function(){
	var retval = {};
	var injectContentToBody;

	function Init(params){
		injectContentToBody = params.injectContentToBody;
		
		// attach events
		$(document).on("click", "#divLoginTemplate #btnLogin", handleLoginPost);
	}

	function handleHash(){
		if(!prepareLogin.templateFunction){
			$.ajax({
				url: '/login/',
				data: null,
				dataType: 'text',
				method: 'GET',
				success: loginGetTemplateSuccessHandler,
				error: null
			});
		}
		else {
			prepareLogin();
		}

		return false;
	}

	function loginGetTemplateSuccessHandler(template){
		prepareLogin.templateFunction = Handlebars.compile(template);
		prepareLogin();
	}

	function prepareLogin(){
		var bodyContentHtml = prepareLogin.templateFunction({});
		injectContentToBody(bodyContentHtml);
	}

	function handleLoginPost(){
		$.ajax({
			url: '/login/',
			data: {
				user: $('#divLoginTemplate #txtUser').val(),
				password: $('#divLoginTemplate #txtPwd').val()
			},
			dataType: 'json',
			method: 'POST',
			success: handleLoginPostSuccessHandler,
			error: null
		});

		return false;
	}

	function handleLoginPostSuccessHandler(data){
		if(data.result){
			window.location.href = "/";
		}
		else {
			alert("Login Failed. Try again");
		}
	}

	retval.Init = Init;
	retval.handleHash = handleHash;

	return retval;
})();