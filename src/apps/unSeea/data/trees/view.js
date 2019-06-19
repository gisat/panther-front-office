const view = {
    "key": "UN_SEEA_TREES",
    "data": {
        "state": {
            "maps": {
                "maps": {
                    "un_seea_trees": {
                        "key": "un_seea_trees",
                        "data": {
                        "layers": [
                            {
                            "key": "lk_un_seea_trees",
                            "layerTemplate": "lt_un_seea_trees"
                            }
                        ],
                        "metadataModifiers": {
                        }
                        }
                    }
                },
                "sets": {
                    "un_seea_trees_mapset": {
                        "key": "un_seea_trees_mapset",
                        "data": {
                            "worldWindNavigator": {
                                lookAtLocation: {
                                  latitude: 59.92007635866882, 
                                  longitude: 10.745424129637254
                                },
                                range: 3664,
                                roll: 0,
                                tilt: 0,
                                heading: 0                    
                            }
                        },
                        "maps": ["un_seea_trees"],
                        "sync": {
                            "range": true,
                            "location": true
                        }
                    }
                },
                "activeMapKey": "un_seea_trees",
                "activeSetKey": "un_seea_trees_mapset"
            },
            "charts": {
                "sets": {
                  "unSeeaTreesCharts": {
                    "key": "unSeeaTreesCharts",
                    "charts": [
                      "progressTreesChart"
                    ]
                  }
                },
                "charts": {
                  "progressTreesChart": {
                    "key": "progressTreesChart",
                    "data": {
                      "title": "Progress",
                      "periods": [],
                      "layerTemplate": "05d3b3c9-f327-46ed-93d2-949cbac72a83"
                    }
                  }
                }
              },
        }
    }
}

export default view;