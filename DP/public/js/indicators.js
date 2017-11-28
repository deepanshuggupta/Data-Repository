var indicators = (function(){
	var retval = {};
	var injectContentToBody;

	function Init(params){
		injectContentToBody = params.injectContentToBody;
		
		// attach events
		$(document).on("click", 
			"#divIndicatorsTemplate [action=delete]", 
			handleIndicatorDelete);
		$(document).on("click", 
			"#divIndicatorsTemplate [action=edit]", 
			handleIndicatorEdit);
		$(document).on("click", 
			"#divIndicatorsTemplate [action=create]", 
			handleIndicatorCreate);
		$(document).on("click", 
			"#divIndicatorsTemplate #btnSaveIndicator", 
			handleSaveIndicator);
	}

	function handleHash(){
		prepareIndicators.data = null;

		$.ajax({
			url: '/indicators/',
			data: null,
			dataType: 'json',
			method: 'GET',
			success: indicatorsGetDataSuccessHandler,
			error: null
		});

		if(!prepareIndicators.templateFunction){
			$.ajax({
				url: '/indicators-template/',
				data: null,
				dataType: 'text',
				method: 'GET',
				success: indicatorsGetTemplateSuccessHandler,
				error: null
			});
		}
	}

	function indicatorsGetDataSuccessHandler(data){
		if(data.IsLoggedIn === false){
			injectContentToBody("<p>Please <a href='#login'>Login</a> to manage indicators</p>");
		}
		else{
			prepareIndicators.data = data;
			prepareIndicators();
		}
	}

	function indicatorsGetTemplateSuccessHandler(template){
		prepareIndicators.templateFunction = Handlebars.compile(template);
		prepareIndicators();
	}

	function prepareIndicators(){
		if(prepareIndicators.data && prepareIndicators.templateFunction){
			var bodyContentHtml = prepareIndicators.templateFunction(
				prepareIndicators.data);
			injectContentToBody(bodyContentHtml);
		}
	}

	function handleIndicatorDelete(){
		if(window.confirm("Are you sure you want to delete this indicator?")){
			$.ajax({
				url: '/indicators/',
				data: {
					indicatorId: $(this).closest('[indicator-id]').attr('indicator-id')
				},
				method: 'DELETE',
				success: deleteIndicatorSuccessHandler,
				error: null
			});
		}
	}

	function deleteIndicatorSuccessHandler(data){
		if(data=="null"){
			alert("Can't delete this indicator, Used in datasets!!");

		}else{
			alert("indicator deleted successfully.");
			$('#divIndicatorsTemplate div[indicator-id=' + data + ']').remove();
		}

	}

	function handleIndicatorEdit(){
		$('#divIndicatorsTemplate #titleIndicatorModal')
		.html('Update Indicator');

		$('#divIndicatorsTemplate #hdnIndicatorIdModal')
		.val($(this).closest('[indicator-id]').attr('indicator-id'));

		$('#divIndicatorsTemplate #txtName')
		.val($(this).closest('[indicator-id]').find('[purpose=name]').html());

		$('#divIndicatorsTemplate #txtDescription')
		.val($(this).closest('[indicator-id]').find('[purpose=description]').html());

		$('#divIndicatorsTemplate #divIndicatorModal').modal('show');
	}

	function handleIndicatorCreate(){
		$('#divIndicatorsTemplate #titleIndicatorModal')
		.html('Add Indicator');

		$('#divIndicatorsTemplate #hdnIndicatorIdModal')
		.val('');

		$('#divIndicatorsTemplate #txtName')
		.val('');

		$('#divIndicatorsTemplate #txtDescription')
		.val('');

		$('#divIndicatorsTemplate #divIndicatorModal').modal('show');
	}

	function handleSaveIndicator(){
		var indicatorId = $('#divIndicatorsTemplate #hdnIndicatorIdModal').val();
		var name = $('#divIndicatorsTemplate #txtName').val();
		var desc = $('#divIndicatorsTemplate #txtDescription').val();

		$.ajax({
			url: '/indicators/',
			data: {
				indicatorId: indicatorId,
				name: name,
				desc: desc
			},
			dataType: 'json',
			method: indicatorId === ''? 'POST': 'PUT',
			success: saveIndicatorSuccessHandler,
			error: null
		});
	}

	function saveIndicatorSuccessHandler(data){
		if(data.newRecord){
			var $div = $('#divIndicatorsTemplate').find('[purposeEx=example]').clone();

			$div.removeClass('hide');
			$div.attr('indicator-id', data.indicatorId);
			$div.find('[purpose=name]').html(data.name);
			$div.find('[purpose=description]').html(data.desc);

			$('#divIndicatorsTemplate').append($div);
		}
		else{
			var $div = $('#divIndicatorsTemplate div[indicator-id=' + data.indicatorId + ']');

			$div.attr('indicator-id', data.indicatorId);
			$div.find('[purpose=name]').html(data.name);
			$div.find('[purpose=description]').html(data.desc);
		}

		$('#divIndicatorsTemplate #divIndicatorModal').modal('hide');
	}	

	retval.Init = Init;
	retval.handleHash = handleHash;

	return retval;
})();