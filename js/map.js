

export default function Map(){
  var marginTitle = { top: 20, left: 200},
  mapWidth = 800,
  mapHeight = 500;

  var div = d3.select("body").append("div")	
  .attr("class", "tooltip")				
  .style("opacity", 0);

var mapSvg = d3.select("#figure1").append("svg")
  .attr("width", mapWidth)
  .attr("height", mapHeight);

var title = mapSvg.append("text")
  .attr("class", "vis-title")
  .attr("transform", "translate(" + marginTitle.left + "," + marginTitle.top + ")")
 .text("Mass shootings");

var projection = d3.geoAlbersUsa()
  .scale(1070)
  .translate([mapWidth / 2, mapHeight / 2]);

var pathGenerator = d3.geoPath()
  .projection(projection);

// Add the tooltip container to the vis container
// it's invisible and its position/contents are defined during mouseover
var tooltip = d3.select("#figure1").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// tooltip mouseover event handler
function tipMouseover(d) {
  this.setAttribute("class", "circle-hover"); // add hover class to emphasize


  //var html  = d.city+ ", " + d.state + "<br>" + "<br>" + d.victims + " victims" + "<br>" + "<br>" + d.date;

  tooltip.html(html)
      .style("left", (d3.event.pageX + 15) + "px")
      .style("top", (d3.event.pageY - 28) + "px")
    .transition()
      .duration(200) // ms
      .style("opacity", 1) // started as 0!
};

// tooltip mouseout event handler
function tipMouseout(d) {
  return tooltip.style("visibility", "hidden");
  
};

makeMap();

function makeMap() {
  d3.json("data/us-states.json").then(function(data) {
      mapSvg.selectAll("path")
          .data(data.features)
        .enter().append("path")
          .attr("class", "states")
          .attr("d", pathGenerator);

 

      getData();
  });
}

// Loads and munges NYC crime data.
// Calls updateMapPoints() 
function getData() {
  d3.json("data/mass-shootings-in-america.json").then(function(dataForMap) {
      let parseMonthDayYear = d3.timeParse("%m-%d-%Y");
    

      var dataForTimeline = [],
          dateToCrimeCount = {};

      dataForMap.forEach(function(d, idx) {
          d.date = parseMonthDayYear(d.date);
          d.victims = +d.victims;
          d.latitude = +d.latitude;
          d.longitude = +d.longitude;
          if (!dateToCrimeCount[d.date]) {
              dateToCrimeCount[d.date] = d.victims;
          } else {
              dateToCrimeCount[d.date] += d.victims;
          }
      });

      Object.keys(dateToCrimeCount).forEach(function(time) {
          dataForTimeline.push({ date: new Date(time), victims: dateToCrimeCount[time] });
      });
      dataForTimeline.sort(function(a,b) { return a.date- b.date; });

     

      makeTimeline(dataForMap, dataForTimeline);

  });
};
let x;
// Creates the event timeline and sets up callbacks for brush changes
function makeTimeline(dataForMap, dataForTimeline) {
  var margin = { top: 10, right: 10, bottom: 20, left: 25 },
      width  = mapWidth - margin.left - margin.right,
      height = 80 - margin.top  - margin.bottom;

  var timelineSvg = d3.select("#figure2").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

  var timeline = timelineSvg.append("g")
      .attr("class", "timeline")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   x = d3.scaleTime()
      .domain(d3.extent(dataForTimeline.map(function(d) { return d.date; })))
      .range([0, width]);

  var y = d3.scaleLinear()
      .domain(d3.extent(dataForTimeline.map(function(d) { return d.victims; })))
      .range([height, 0]);

  var xAxis = d3.axisBottom()
      .scale(x);

  var yAxis = d3.axisLeft()
      .scale(y)
      .ticks(2);

  var area = d3.area()
      //.interpolate("linear")
      .x(function(d) { return x(d.date); })
      .y0(height)
      .y1(function(d) { return y(d.victims); })
      .curve(d3.curveStep);

  timeline.append("path")
      .datum(dataForTimeline)
      .attr("class", "area")
      .attr("d", area);

  timeline.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  timeline.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  timeline.append("text")
      .attr("transform", "rotate(-90)")
      .attr("dy", "-0.1em")
      .style("text-anchor", "end")
      .style("font-size", "15px")

     // .text("victims");

  // Add brush to timeline, hook up to callback
  var brush = d3.brushX()
      .on("brush", function() { brushCallback(brush, dataForMap); })

      //.selection([new Date("12-1-2013"), new Date("1-1-2014")]); // initial value

  timeline.append("g")
      .attr("class", "x brush")
      .call(brush)
      .call(brush.move, x.range())
    .selectAll("rect")
      .attr("y", -6)
      .attr("height", height + 7);
//brushCallback();
  //brush.event(timeline.select('g.x.brush')); // dispatches a single brush event
};

// Called whenever the timeline brush range (extent) is updated
// Filters the map data to those points that fall within the selected timeline range
function brushCallback(brush, dataForMap) {
  if (d3.event.selection === null) {
      updateMapPoints([]);
      updateTitleText();
  } else {
      var newDateRange = [x.invert(d3.event.selection[0]), x.invert(d3.event.selection[1])],
          filteredData = [];

      dataForMap.forEach(function(d) {
          if (d.date >= newDateRange[0] && d.date <= newDateRange[1]) {
              filteredData.push(d);
          }
      });
      updateMapPoints(filteredData);
      updateTitleText(newDateRange);
      
  }
}

// Updates the vis title text to include the passed date array: [start Date, end Date]
function updateTitleText(newDateArray) {

  if (!newDateArray) {
      title.text("Mass shootings");
  } else {
      var from = (newDateArray[0].getMonth() + 1) + "/" +
                 (newDateArray[0].getDay() + 1) + "/" +
                 newDateArray[0].getFullYear(),
          to =   (newDateArray[1].getMonth() + 1) + "/" +
                 (newDateArray[1].getDay() + 1) + "/" +
                 newDateArray[1].getFullYear();
      title.text( from + " - " + to + "            ");
  }
}

// Updates the points displayed on the map, to those in the passed data array
function updateMapPoints(data) {
  data.sort((a, b)=>-a.victims + b.victims);
  var circles = mapSvg.selectAll("circle").data(data, function(d) { return d.date + d.victims; });

  circles // update existing points
      .on("mouseover", tipMouseover)
      .on("mouseout", tipMouseout)
      //.attr("fill", function(d) { return colorScale(d.CR); })
      .attr("cx", function(d) { return projection([+d.longitude, +d.latitude])[0]; })
      .attr("cy", function(d) { return projection([+d.longitude, +d.latitude])[1]; })
      .attr("r",  function(d) { return d.victims; })
      .attr("fill", "red")
      .style("opacity", 0.7);

  circles.enter().append("circle") // new entering points
      .on("mouseover", tipMouseover)
    //  .on("mouseout", tipMouseout)
      .attr("cx", function(d) { return projection([+d.longitude, +d.latitude])[0]; })
      .attr("cy", function(d) { return projection([+d.longitude, +d.latitude])[1]; })
      .attr("r",  0)
      .attr("fill", "red")
      .style("opacity", 0.7)
    .transition()
      .duration(500)
      .attr("r",  function(d) { return d.victims; });

  circles.exit()
      .attr("r",  function(d) { return d.victims; })
    .transition()
      .duration(500)
      .attr("r", 0).remove();
   

  circles.on('mouseenter', function(d){
    d3.select(this).transition()
    .attr('fill', 'red')
    .style('stroke', 'white')
    div.transition()
    .duration(100)
    .style("opacity", .9);
    div .html(d.city+ ", " + d.state + "<br>" + "<br>" + d.victims + " victims" + "<br>" + "<br>" + d.date.getMonth()+"-" + d.date.getDay()+"-" + d.date.getFullYear())
      .style("left", (d3.event.pageX) + "px")		
      .style("top", (d3.event.pageY - 28) + "px")
  })
    
  .on('mouseleave', function(d){
    d3.select(this).transition()
    .attr('fill', 'red')
    .style('stroke', 'none')
    d3.select(this).transition()
    div .html(d.city+ ", " + d.state + "<br>" + "<br>" + d.victims + " victims" + "<br>" + "<br>" + d.date.getMonth()+"-" + d.date.getDay()+"-" + d.date.getFullYear())
      .style("left", (d3.event.pageX) + "px")		
      .style("top", (d3.event.pageY - 28) + "px")
      .style("opacity", 0);
    })
  }


}