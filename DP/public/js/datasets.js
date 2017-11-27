var datasets = (function(){
	var retval = {};
	var injectContentToBody;

	function Init(params){
		injectContentToBody = params.injectContentToBody;

		$(document).on("click", 
			"#divDatasetsTemplate [action=delete]", 
			handleDatasetDelete);
		$(document).on("click", 
			"#divDatasetsTemplate [action=edit]", 
			handleDatasetEdit);
		$(document).on("click", 
			"#divDatasetsTemplate [action=create]", 
			handleDatasetCreate);
		$(document).on("click", 
			"#divDatasetsTemplate #btnSaveDataset", 
			handleSaveDataset);

	}

	function handleHash(){
		prepareDatasets.data = null;

		$.ajax({
			url: '/datasets/',
			data: null,
			dataType: 'json',
			method: 'GET',
			success: datasetsGetDataSuccessHandler,
			error: null
		});

		if(!prepareDatasets.templateFunction){
			$.ajax({
				url: '/datasets-template/',
				data: null,
				dataType: 'text',
				method: 'GET',
				success: datasetsGetTemplateSuccessHandler,
				error: null
			});
		}
	}



	function datasetsGetDataSuccessHandler(data){
		if(data.IsLoggedIn === false){
			injectContentToBody("<p>Please <a href='#login'>Login</a> to manage datasets</p>");
		}
		else{
			prepareDatasets.data = data;
			prepareDatasets();
		}
	}

	function datasetsGetTemplateSuccessHandler(template){
		prepareDatasets.templateFunction = Handlebars.compile(template);
		prepareDatasets();
	}

	function prepareDatasets(){
		if(prepareDatasets.data && prepareDatasets.templateFunction){
			var bodyContentHtml = prepareDatasets.templateFunction(
				prepareDatasets.data);
			injectContentToBody(bodyContentHtml);
		}
	}


	function handleDatasetDelete(){
		if(window.confirm("Are you sure you want to delete this dataset?")){
			$.ajax({
				url: '/datasets/',
				data: {
					datasetId: $(this).closest('[dataset-id]').attr('dataset-id')
				},
				dataType: 'json',
				method: 'DELETE',
				success: deleteDatasetSuccessHandler,
				error: null
			});
		}
	}

	function deleteDatasetSuccessHandler(data){
		alert("dataset deleted successfully.");
		$('#divDatasetsTemplate tr[dataset-id=' + data + ']').remove();
	}

	function handleDatasetEdit(){
		$('#divDatasetsTemplate #titleDatasetModal')
		.html('Update Dataset');

		$('#divDatasetsTemplate #hdnDatasetIdModal')
		.val($(this).closest('[dataset-id]').attr('dataset-id'));

		$('#divDatasetsTemplate #selectIndicator')
		.val($(this).closest('[dataset-id]').find('[indicator-id]').attr('indicator-id'));

		$('#divDatasetsTemplate #selectArea')
		.val($(this).closest('[dataset-id]').find('[area-id]').attr('area-id'));

		$('#divDatasetsTemplate #selectUnit')
		.val($(this).closest('[dataset-id]').find('[unit-id]').attr('unit-id'));

		$('#divDatasetsTemplate #selectSubgroup')
		.val($(this).closest('[dataset-id]').find('[subgroup-id]').attr('subgroup-id'));

		$('#divDatasetsTemplate #timeDescription')
		.val($(this).closest('[dataset-id]').find('[purpose=timeperiod]').html());

		$('#divDatasetsTemplate #dataDescription')
		.val($(this).closest('[dataset-id]').find('[purpose=data]').html());


		$('#divDatasetsTemplate #divDatasetModal').modal('show');
	}

	function handleDatasetCreate(){
		$('#divDatasetsTemplate #titleDatasetModal')
		.html('Add Dataset');

		$('#divDatasetsTemplate #hdnDatasetIdModal')
		.val('');

		$('#divDatasetsTemplate #selectIndicator')
		.val('');

		$('#divDatasetsTemplate #selectArea')
		.val('');

		$('#divDatasetsTemplate #selectUnit')
		.val('');

		$('#divDatasetsTemplate #selectSubgroup')
		.val('');

		$('#divDatasetsTemplate #timeDescription')
		.val('');

		$('#divDatasetsTemplate #dataDescription')
		.val('');


		$('#divDatasetsTemplate #divDatasetModal').modal('show');
	}

	function handleSaveDataset(){
		var datasetId = $('#divDatasetsTemplate #hdnDatasetIdModal').val();
		var indicatorId = $('#divDatasetsTemplate #selectIndicator').val();
		var indicatorName = $('#divDatasetsTemplate #selectIndicator option:selected').html();
		var areaId = $('#divDatasetsTemplate #selectArea').val();
		var areaName = $('#divDatasetsTemplate #selectArea option:selected').html();
		var unitId = $('#divDatasetsTemplate #selectUnit').val();
		var unitName = $('#divDatasetsTemplate #selectUnit option:selected').html();
		var subgroupId = $('#divDatasetsTemplate #selectSubgroup').val();
		var subgroupName = $('#divDatasetsTemplate #selectSubgroup option:selected').html();
		var timeperiod = $('#divDatasetsTemplate #timeDescription').val();
		var data = $('#divDatasetsTemplate #dataDescription').val();

		$.ajax({
			url: '/datasets/',
			data: {
				datasetId: datasetId,
				indicatorId: indicatorId,
				indicatorName:indicatorName,
				areaId: areaId,
				areaName:areaName,
				unitId:unitId,
				unitName:unitName,
				subgroupId:subgroupId,
				subgroupName:subgroupName,
				timeperiod:timeperiod,
				data:data,
			},
			dataType: 'json',
			method: datasetId === ''? 'POST': 'PUT',
			success: saveDatasetSuccessHandler,
			error: null
		});
	}

	function saveDatasetSuccessHandler(data){
		if(data.newRecord){
			var $div = $('#divDatasetsTemplate tbody tr[dataset-id]:first').clone();

			$div.attr('dataset-id', data.datasetId);
			$div.find('[unit-id]').html(data.datasetUnitName);		
			$div.find('[unit-id]').attr('unit-id', data.datasetUnitId);
			$div.find('[area-id]').html(data.datasetAreaName);
			$div.find('[area-id]').attr('area-id',data.datasetAreaId);
			$div.find('[indicator-id]').html(data.datasetIndicatorName);
			$div.find('[indicator-id]').attr('indicator-id',data.datasetIndicatorId);
			$div.find('[subgroup-id]').html(data.datasetSubgroupName);
			$div.find('[subgroup-id]').attr('subgroup-id',data.datasetSubgroupId);

			$div.find('[purpose=timeperiod]').html(data.datasetTimeperiod);
			$div.find('[purpose=data]').html(data.datasetData);

			$('#divDatasetsTemplate tbody').append($div);
		}
		else{
			var $div = $('#divDatasetsTemplate tbody tr[dataset-id=' + data.datasetId + ']');

			$div.attr('dataset-id', data.datasetId);
			$div.find('[unit-id]').html(data.datasetUnitName);		
			$div.find('[unit-id]').attr('unit-id', data.datasetUnitId);
			$div.find('[area-id]').html(data.datasetAreaName);
			$div.find('[area-id]').attr('area-id',data.datasetAreaId);
			$div.find('[indicator-id]').html(data.datasetIndicatorName);
			$div.find('[indicator-id]').attr('indicator-id',data.datasetIndicatorId);
			$div.find('[subgroup-id]').html(data.datasetSubgroupName);
			$div.find('[subgroup-id]').attr('subgroup-id',data.datasetSubgroupId);
			$div.find('[purpose=timeperiod]').html(data.datasetTimeperiod);
			$div.find('[purpose=data]').html(data.datasetData);

		}

		$('#divDatasetsTemplate #divDatasetModal').modal('hide');
	}

	retval.Init = Init;
	retval.handleHash = handleHash;

	return retval;
})();