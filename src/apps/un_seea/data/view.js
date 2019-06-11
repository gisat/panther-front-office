const view = {
    "key": "UN_SEEA",
    "data": {
        "state": {
            "maps": {
                "maps": {
                    "2015": {
                        "key": "2015",
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
                        "maps": ["2015"],
                        "sync": {
                            "range": true,
                            "location": true
                        }
                    }
                },
                "activeMapKey": "2015",
                "activeSetKey": "un_seea_mapset"
            }
        }
    }
}

export default view;