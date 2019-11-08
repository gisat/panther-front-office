const view = {
    "key": "UN_SEEA_TREES_IN_TIME",
    "data": {
        "state": {
            "maps": {
                "maps": {
                    "un_seea_trees_in_time_2011": {
                        "key": "un_seea_trees_in_time_2011",
                        "data": {
                        "layers": [
                            {
                            "key": "lk_un_seea_trees_in_time_2011",
                            "layerTemplate": "lt_un_seea_trees_in_time_2011"
                            }
                        ],
                        "metadataModifiers": {
                        }
                        }
                    },
                    "un_seea_trees_in_time_2017": {
                        "key": "un_seea_trees_in_time_2017",
                        "data": {
                        "layers": [
                            {
                            "key": "lk_un_seea_trees_in_time_2017",
                            "layerTemplate": "lt_un_seea_trees_in_time_2017"
                            }
                        ],
                        "metadataModifiers": {}
                        }
                    }
                },
                "sets": {
                    "un_seea_trees_in_time_2011": {
                        "key": "un_seea_trees_in_time_2011",
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
                        "maps": ["un_seea_trees_in_time_2011"],
                        "sync": {
                            "range": true,
                            "location": true
                        }
                    },
                    "un_seea_trees_in_time_2017": {
                        "key": "un_seea_trees_in_time_2017",
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
                        "maps": ["un_seea_trees_in_time_2017"],
                        "sync": {
                            "range": true,
                            "location": true
                        }
                    }
                },
                "activeMapKey": "un_seea_trees_in_time_2017",
                "activeSetKey": "un_seea_trees_in_time_2017"
            },
            "charts": {
                "sets": {
                  "unSeeaTreesInTimeCharts": {
                    "key": "unSeeaTreesInTimeCharts",
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