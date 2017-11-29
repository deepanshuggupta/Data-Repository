var subgroups = (function(){
	var retval = {};
	var injectContentToBody;

	function Init(params){
		injectContentToBody = params.injectContentToBody;

	// attach events
	$(document).on("click", 
		"#divSubgroupsTemplate [action=delete]", 
		handleSubgroupDelete);
	$(document).on("click", 
		"#divSubgroupsTemplate [action=edit]", 
		handleSubgroupEdit);
	$(document).on("click", 
		"#divSubgroupsTemplate [action=create]", 
		handleSubgroupCreate);
	$(document).on("click", 
		"#divSubgroupsTemplate #btnSaveSubgroup", 
		handleSaveSubgroup);
}

function handleHash(){
	prepareSubgroups.data = null;

	$.ajax({
		url: '/subgroups/',
		data: null,
		dataType: 'json',
		method: 'GET',
		success: subgroupsGetDataSuccessHandler,
		error: null
	});

	if(!prepareSubgroups.templateFunction){
		$.ajax({
			url: '/subgroups-template/',
			data: null,
			dataType: 'text',
			method: 'GET',
			success: subgroupsGetTemplateSuccessHandler,
			error: null
		});
	}
}

function subgroupsGetDataSuccessHandler(data){
	if(data.IsLoggedIn === false){
		injectContentToBody("<p>Please <a href='#login'>Login</a> to manage Subgroup</p>");
	}
	else{
		prepareSubgroups.data = data;
		prepareSubgroups();
	}
}

function subgroupsGetTemplateSuccessHandler(template){
	prepareSubgroups.templateFunction = Handlebars.compile(template);
	prepareSubgroups();
}

function prepareSubgroups(){
	if(prepareSubgroups.data && prepareSubgroups.templateFunction){
		var bodyContentHtml = prepareSubgroups.templateFunction(
			prepareSubgroups.data);
		injectContentToBody(bodyContentHtml);
	}
}

function handleSubgroupDelete(){
	if(window.confirm("Are you sure you want to delete this Subgroup?")){
		$.ajax({
			url: '/subgroups/',
			data: {
				subgroupId: $(this).closest('[subgroup-id]').attr('subgroup-id')
			},
			method: 'DELETE',
			success: deleteSubgroupSuccessHandler,
			error: null
		});
	}
}

function deleteSubgroupSuccessHandler(data){
	if(data=="null"){			
		alert("Can't delete this subgroup, Used in datasets!!");

	}else{
		alert("Subgroup deleted successfully.");
		$('#divSubgroupsTemplate div[subgroup-id=' + data + ']').remove();
	}

	
}

function handleSubgroupEdit(){
	$('#divSubgroupsTemplate #titleSubgroupModal')
	.html('Update Subgroup');

	$('#divSubgroupsTemplate #hdnSubgroupIdModal')
	.val($(this).closest('[subgroup-id]').attr('subgroup-id'));

	$('#divSubgroupsTemplate #txtName')
	.val($(this).closest('[subgroup-id]').find('[purpose=name]').html());

	$('#divSubgroupsTemplate #txtDescription')
	.val($(this).closest('[subgroup-id]').find('[purpose=description]').html());

	$('#divSubgroupsTemplate #divSubgroupModal').modal('show');
}

function handleSubgroupCreate(){
	$('#divSubgroupsTemplate #titleSubgroupModal')
	.html('Add Subgroup');

	$('#divSubgroupsTemplate #hdnSubgroupIdModal')
	.val('');

	$('#divSubgroupsTemplate #txtName')
	.val('');

	$('#divSubgroupsTemplate #txtDescription')
	.val('');

	$('#divSubgroupsTemplate #divSubgroupModal').modal('show');
}

function handleSaveSubgroup(){
	var subgroupId = $('#divSubgroupsTemplate #hdnSubgroupIdModal').val();
	var name = $('#divSubgroupsTemplate #txtName').val();
	var desc = $('#divSubgroupsTemplate #txtDescription').val();

	$.ajax({
		url: '/subgroups/',
		data: {
			subgroupId: subgroupId,
			name: name,
			desc: desc
		},
		dataType: 'json',
		method: subgroupId === ''? 'POST': 'PUT',
		success: saveSubgroupSuccessHandler,
		error: null
	});
}

function saveSubgroupSuccessHandler(data){
	if(data.newRecord){
		var $div = $('#divSubgroupsTemplate div[purposeEx]').clone();

		$div.removeClass('hide');

		$div.attr('subgroup-id', data.subgroupId);
		$div.find('[purpose=name]').html(data.name);
		$div.find('[purpose=description]').html(data.desc);

		$('#divSubgroupsTemplate').append($div);
	}
	else{
		var $div = $('#divSubgroupsTemplate div[subgroup-id=' + data.subgroupId + ']');

		$div.attr('subgroup-id', data.subgroupId);
		$div.find('[purpose=name]').html(data.name);
		$div.find('[purpose=description]').html(data.desc);
	}

	$('#divSubgroupsTemplate #divSubgroupModal').modal('hide');
}


retval.Init = Init;
retval.handleHash = handleHash;

return retval;
})();