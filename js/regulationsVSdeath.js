export default function RegScatter(){
 let spec = {
  "data": {"url": "data/gunlawsbystate.csv"},
  "transform": [{
    "window": [{"op": "row_number", "as": "row_number"}]
  }],
  "hconcat": [{
    "title": "Death rates are lower when more regulations are in place.",
    "width": 400,
    "height": 400,
    "selection": {
      "brush": {
        "type": "interval"
      }
    },
    "mark": "point",
    "transform": [{
      "calculate": "'https://lawcenter.giffords.org/category/' + datum.state +'/'", "as": "url"
    }],
    "encoding": 
    {
      "x": {"field": "value", "type": "quantitative", "title":"Number of Laws"},
      "y": {"field": "rate", "type": "quantitative", "title":"Death Rate"},
      "tooltip": [{"field": "state", "type": "nominal", "title": "State"},{"field": "value", "type": "quantitative", "title":"Number of Laws"},{"field":"rate", "type":"quantitative", "title": "Death Rate"}],
      "href": {"field": "url", "type": "nominal"},
      "color": {
        "condition":{
          "test":"datum.value >=75",
          "value":"black"
        },
        "value": "#8B0000"      
      },
      "strokeWidth":{
        "condition":{
          "test":"datum.value >=75",
          "value": 3
        }
      }
    }
  }, {
    "transform": [
      {"filter": {"selection": "brush"}}
    ],
    "hconcat": [
      {
        "width": 80,
        "title": "State",
        "mark": "text",
        "encoding": {
          "text": {"field": "state", "type": "nominal"},
          "y": {"field": "row_number", "type": "ordinal", "axis": null}
        }
      },{
      "width": 70,
      "title": "Permit",
      "layer": [{
        "mark": "rect",
        "encoding": {
          "color": 
          {
            "condition": {
              "test": "datum.permit == 'TRUE'",
              "value": "#8B0000"
            },
            "value": "#fff"
          },
          "y": {"field": "row_number", "type": "ordinal", "axis": null}
        }
      },
      {
        "mark": "text",
        "encoding": {
          "color": 
          {
            "condition": {
              "test": "datum.permit == 'TRUE'",
              "value": "white"
            },
            "value": "black"
          },
          "text": {"field": "permit", "type": "nominal"},
          "y": {"field": "row_number", "type": "ordinal", "axis": null}
        }
      }
      ]
    }, {
      "width": 70,
      "title": "Purchase Permit",
      "layer": [{
        "mark": "rect",
        "encoding": {
          "color": 
          {
            "condition": {
              "test": "datum.purchase == 'TRUE'",
              "value": "#8B0000"
            },
            "value": "#fff"
          },
          "y": {"field": "row_number", "type": "ordinal", "axis": null}
        }
      },
      {
        "mark": "text",
        "encoding": {
          "color": 
          {
            "condition": {
              "test": "datum.purchase == 'TRUE'",
              "value": "white"
            },
            "value": "black"
          },
          "text": {"field": "purchase", "type": "nominal"},
          "y": {"field": "row_number", "type": "ordinal", "axis": null}
        }
      }
      ]
    }, {
      "width": 70,
      "title": "Registration",
      "layer": [{
        "mark": "rect",
        "encoding": {
          "color": 
          {
            "condition": {
              "test": "datum.regulation == 'TRUE'",
              "value": "#8B0000"
            },
            "value": "#fff"
          },
          "y": {"field": "row_number", "type": "ordinal", "axis": null}
        }
      },
      {
        "mark": "text",
        "encoding": {
          "color": 
          {
            "condition": {
              "test": "datum.regulation == 'TRUE'",
              "value": "white"
            },
            "value": "black"
          },
          "text": {"field": "regulation", "type": "nominal"},
          "y": {"field": "row_number", "type": "ordinal", "axis": null}
        }
      }
      ]
    },
    {
      "width": 70,
      "title": "Open Carry Allowed",
      "layer": [{
        "mark": "rect",
        "encoding": {
          "color": 
          {
            "condition": {
              "test": "datum.opencarry == 'FALSE'",
              "value": "#8B0000"
            },
            "value": "#fff"
          },
          "y": {"field": "row_number", "type": "ordinal", "axis": null}
        }
      },
      {
        "mark": "text",
        "encoding": {
          "color": 
          {
            "condition": {
              "test": "datum.opencarry == 'FALSE'",
              "value": "white"
            },
            "value": "black"
          },
          "text": {"field": "opencarry", "type": "nominal"},
          "y": {"field": "row_number", "type": "ordinal", "axis": null}
        }
      }
      ]
    },
    {
      "width": 70,
      "title": "Background Check",
      "layer": [{
        "mark": "rect",
        "encoding": {
          "color": 
          {
            "condition": {
              "test": "datum.bgCheck == 'TRUE'",
              "value": "#8B0000"
            },
            "value": "#fff"
          },
          "y": {"field": "row_number", "type": "ordinal", "axis": null}
        }
      },
      {
        "mark": "text",
        "encoding": {
          "color": 
          {
            "condition": {
              "test": "datum.bgCheck == 'TRUE'",
              "value": "white"
            },
            "value": "black"
          },
          "text": {"field": "bgCheck", "type": "nominal"},
          "y": {"field": "row_number", "type": "ordinal", "axis": null}
        }
      }
      ]
    },]
  }],
 
 }

vegaEmbed('#figure51', spec)
}
 