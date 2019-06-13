const view = {
    "key": "UN_SEEA",
    "data": {
        "state": {
            "maps": {
                "maps": {
                    "un_seea": {
                        "key": "un_seea",
                        "data": {
                        "layers": [
                            {
                            "key": "lk_un_seea_boundaries",
                            "layerTemplate": "lt_un_seea_boundaries"
                            }
                        ],
                        "metadataModifiers": {
                        }
                        }
                    }
                },
                "sets": {
                    "un_seea_mapset": {
                        "key": "un_seea_mapset",
                        "data": {
                            "worldWindNavigator": {
                                lookAtLocation: {
                                    latitude: 59.9,
                                    longitude: 10.9
                                },
                                range: 70000,
                                roll: 0,
                                tilt: 0,
                                heading: 0                    
                            }
                        },
                        "maps": ["un_seea"],
                        "sync": {
                            "range": true,
                            "location": true
                        }
                    }
                },
                "activeMapKey": "un_seea",
                "activeSetKey": "un_seea_mapset"
            },
            "charts": {
                "sets": {
                  "unSeeaCharts": {
                    "key": "unSeeaCharts",
                    "charts": [
                      "progressChart"
                    ]
                  }
                },
                "charts": {
                  "progressChart": {
                    "key": "progressChart",
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