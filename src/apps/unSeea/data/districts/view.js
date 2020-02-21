const view = {
    "key": "UN_SEEA_DISTRICTS",
    "data": {
        "state": {
            "maps": {
                "maps": {
                    "un_seea_districts": {
                        "key": "un_seea_districts",
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
                    },
                    "un_seea_districts_grid": {
                        "key": "un_seea_districts_grid",
                        "data": {
                        "layers": [
                            {
                            "key": "lk_un_seea_boundaries_grid",
                            "layerTemplate": "lt_un_seea_boundaries_grid"
                            }
                        ],
                        "metadataModifiers": {}
                        }
                    }
                },
                "sets": {
                    "un_seea_mapset_districts": {
                        "key": "un_seea_mapset_districts",
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
                        "maps": ["un_seea_districts"],
                        "sync": {
                            "range": true,
                            "location": true
                        }
                    },
                    "un_seea_mapset_districts_grid": {
                        "key": "un_seea_mapset_districts_grid",
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
                        "maps": ["un_seea_districts_grid"],
                        "sync": {
                            "range": true,
                            "location": true
                        }
                    }
                },
                "activeMapKey": "un_seea_districts",
                "activeSetKey": "un_seea_mapset_districts"
            },
            "charts": {
                "sets": {
                  "unSeeaDistrictsCharts": {
                    "key": "unSeeaDistrictsCharts",
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