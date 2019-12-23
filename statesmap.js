export default function StatesMap(){
	let spec = {
        "width": 460,
        "height": 350,
        "data": {
          "url": "data/us-10m.json",
          "format": {
            "type": "topojson",
            "feature": "states"
       
          }
        },
        "transform": [{
          "lookup": "id",
          "from": {
            "data": {
              "url": "data/gunlawsbystate.csv"
            },
            "key": "id",
            "fields": ["rate","state"]
          }
        }],
        "projection": {
          "type": "albersUsa"
        },
        "mark": "geoshape",
        "encoding": {
          "stroke":{
            "condition":{
              "test":"datum.rate< 8 && datum.state !='Rhode-Island'",
              "value":"black"
            }
          },
        
          "color": {
            "field": "rate",
            "type": "quantitative",
            "scale": {"scheme": "lightgreyred"},
            "title": "Rate"

          },
          "tooltip": [{"field": "state", "type": "nominal", "title": "State"},{"field": "rate", "type": "quantitative", "title":"Mortality Rate"}]
        }
    }
vegaEmbed('#figure26', spec)
}
