var consumers = (function(){
	var retval = {};
	var injectContentToBody;

	function Init(params){
		injectContentToBody = params.injectContentToBody;
		// attach events
		$(document).on("click", 
					   "#divConsumersTemplate [action=delete]", 
					   handleConsumerDelete);
		$(document).on("click", 
					   "#divConsumersTemplate [action=edit]", 
					   handleConsumerEdit);
		$(document).on("click", 
					   "#divConsumersTemplate [action=create]", 
					   handleConsumerCreate);
		$(document).on("click", 
					   "#divConsumersTemplate #btnSaveConsumer", 
					   handleSaveConsumer);
		$(document).on("click", "#divConsumersTemplate [action=popout]", showModal);

	}

	function showModal(){
		$('#divConsumersTemplate #modalTwo #modalLabel').html('Data Providers');

		$('#divConsumersTemplate #subsList li').remove();

		var arr=$(this).attr('subsIds').split(",");


		arr.forEach(function(elem){
			var index = prepareConsumers.data.providers.findIndex(function(argprovider){
				if(argprovider.id == elem){
					return true;
				}
			});

			$('#divConsumersTemplate #subsList').append('<li>'+ prepareConsumers.data.providers[index].name+'</li>');

		});

		$('#divConsumersTemplate #modalTwo').modal('show');
	}


	function handleHash(){
		prepareConsumers.data = null;

		$.ajax({
			url: '/consumers/',
			data: null,
			dataType: 'json',
			method: 'GET',
			success: consumersGetDataSuccessHandler,
			error: null
		});

		if(!prepareConsumers.templateFunction){
			$.ajax({
				url: '/consumers-template/',
				data: null,
				dataType: 'text',
				method: 'GET',
				success: consumersGetTemplateSuccessHandler,
				error: null
			});
		}
	}

	function consumersGetDataSuccessHandler(data){
		
			prepareConsumers.data = data;
			prepareConsumers();
	}

	function consumersGetTemplateSuccessHandler(template){
		prepareConsumers.templateFunction = Handlebars.compile(template);
		prepareConsumers();
	}

	function prepareConsumers(){
		if(prepareConsumers.data && prepareConsumers.templateFunction){
			var bodyContentHtml = prepareConsumers.templateFunction(
								  prepareConsumers.data);
			injectContentToBody(bodyContentHtml);
		}

		$('#selectSubIds').select2({
		    placeholder: 'Select Provider'
		});
	}

	function handleConsumerDelete(){
		if(window.confirm("Are you sure you want to delete this consumer?")){
			$.ajax({
				url: '/consumers/',
				data: {
					consumerId: $(this).closest('[consumer-id]').attr('consumer-id')
				},
				dataType: 'json',
				method: 'DELETE',
				success: deleteConsumerSuccessHandler,
				error: null
			});
		}
	}

	function deleteConsumerSuccessHandler(data){
		alert("consumer deleted successfully.");
		$('#divConsumersTemplate tr[consumer-id=' + data + ']').remove();
	}

	function handleConsumerEdit(){
		$('#divConsumersTemplate #titleConsumerModal')
		.html('Update Consumer');

		$('#divConsumersTemplate #hdnConsumerIdModal')
		.val($(this).closest('[consumer-id]').attr('consumer-id'));

		$('#divConsumersTemplate #txtName')
		.val($(this).closest('[consumer-id]').find('[purpose=name]').html());

		$('#divConsumersTemplate #txtLink')
		.val($(this).closest('[consumer-id]').find('[purpose=link]').html());

		$('#divConsumersTemplate #txtDescription')
		.val($(this).closest('[consumer-id]').find('[purpose=desc]').html());

		var str=$(this).closest('[consumer-id]').find('[action=popout]').attr('subsIds');
		var arr=str.split(",");

		$('#divConsumersTemplate #divConsumerModal #selectSubIds').val(arr);
		$('#divConsumersTemplate #divConsumerModal #selectSubIds').trigger('change');


		$('#divConsumersTemplate #divConsumerModal').modal('show');
	}

	function handleConsumerCreate(){
		$('#divConsumersTemplate #titleConsumerModal')
		.html('Add Consumer');

		$('#divConsumersTemplate #hdnConsumerIdModal')
		.val('');

		$('#divConsumersTemplate #txtName')
		.val('');

		$('#divConsumersTemplate #txtLink')
		.val('');

		$('#divConsumersTemplate #txtDescription')
		.val('');

		$('#divConsumersTemplate #divConsumerModal #selectSubIds').val('');
		$('#divConsumersTemplate #divConsumerModal #selectSubIds').trigger('change');

		$('#divConsumersTemplate #divConsumerModal').modal('show');
	}

	function handleSaveConsumer(){
		var consumerId = $('#divConsumersTemplate #hdnConsumerIdModal').val();
		var name = $('#divConsumersTemplate #txtName').val();
		var desc= $('#divConsumersTemplate #txtDescription').val();
		var link = $('#divConsumersTemplate #txtLink').val();
		var multiselectId= $('#divConsumersTemplate #selectSubIds').select2('data').map(function(val){
			return val.id;
		});

		$.ajax({
			url: '/consumers/',
			data: {
				consumerId: consumerId,
				name: name,
				desc:desc,
				link: link,
				multiselectIds: multiselectId
			},
			dataType: 'json',
			method: consumerId === ''? 'POST': 'PUT',
			success: saveConsumerSuccessHandler,
			error: null
		});
	}

	function saveConsumerSuccessHandler(data){
		if(data.newRecord){
			var $div = $('#divConsumersTemplate tbody tr[consumer-id]:first').clone();

			$div.attr('consumer-id', data.consumerId);
			$div.find('[purpose=name]').html(data.name);
			$div.find('[purpose=desc]').html(data.desc);
			$div.find('[purpose=link]').html(data.link);
			$div.find('[subsIds]').attr('subsIds', data.subscription);

			$('#divConsumersTemplate tbody').append($div);
		}
		else{
			var $div = $('#divConsumersTemplate tbody tr[consumer-id=' + data.consumerId + ']');

			$div.attr('consumer-id', data.consumerId);
			$div.find('[purpose=name]').html(data.name);
			$div.find('[purpose=desc]').html(data.desc);
			$div.find('[purpose=link]').html(data.link);
			$div.find('[subsIds]').attr('subsIds', data.subscription);
		}

		$('#divConsumersTemplate #divConsumerModal').modal('hide');
	}


	retval.Init = Init;
	retval.handleHash = handleHash;

	return retval;
})();