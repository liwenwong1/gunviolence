export default function StackedAreaChart(){

d3.csv("data/mentalhealth.csv").then(d => chart(d))

function chart(csv) {

	

	var keys = csv.columns.slice(1);

	var years = [...new Set(csv.map(d => d.Year))]


	var svg = d3.select("#figure6"),
		margin = {top: 50, left: 60, bottom: 0, right: 160},
		width = +svg.attr("width") - margin.left - margin.right,
		height = +svg.attr("height") - margin.top - margin.bottom;

	var x = d3.scaleBand()
		.range([margin.left, width - margin.right])
		.padding(0.1)

	var y = d3.scaleLinear()
		.rangeRound([height - margin.bottom, margin.top])

	var xAxis = svg.append("g")
		.attr("transform", `translate(0,${height - margin.bottom})`)
		.attr("class", "x-axis")

	var yAxis = svg.append("g")
		.attr("transform", `translate(${margin.left},0)`)
        .attr("class", "y-axis")
        
              
  

	var z = d3.scaleOrdinal()
		.range(["maroon", "orangered", "lightgray"])
		.domain(keys);

	let colors = ["maroon", "orangered", "lightgray"]; 

	var data = csv; 

		data.forEach(function(d) {
			d.total = d3.sum(keys, k => +d[k])
			return d
		})

        y.domain([0, 100]).nice();
        //d3.max(data, d => d3.sum(keys, k => +d[k]))

		svg.selectAll(".y-axis").transition().duration(0)
			.call(d3.axisLeft(y).ticks(null, "s"))
            svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -2)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Percentage of Victims");

		x.domain(data.map(d => d.Year));

		svg.selectAll(".x-axis").transition().duration(0)
            .call(d3.axisBottom(x).tickSizeOuter(0))
            
            svg.append("text")             
            .attr("transform",
                  "translate(" + (width/2 - 50) + " ," + 
                                 (height + 50) + ")")
            .style("text-anchor", "middle")
            .text("Year");

		var group = svg.selectAll("g.layer")
			.data(d3.stack().keys(keys)(data), (d => d.key))

		group.exit().remove()

		group.enter().append("g")
			.classed("layer", true)
            .attr("fill", d => z(d.key));
        console.log(data.key); 

		var bars = svg.selectAll("g.layer").selectAll("rect")
            .data(d => d, e => e.data.Year)
           

		bars.exit().remove()

		bars.enter().append("rect")
            .attr("width", x.bandwidth())
            .on("mouseover", function() { tooltip.style("display", null); })
            .on("mouseout", function() { tooltip.style("display", "none"); })
            .on("mousemove", function(d) {
              var xPosition = d3.mouse(this)[0] - 15;
              var yPosition = d3.mouse(this)[1] - 25;
              tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
              tooltip.select("text").text(-1*(d[0] - d[1]).toFixed(2));
            })
			.merge(bars)
		.transition().duration(0)
			.attr("x", d => x(d.data.Year))
			.attr("y", d => y(d[1])) 
            .attr("height", d => y(d[0]) - y(d[1]))
            
          
        

		var text = svg.selectAll(".text")
			.data(data, d => d.Year);

		text.exit().remove()

		text.enter().append("text")
			.attr("class", "text")
			.attr("text-anchor", "middle")
			.merge(text)
		.transition().duration(0)
			.attr("x", d => x(d.Year) + x.bandwidth() / 2)
			.attr("y", d => y(d.total) - 5)
		//	.text(d => d.total)


	// Draw legend
var legend = svg.selectAll(".legend")
  .data(colors)
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) { return "translate(-100," + i * 21 + ")"; });
 
legend.append("rect")
  .attr("x", width - 18)
  .attr("y", 70)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", function(d, i) {return colors.slice().reverse()[i];});
 
legend.append("text")
  .attr("x", width + 5)
  .attr("y", 80)
  .attr("dy", ".35em")
  .style("text-anchor", "start")
  .style("fill", "black")
  .text(function(d, i) { 
    switch (i) {
      case 0: return "Unknown";
	  case 1: return "Shooter does not have mental illness";
      case 2: return "Shooter has mental illness";
    }
  });

  // Prep the tooltip bits, initial display is hidden
var tooltip = svg.append("g")
.attr("class", "tooltip")
.style("display", "none");
  
tooltip.append("rect")
.attr("width", 50)
.attr("height", 20)
.attr("fill", "white")
.style("opacity", 0.5);

tooltip.append("text")
.attr("x", 25)
.attr("dy", "1em")
.style("text-anchor", "middle")
.attr("font-size", "16px")
.attr("font-weight", "bold");
	
}
}