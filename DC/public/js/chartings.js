var chartings = (function(){
	var retval = {};
	var injectContentToBody;

	function Init(params){
		injectContentToBody = params.injectContentToBody;
		// attach events

		$(document).on("click","#divChartingsTemplate #analyzeBtn", handleAnalyze);
		$(document).on("click","#divChartingsTemplate #btnSaveCharting", handleSaveCharting);
	}

	function handleHash(){

		$.ajax({
			url: '/chartings/',
			data: null,
			dataType: 'json',
			method: 'GET',
			success: chartingsGetDataSuccessHandler,
			error: null
		});

		if(!prepareChartings.templateFunction){
			$.ajax({
				url: '/chartings-template/',
				data: null,
				dataType: 'text',
				method: 'GET',
				success: chartingsGetTemplateSuccessHandler,
				error: null
			});
		}
	}


	function chartingsGetDataSuccessHandler(data){
		prepareChartings.data = data;
		prepareChartings();
	}

	function chartingsGetTemplateSuccessHandler(template){
		prepareChartings.templateFunction = Handlebars.compile(template);
		prepareChartings();
	}

	function prepareChartings(){
		if(prepareChartings.data && prepareChartings.templateFunction){
			var bodyContentHtml = prepareChartings.templateFunction(
				prepareChartings.data);
			injectContentToBody(bodyContentHtml);
		}
		
	}


	function handleAnalyze(){
		$('#divChartingsTemplate #titleChartingModal')
		.html('Analyze CHarting');

		$('#divChartingsTemplate #hdnChartingIdModal')
		.val('');

		$('#divChartingsTemplate #selectIndicator')
		.val('');

		$('#divChartingsTemplate #selectArea')
		.val('');

		$('#divChartingsTemplate #selectUnit')
		.val('');

		$('#divChartingsTemplate #selectSubgroup')
		.val('');


		$('#divChartingsTemplate #timeDescription')
		.val('');

		$('#divChartingsTemplate #divChartingModal').modal('show');

	}


	function handleSaveCharting(){

		var indicatorId = $('#divChartingsTemplate #selectIndicator').val();
		var areaId = $('#divChartingsTemplate #selectArea').val();
		var unitId = $('#divChartingsTemplate #selectUnit').val();
		var subgroupId = $('#divChartingsTemplate #selectSubgroup').val();
		var timeperiod = $('#divChartingsTemplate #timeDescription').val();

		if(indicatorId == '' || unitId == '' || subgroupId == ''){
			alert("Indicator, Unit and SUbgroup ane madnatory fields");
			return;
		} else {
			if(areaId == '' && timeperiod == ''){
				alert("Please provide either of area or timeperiod");
				return;
			}
		}

		$.ajax({
			url: '/chartings/',
			data: {
				indicatorId: indicatorId,
				areaId: areaId,
				unitId:unitId,
				subgroupId:subgroupId,
				timeperiod:timeperiod,
			},
			dataType: 'json',
			method: 'POST',		
			success: saveChartingSuccessHandler,
			error: null
		});

		$('#divChartingsTemplate #divChartingModal').modal('hide');
	}

	function saveChartingSuccessHandler(data){

		$("#drawingArea").empty();
		var margin = {top: 20, right: 20, bottom: 200, left: 20},
		    width = 800 - margin.left - margin.right,
		    height = 500 - margin.top - margin.bottom;


		// set the ranges
		var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
		var y = d3.scale.linear().range([height, 0]);

		// define the axis
		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom")


		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left")
		    .ticks(10);


		// add the SVG element
		var svg = d3.select("#drawingArea").append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", 
		          "translate(" + margin.left + "," + margin.top + ")");


		// load the data

		    data.forEach(function(d) {
		        d.name = d.name;
		        d.value = +d.value;
		    });
			
		  // scale the range of the data
		  x.domain(data.map(function(d) { return d.name; }));
		  y.domain([0, d3.max(data, function(d) { return d.value; })]);

		  // add axis
		  svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis)
		    .selectAll("text")
		      .style("text-anchor", "end")
		      .attr("dx", "-.8em")
		      .attr("dy", "-.55em")
		      .attr("transform", "rotate(-90)" );

		  svg.append("g")
		      .attr("class", "y axis")
		      .call(yAxis)
		    .append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 5)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      .text("Value");


		  // Add bar chart
		  svg.selectAll("bar")
		      .data(data)
		    .enter().append("rect")
		      .attr("class", "bar")
		      .attr("x", function(d) { return x(d.name); })
		      .attr("width", x.rangeBand())
		      .attr("y", function(d) { return y(d.value); })
		      .attr("height", function(d) { return height - y(d.value); });


	}




	retval.Init = Init;
	retval.handleHash = handleHash;

	return retval;
})();