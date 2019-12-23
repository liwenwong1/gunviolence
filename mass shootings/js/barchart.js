// America vs world bar chart 
export default function BarChart(){

    var margin = {top: 10, right: 60, bottom: 200, left: 60},
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
  
    const annotationsRight = [
        {
          note: {
            label: "The United States has a significantly higher death rate",
          },
          connector: {
            end: "arrow",        // none, or arrow or dot
            type: "curve",       // Line or curve
            points: 1,           // Number of break in the curve
            lineType : "horizontal"
          },
          color: ["rgb(224, 71, 51)"],
          x: 780,
          y: 25,
          dy: 70,
          dx: -70
        }
      ]
      
      // Add annotation to the chart
      const makeAnnotationsRight = d3.annotation()
        .annotations(annotationsRight)
  
    var svg = d3.select("#figure25")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")
    .call(makeAnnotationsRight);
  
     // ==== CHANGE STYLE ATTRIBUTE ====== //
     d3.select("#figure25").selectAll(".connector")
     .attr('stroke', "rgb(224, 71, 51)")
     .style("stroke-dasharray", ("3, 3"))
   d3.select("#figure25").selectAll(".connector-end")
     .attr('stroke', "rgb(224, 71, 51)")
     .attr('fill', "rgb(224, 71, 51)")
   
     var tooltip = d3.select("body").append("div")  
     .style("position", "absolute")
      .style("font-family",  "sans-serif")
    .style("font-size", "18px")
    .style("color", "black")
      .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "white")
    .style("opacity", "0.8");
    
  
  
    // get the data
    d3.csv("data/americavsworld.csv")
    .then(function(data) {
        let deathratemax = d3.max(data, (d)=>parseInt(d.Deathrate)+0.5);
        let deathratemin = d3.min(data,(d)=>parseInt(d.Deathrate));
        
        var x = d3.scaleBand()
         .range([0, width])
         .padding(0.2);
  
        var y = d3.scaleLinear()
        .domain([deathratemin, deathratemax])
         .range([height, 0]);
  
        x.domain(data.map(function(d) { return d.Country; }));
      //   y.domain([0, d3.max(data, function(d) { return d.Deathrate; })]);
       //y.domain([0, d3.max(data, function(d) { return d.Country; })]);
  
       
  
    svg.selectAll(".bar") 
    .data(data)
    .enter().append("rect")
     .attr("class", "bar")
     .style("fill", function (d) {
         if (d.Country === "United States") {
             return "rgb(224, 71, 51)"; 
         }
        else {
            return "lightgray"
        }
    })
     //.style('stroke', "gray")
  //   .style('stroke-width', 7.5)
    // .attr("Country", function(d) { return d.Country; })
     .attr("x", function(d) { 
         return x(d.Country); })
     .attr("width", x.bandwidth())
     .attr("y", function(d) { 
         return y(d.Deathrate); })
     .attr("height", function(d) { 
         return height - y(d.Deathrate); })
         .on('mouseenter', function(d){
             return tooltip.style("visibility", "visible").text(d.Country + ":" + d.Deathrate);
         })
         .on('mousemove', function(d){
             return tooltip.style("top", (d3.event.pageY-10)+"px").style("left", (d3.event.pageX+10)+"px").text(d.Country + ": " + d.Deathrate);
       
         })
         .on('mouseleave', function(d){
            return tooltip.style("visibility", "hidden");
         })
  
  
  //add the x axis
  svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
  .attr("transform", "rotate(70)")
  .style("text-anchor", "start");
  
  
  //add the y axis
  svg.append("g")
  .call(d3.axisLeft(y));
  
  
  svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 100) + ")")
      .style("text-anchor", "middle")
      .text("Country");
  
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Firearm Death Rate");  
     });
    }