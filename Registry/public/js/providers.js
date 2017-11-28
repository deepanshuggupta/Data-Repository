var providers = (function(){
	var retval = {};
	var injectContentToBody;

	function Init(params){
		injectContentToBody = params.injectContentToBody;
		
		// attach events
		$(document).on("click", 
					   "#divProvidersTemplate [action=delete]", 
					   handleProviderDelete);
		$(document).on("click", 
					   "#divProvidersTemplate [action=edit]", 
					   handleProviderEdit);
		$(document).on("click", 
					   "#divProvidersTemplate [action=create]", 
					   handleProviderCreate);
		$(document).on("click", 
					   "#divProvidersTemplate #btnSaveProvider", 
					   handleSaveProvider);
	}

	function handleHash(){
		prepareProviders.data = null;

		$.ajax({
			url: '/providers/',
			data: null,
			dataType: 'json',
			method: 'GET',
			success: providersGetDataSuccessHandler,
			error: null
		});

		if(!prepareProviders.templateFunction){
			$.ajax({
				url: '/providers-template/',
				data: null,
				dataType: 'text',
				method: 'GET',
				success: providersGetTemplateSuccessHandler,
				error: null
			});
		}
	}

	function providersGetDataSuccessHandler(data){
		prepareProviders.data = data;
		prepareProviders();
	}

	function providersGetTemplateSuccessHandler(template){
		prepareProviders.templateFunction = Handlebars.compile(template);
		prepareProviders();
	}

	function prepareProviders(){
		if(prepareProviders.data && prepareProviders.templateFunction){
			var bodyContentHtml = prepareProviders.templateFunction(
								  prepareProviders.data);
			injectContentToBody(bodyContentHtml);
		}
	}

	function handleProviderDelete(){
		if(window.confirm("Are you sure you want to delete this provider?")){
			$.ajax({
				url: '/providers/',
				data: {
					providerId: $(this).closest('[provider-id]').attr('provider-id')
				},
				dataType: 'json',
				method: 'DELETE',
				success: deleteProviderSuccessHandler,
				error: null
			});
		}
	}

	function deleteProviderSuccessHandler(data){
		alert("provider deleted successfully.");
		$('#divProvidersTemplate tr[provider-id=' + data + ']').remove();
	}

	function handleProviderEdit(){
		$('#divProvidersTemplate #titleProviderModal')
		.html('Update Provider');

		$('#divProvidersTemplate #hdnProviderIdModal')
		.val($(this).closest('[provider-id]').attr('provider-id'));

		$('#divProvidersTemplate #txtName')
		.val($(this).closest('[provider-id]').find('[purpose=name]').html());

		$('#divProvidersTemplate #txtDescription')
		.val($(this).closest('[provider-id]').find('[purpose=desc]').html());

		$('#divProvidersTemplate #txtLink')
		.val($(this).closest('[provider-id]').find('[purpose=link]').html());

		$('#divProvidersTemplate #divProviderModal').modal('show');
	}

	function handleProviderCreate(){
		$('#divProvidersTemplate #titleProviderModal')
		.html('Add Provider');

		$('#divProvidersTemplate #hdnProviderIdModal')
		.val('');

		$('#divProvidersTemplate #txtName')
		.val('');

		$('#divProvidersTemplate #txtDescription')
		.val('');

		$('#divProvidersTemplate #txtLink')
		.val('');

		$('#divProvidersTemplate #divProviderModal').modal('show');
	}

	function handleSaveProvider(){
		var providerId = $('#divProvidersTemplate #hdnProviderIdModal').val();
		var name = $('#divProvidersTemplate #txtName').val();
		var desc = $('#divProvidersTemplate #txtDescription').val();
		var link = $('#divProvidersTemplate #txtLink').val();

		$.ajax({
			url: '/providers/',
			data: {
				providerId: providerId,
				name: name,
				desc: desc,
				link: link
			},
			dataType: 'json',
			method: providerId === ''? 'POST': 'PUT',
			success: saveProviderSuccessHandler,
			error: null
		});

	}

	function saveProviderSuccessHandler(data){
		if(data.newRecord){
			var $div = $('#divProvidersTemplate tbody tr[purposeEx]').clone();

			$div.removeClass('hide');
			$div.attr('provider-id', data.providerId);
			$div.find('[purpose=name]').html(data.name);
			$div.find('[purpose=desc]').html(data.desc);
			$div.find('[purpose=link]').html(data.link);

			$('#divProvidersTemplate tbody').append($div);
		}
		else{
			var $div = $('#divProvidersTemplate tbody tr[provider-id=' + data.providerId + ']');

			$div.attr('provider-id', data.providerId);
			$div.find('[purpose=name]').html(data.name);
			$div.find('[purpose=desc]').html(data.desc);
			$div.find('[purpose=link]').html(data.link);
		}

		$('#divProvidersTemplate #divProviderModal').modal('hide');
	}

	retval.Init = Init;
	retval.handleHash = handleHash;

	return retval;
})();