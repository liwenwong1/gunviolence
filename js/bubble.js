export default function Bubble() {

    var data = {
        "name": "flare",
        "children": [
            {
                "name": "Total Gun Violence Deaths",
                "value": 36170,
                "children": [
                    {"name":"Non-Suicide", "value":13928, "children": [
                        {"name": "Unintentional", "value": 367, "children": [
                            {"name": "", "value": 367}
                        ]},
                        {"name": "Self-Defense", "value": 449, "children": [
                            {"name": "", "value": 449}
                        ]},
                        {"name": "Homicide/Murder", "value": 13112, "children": [
                            {"name": "Mass Shooting", "value": 433, "children": [
                                {"name": "", "value": 433}
                            ]},
                            {"name": "Murder/Suicide", "value": 539, "children": [
                                {"name": "", "value": 539}
                            ]},
                            {"name": "Legal Intervention", "value": 1176, "children": [
                                {"name": "Officer Killed", "value": 65, "children": [
                                    {"name": "", "value": 65}
                                ]},
                                {"name": "Suspect Killed", "value": 1111, "children": [
                                    {"name": "", "value": 1111}
                                ]}
                            ]},
                            {"name": "Willful/Malicious", "value": 10397, "children": [
                                {"name": "", "value": 10397}
                            ]}
                        ]}
                    ]},
                    {"name":"Suicide", "value":22242, "children": [                            
                        {"name": "", "value": 22242},
                        {"name": "", "value": 22242}
                    ]}
                ]
            }
        ]
    };

    var pack = data => d3.pack()
        .size([width, height])
        .padding(3)
        (d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value));

    var width = 250;
    var height = 250;

    var color = d3.scaleLinear()
        .domain([0, 5])
        .range(["hsl(91,0%,90%)", "hsl(244,0%,12%)"])
        .interpolate(d3.interpolateHcl);

    const root = pack(data);
    let focus = root;
    let view;
      
    const svg = d3.select("#bubble-chart")
        .append("svg")
        .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
        .style("display", "block")
        .style("margin", "0 -14px")
        .style("cursor", "pointer")
        .on("click", () => zoom(root));
      
    const node = svg.append("g")
        .selectAll("circle")
        .data(root.descendants().slice(1))
        .join("circle")
            .attr("fill", d => d.children ? color(d.depth) : "transparent")// i changed this
            .style("fill", function(d){
                if (d.data.name === "Mass Shooting") {
                    return "rgb(224, 71, 51)"; 
                }
               else {
                   return 
               }
           })
       
            .attr("pointer-events", d => !d.children ? "none" : null)
            .on("mouseover", function(d, i) { 
                d3.select(this).attr("stroke", "#000"); 
                //d3.select(this).attr("opacity", "0.7");
                d3.select("#info-box .cause").text("Cause of Death: " + d.data.name);
                d3.select("#info-box .count").text("Count: " + d.data.value);
            })
            .on("mouseout", function() { 
                d3.select(this).attr("stroke", null);
               // d3.select(this).attr("opacity", "none");
           
            })
            .on("click", function(d) {
                if (d.data.name == "Mass Shooting") {
                    node.attr("xlink:href", "#figure1")
                }
                else {
                    focus !== d && (zoom(d.parent), d3.event.stopPropagation())
                }
            });
      
    const label = svg.append("g")
        .style("font", "10px sans-serif")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(root.descendants())
        .join("text")
            .style("fill-opacity", d => d.parent === root ? 1 : 0)
            .style("display", d => d.parent === root ? "inline" : "none")
            .style("fill", "white")
            .text(d => d.data.name);
      
    zoomTo([root.x, root.y, root.r * 2]);
      
    function zoomTo(v) {
        const k = width / v[2];
      
        view = v;
      
        label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("r", d => d.r * k);
    }
      
    function zoom(d) {
        const focus0 = focus;
      
        focus = d;
      
        const transition = svg.transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .tween("zoom", d => {
            const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
            return t => zoomTo(i(t));
            });
      
        label
            .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
            .transition(transition)
                .style("fill-opacity", d => d.parent === focus ? 1 : 0)
                .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
                .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    }
      
    return svg.node();
}