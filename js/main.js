import Map from './map.js'; 
import StackedAreaChart from './area2.js'; 
import BarChart from "./barchart.js";
import Bubble from './bubble.js'; 
import LawMap from './lawsmap.js'; 
import RegScatter from "./regulationsVSdeath.js";
import StatesMap from "./statesmap.js";


let parseDate = d3.timeParse("%Y");
let categoryData; 




Promise.all([ // load multiple files
	d3.json('data/us-10m.json'),
    d3.json('data/mass-shootings-in-america.json'),
    d3.csv('data/gunlawsbystate.csv'),

    d3.json('data/gun-violence-data.json'),
    d3.csv('data/americavsworld.csv'),
    d3.csv('data/mass-shootings-in-america.csv'),
    d3.csv('data/mentalhealth.csv', d=>{
		Object.keys(d).forEach(key=>{
			if (key != "Year") {
				d[key] = parseFloat(d[key]);
			} else if(key == "Year") {
				d[key] = parseDate(d[key].toString());
			}
		})
		return d; 
	})
]).then(data=>{
    categoryData = data[6]; 

 

    
});
 

// chart vars
let map = Map();
let law =  LawMap();
let bubblechart = Bubble();
let regu = RegScatter();
let bar = BarChart();
let states = StatesMap();
let stackChart = StackedAreaChart(); 

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}
