var datasheets = (function(){
	var retval = {};
	var injectContentToBody;

	function Init(params){
		injectContentToBody = params.injectContentToBody;
		
	}


	function handleHash(){
		prepareDatasheets.data = null;

		$.ajax({
			url: '/datasheets/',
			data: null,
			dataType: 'json',
			method: 'GET',
			success: datasheetsGetDataSuccessHandler,
			error: null
		});

		if(!prepareDatasheets.templateFunction){
			$.ajax({
				url: '/datasheets-template/',
				data: null,
				dataType: 'text',
				method: 'GET',
				success: datasheetsGetTemplateSuccessHandler,
				error: null
			});
		}
	}

	function datasheetsGetDataSuccessHandler(data){
			prepareDatasheets.data = data;
			prepareDatasheets();
	}

	function datasheetsGetTemplateSuccessHandler(template){
		prepareDatasheets.templateFunction = Handlebars.compile(template);
		prepareDatasheets();
	}

	function prepareDatasheets(){
		if(prepareDatasheets.data && prepareDatasheets.templateFunction){
			var bodyContentHtml = prepareDatasheets.templateFunction(
								  prepareDatasheets.data);
			injectContentToBody(bodyContentHtml);
		}
	}


	retval.Init = Init;
	retval.handleHash = handleHash;

	return retval;
})();