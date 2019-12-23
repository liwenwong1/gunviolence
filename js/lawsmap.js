export default function LawMap(){
	let spec = {
        "width": 500,
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
            "fields": ["value","state"]
          }
        }],
        "projection": {
          "type": "albersUsa"
        },
        "mark": {
          "type":"geoshape",
        },
        "encoding": {
          "stroke":{
            "condition":{
              "test":"datum.value>= 75",
              "value":"black"
            }

          },
          "fill": {
            "field": "value",
            "type": "quantitative",
            "scale": {"scheme": "lightgreyred"},
            "title": "Laws"
          },
          "tooltip": [{"field": "state", "type": "nominal", "title": "State"},{"field": "value", "type": "quantitative", "title":"Number of Laws"}]
        }
    }
vegaEmbed('#figure5', spec)
}
