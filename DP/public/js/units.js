var units = (function(){
	var retval = {};
	var injectContentToBody;

	function Init(params){
		injectContentToBody = params.injectContentToBody;
		// attach events
		$(document).on("click", 
					   "#divUnitsTemplate [action=delete]", 
					   handleUnitDelete);
		$(document).on("click", 
					   "#divUnitsTemplate [action=edit]", 
					   handleUnitEdit);
		$(document).on("click", 
					   "#divUnitsTemplate [action=create]", 
					   handleUnitCreate);
		$(document).on("click", 
					   "#divUnitsTemplate #btnSaveUnit", 
					   handleSaveUnit);
	}

	function handleHash(){
		prepareUnits.data = null;

		$.ajax({
			url: '/units/',
			data: null,
			dataType: 'json',
			method: 'GET',
			success: unitsGetDataSuccessHandler,
			error: null
		});

		if(!prepareUnits.templateFunction){
			$.ajax({
				url: '/units-template/',
				data: null,
				dataType: 'text',
				method: 'GET',
				success: unitsGetTemplateSuccessHandler,
				error: null
			});
		}
	}

	function unitsGetDataSuccessHandler(data){
		if(data.IsLoggedIn === false){
			injectContentToBody("<p>Please <a href='#login'>Login</a> to manage units</p>");
		}
		else{
			prepareUnits.data = data;
			prepareUnits();
		}
	}

	function unitsGetTemplateSuccessHandler(template){
		prepareUnits.templateFunction = Handlebars.compile(template);
		prepareUnits();
	}

	function prepareUnits(){
		if(prepareUnits.data && prepareUnits.templateFunction){
			var bodyContentHtml = prepareUnits.templateFunction(
								  prepareUnits.data);
			injectContentToBody(bodyContentHtml);
		}
	}
	function handleUnitDelete(){
		if(window.confirm("Are you sure you want to delete this unit?")){
			$.ajax({
				url: '/units/',
				data: {
					unitId: $(this).closest('[unit-id]').attr('unit-id')
				},
				dataType: 'json',
				method: 'DELETE',
				success: deleteUnitSuccessHandler,
				error: null
			});
		}
	}

	function deleteUnitSuccessHandler(data){
		alert("unit deleted successfully.");
		$('#divUnitsTemplate div[unit-id=' + data + ']').remove();
	}

	function handleUnitEdit(){
		$('#divUnitsTemplate #titleUnitModal')
		.html('Update Unit');

		$('#divUnitsTemplate #hdnUnitIdModal')
		.val($(this).closest('[unit-id]').attr('unit-id'));

		$('#divUnitsTemplate #txtName')
		.val($(this).closest('[unit-id]').find('[purpose=name]').html());

		$('#divUnitsTemplate #txtDescription')
		.val($(this).closest('[unit-id]').find('[purpose=description]').html());

		$('#divUnitsTemplate #divUnitsModal').modal('show');
	}

	function handleUnitCreate(){
		$('#divUnitsTemplate #titleUnitModal')
		.html('Add Unit');

		$('#divUnitsTemplate #hdnUnitIdModal')
		.val('');

		$('#divUnitsTemplate #txtName')
		.val('');

		$('#divUnitsTemplate #txtDescription')
		.val('');

		$('#divUnitsTemplate #divUnitsModal').modal('show');
	}

	function handleSaveUnit(){
		var unitId = $('#divUnitsTemplate #hdnUnitIdModal').val();
		var name = $('#divUnitsTemplate #txtName').val();
		var desc = $('#divUnitsTemplate #txtDescription').val();

		$.ajax({
			url: '/units/',
			data: {
				unitId: unitId,
				name: name,
				desc: desc
			},
			dataType: 'json',
			method: unitId === ''? 'POST': 'PUT',
			success: saveUnitSuccessHandler,
			error: null
		});
	}

	function saveUnitSuccessHandler(data){
		if(data.newRecord){
			var $div = $('#divUnitsTemplate div[purposeEx]').clone();

			$div.removeClass('hide');

			$div.attr('unit-id', data.unitId);
			$div.find('[purpose=name]').html(data.name);
			$div.find('[purpose=description]').html(data.desc);

			$('#divUnitsTemplate').append($div);
		}
		else{
			var $div = $('#divUnitsTemplate div[unit-id=' + data.unitId + ']');

			$div.attr('unit-id', data.unitId);
			$div.find('[purpose=name]').html(data.name);
			$div.find('[purpose=description]').html(data.desc);
		}

		$('#divUnitsTemplate #divUnitsModal').modal('hide');
	}


	retval.Init = Init;
	retval.handleHash = handleHash;

	return retval;
})();