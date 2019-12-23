
	let margin ={
		top: 40,
		left: 60,
		right: 0,
		bottom: 60
	};
	let width = 800;
	let height = 400;
	
	// init axes variables to be updated in real time
	let x = d3.scaleTime();
	let y = d3.scaleLinear();
	let color = d3.scaleOrdinal(d3.schemePastel1);
	let yAxis = d3.axisLeft().scale(y);
	let xAxis = d3.axisBottom().scale(x);
	// Activity V - Create a dispatch for the category selection

	let listeners = d3.dispatch('selectCategory');

	let stack, stackedData, area, tooltip;
	
	// define reusable chart update function
	function chart(selection){
		selection.each(function(data){// this: contains a currently selected container element (e.g., div)
			let innerWidth = width  - margin.left - margin.right; // margin convention
			let innerHeight =  height - margin.top - margin.bottom;
			  
			// ---- Init the internal structure only once -----
			let svg = d3.select(this).selectAll('svg')
        .data([data]);
			
			let svgEnter = svg.enter().append('svg');
      let gEnter = svgEnter.append('g');
    
			
			gEnter.append("g")
				.attr("class", "x-axis axis")
					
			gEnter.append("g")
				.attr("class", "y-axis axis");
			
			// Activity IV - Add a tooltip placeholder

			gEnter.append("text") // use gEnter to create this only once!
     			.attr("class", "focus")
     			.attr("x", 20)
     			.attr("y", 0)
     			.attr("dy", ".35em");	

			// ------------------------------------------------
			
			// Activity II - Create a stacked area chart

			svg = svg.merge(svgEnter); 
			svg.attr("width", width)
             .attr("height", height);
      
      
        
 			let g = svg.select("g")
				 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				 
			tooltip = g.select('.focus');

			let dataCategories = data.length>0?Object.keys(data[0]).filter(d=>d!=="Year"):[];
            
     		// Initialize stack layout
     		stack = d3.stack()
         		.keys(dataCategories);
            
     		// Stack data
			stackedData = stack(data);
			 
			x.range([0, width - margin.left - margin.right])
			 .domain(d3.extent(data, d=>d.Year));
				
			y.range([height - margin.top - margin.bottom, 0])
			 .domain([0,d3.max(stackedData, d => d3.max(d, d => d[1]))]);
				
			color.domain(dataCategories);

			area = d3.area()
 			.curve(d3.curveCardinal)
 			.x(d=>x(d.data.Year))
 			.y0(d=>y(d[0]))
 			.y1(d=>y(d[1]));
			 // Draw the layers
 			let categories = g.selectAll(".area")
 				.data(stackedData);

			categories.enter().append("path")
 			.attr("class", "area")
 			.merge(categories)
 			.style("fill", (d,i)=>color(dataCategories[i])) // assign color
			.attr("d", d=>area(d)) // delegate area path generation
			.on("mouseover", (d,i)=>tooltip.text(excerpt(dataCategories[i], 100)))
      .on("mouseout", d=>tooltip.text(""))

      .on("click", handleClick);
      
     // var legendOffset = svg.margin().left() + width - 32 * statusArray.length;

    var legend = d3.legendColor()
      .shapeWidth(50)
      .cells(dataCategories.length)
      .orient("horizontal")
      .scale(color)

    svg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(500 0)");

    svg.select(".legend")
      .call(legend);
			 
			
			// Activity V - add a click listener for area layers


			// Activity IV - Add tooltip events on the area paths
			


			categories.exit().remove();

			// Call axis functions with the new domain 
			g.select(".x-axis")
			.attr("transform", "translate(0," + (height-margin.top-margin.bottom) + ")")
			.call(xAxis);

			g.select(".y-axis")
			.call(yAxis);
			
		});
	}
	chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
	};

	// Activity V - allow users to register for your custom events 

	chart.on = function() {
		var value = listeners.on.apply(listeners, arguments);
		return value === listeners ? chart : value;
	};

	function handleClick(d,i){
		// Activity V - call registered callbacks and pass the category info
		listeners.apply('selectCategory', this, [d.key,d.index]);
	}
	return chart;
	