var areas = (function(){
	var retval = {};
	var injectContentToBody;

	function Init(params){
		injectContentToBody = params.injectContentToBody;
		// attach events
		$(document).on("click", 
			"#divAreasTemplate [action=delete]", 
			handleAreaDelete);
		$(document).on("click", 
			"#divAreasTemplate [action=edit]", 
			handleAreaEdit);
		$(document).on("click", 
			"#divAreasTemplate [action=create]", 
			handleAreaCreate);
		$(document).on("click", 
			"#divAreasTemplate #btnSaveArea", 
			handleSaveArea);
	}

	function handleHash(){
		prepareAreas.data = null;

		$.ajax({
			url: '/areas/',
			data: null,
			dataType: 'json',
			method: 'GET',
			success: areasGetDataSuccessHandler,
			error: null
		});

		if(!prepareAreas.templateFunction){
			$.ajax({
				url: '/areas-template/',
				data: null,
				dataType: 'text',
				method: 'GET',
				success: areasGetTemplateSuccessHandler,
				error: null
			});
		}
	}

	function areasGetDataSuccessHandler(data){
		if(data.IsLoggedIn === false){
			injectContentToBody("<p>Please <a href='#login'>Login</a> to manage areas</p>");
		}
		else{
			prepareAreas.data = data;
			prepareAreas();
		}
	}

	function areasGetTemplateSuccessHandler(template){
		prepareAreas.templateFunction = Handlebars.compile(template);
		prepareAreas();
	}

	function prepareAreas(){
		if(prepareAreas.data && prepareAreas.templateFunction){
			var bodyContentHtml = prepareAreas.templateFunction(
				prepareAreas.data);
			injectContentToBody(bodyContentHtml);
		}
	}
	function handleAreaDelete(){
		if(window.confirm("Are you sure you want to delete this area?")){
			$.ajax({
				url: '/areas/',
				data: {
					areaId: $(this).closest('[area-id]').attr('area-id')
				},
				dataType: 'json',
				method: 'DELETE',
				success: deleteAreaSuccessHandler,
				error: null
			});
		}
	}

	function deleteAreaSuccessHandler(data){
		alert("area deleted successfully.");
		$('#divAreasTemplate ul li[area-id=' + data + ']').remove();
	}

	function handleAreaEdit(){
		$('#divAreasTemplate #titleAreaModal')
		.html('Update Area');

		$('#divAreasTemplate #hdnAreaIdModal')
		.val($(this).closest('[area-id]').attr('area-id'));
		
		$('#divAreasTemplate #txtName')
		.val($(this).closest('[area-id]').find('[purpose=name]').html());

		$('#divAreasTemplate #divAreaModal').modal('show');
	}

	function handleAreaCreate(){
		$('#divAreasTemplate #titleAreaModal')
		.html('Add Area');

		$('#divAreasTemplate #hdnAreaIdModal')
		.val('');

		$('#divAreasTemplate #txtName')
		.val('');

		$('#divAreasTemplate #divAreaModal').modal('show');
	}

	function handleSaveArea(){
		var areaId = $('#divAreasTemplate #hdnAreaIdModal').val();
		var name = $('#divAreasTemplate #txtName').val();

		$.ajax({
			url: '/areas/',
			data: {
				areaId: areaId,
				name: name,
			},
			dataType: 'json',
			method: areaId === ''? 'POST': 'PUT',
			success: saveAreaSuccessHandler,
			error: null
		});
	}

	function saveAreaSuccessHandler(data){
		if(data.oldRecord){
			window.alert("Already Existed");

		}else{
			if(data.newRecord){
				var $div = $('#divAreasTemplate ul li[area-id]:first').clone();

				$div.attr('area-id', data.areaId);
				$div.find('[purpose=name]').html(data.name);

				$('#divAreasTemplate ul').append($div);
			}
			else{
				var $div = $('#divAreasTemplate ul li[area-id=' + data.areaId + ']');

				$div.attr('area-id', data.areaId);
				$div.find('[purpose=name]').html(data.name);
			}

			$('#divAreasTemplate #divAreaModal').modal('hide');
		}
	}


		retval.Init = Init;
		retval.handleHash = handleHash;

		return retval;
	})();