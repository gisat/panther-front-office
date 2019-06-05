const view = {
    "key": "UTEP_SDG_11_3_1",
    "data": {
        "state": {
            "maps": {
                "maps": {
                    "1985": {
                        "key": "1985",
                        "data": {
                        "layers": [
                            {
                            "key": "lk_sdg_1985",
                            "layerTemplate": "lt_sdg_1985"
                            }
                        ],
                        "metadataModifiers": {
                            "period": "1985"
                        }
                        }
                    },
                    "1995": {
                        "key": "1995",
                        "data": {
                        "layers": [
                            {
                            "key": "lk_sdg_1995",
                            "layerTemplate": "lt_sdg_1995"
                            }
                        ],
                        "metadataModifiers": {
                            "period": "1995"
                        }
                        }
                    },
                    "2005": {
                        "key": "2005",
                        "data": {
                        "layers": [
                            {
                            "key": "lk_sdg_2005",
                            "layerTemplate": "lt_sdg_2005"
                            }
                        ],
                        "metadataModifiers": {
                            "period": "2005"
                        }
                        }
                    },
                    "2015": {
                        "key": "2015",
                        "data": {
                        "layers": [
                            {
                            "key": "lk_sdg_2015",
                            "layerTemplate": "lt_sdg_2015"
                            }
                        ],
                        "metadataModifiers": {
                            "period": "2015"
                        }
                        }
                    }
                },
                "sets": {
                    "utep_sdg_11_3_1": {
                        "key": "utep_sdg_11_3_1",
                        "data": {
                            "layers": [{
                                "key": "lk_utep_sdg_11_3_1_boundaries_1985",
                                "layerTemplate": "lt_utep_sdg_11_3_1_boundaries"
                            }],
                            "worldWindNavigator": {
                                lookAtLocation: {
                                    latitude: 14,
                                    longitude: 103
                                },
                                range: 1500000,
                                roll: 0,
                                tilt: 0,
                                heading: 0                    
                            }
                        },
                        "maps": ["1985", "1995", "2005", "2015"],
                        "sync": {
                            "range": true,
                            "location": true
                        }
                    }
                },
                "activeMapKey": "1985",
                "activeSetKey": "utep_sdg_11_3_1"
            },
            "periods": {
                "activeKeys": ["1985", "1995", "2005", "2015"]
            }
        }
    }
}

export default view;