const view = {
    "key": "UN_SEEA_DISTRICTS_SECOND",
    "data": {
        "state": {
            "maps": {
                "maps": {
                    "un_seea_districts_second": {
                        "key": "un_seea_districts_second",
                        "data": {
                        "layers": [
                            {
                            "key": "lk_un_seea_boundaries_second",
                            "layerTemplate": "lt_un_seea_boundaries_second"
                            }
                        ],
                        "metadataModifiers": {}
                        }
                    }
                },
                "sets": {
                    "un_seea_mapset_districts_second": {
                        "key": "un_seea_mapset_districts_second",
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
                        "maps": ["un_seea_districts_second"],
                        "sync": {
                            "range": true,
                            "location": true
                        }
                    }
                },
                "activeMapKey": "un_seea_districts_second",
                "activeSetKey": "un_seea_mapset_districts_second"
            },
            "charts": {
                "sets": {
                  "unSeeaDistrictsSecondCharts": {
                    "key": "unSeeaDistrictsSecondCharts",
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