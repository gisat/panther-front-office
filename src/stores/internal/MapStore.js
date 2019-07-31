import Actions from '../../actions/Actions';
import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';

import stringUtils from '../../util/stringUtils';

import _ from 'lodash';


/**
 * It creates MapStore and contains maps themselves
 * @constructor
 * @param options {Object}
 * @param options.dispatcher {Object} Dispatcher, which is used to distribute actions across the application.
 * @param options.maps {WorldWindMap[]} 3D maps which are handled by this store.
 * @param options.store {Object}
 */
class MapStore {
    constructor(options) {
        if (!options.dispatcher) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MapStore", "constructor", "Dispatcher must be provided"));
        }
        if (!options.store) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MapStore', 'constructor', 'Stores must be provided'));
        }

        this._dispatcher = options.dispatcher;
        this._stateStore = options.store.state;
        this._wmsStore = options.store.wms;

        this._maps = [];

        if (options.maps) {
            options.maps.forEach(function (map) {
                this._maps.push(map);
            }.bind(this));
        }

        this._dispatcher.addListener(this.onEvent.bind(this));
    }

    /**
     * It adds new map into this store.
     * @param options {Object}
     * @param options.map {WorldWindMap} Visible map.
     */
    add(options) {
        this._maps.push(options.map);
        this._dispatcher.notify('map#added', options);
    };

    addGeometryToPlaceLayer(geometry, mapKey){
        this._maps.forEach(function(map){
            if (map.id === mapKey){
                map.addGeometryToPlaceLayer(geometry);
            }
        });
    }

	/**
	 * Add info layer to a particular map according to scenario key
	 * TODO it uses only first style in a list
	 */
	addInfoLayersByScenarios(data, activePlaceKey, scopeConfig) {
		data.map(item => {
			let map = null;
			if (item.scenarioKey){
				map = _.find(this._maps, ['scenarioKey', item.scenarioKey]);
			} else {
				map = _.find(this._maps, (map) => {return map.isDefaultScenarioSituation === true || map.id === 'default-map'});
			}

			if (map){
				let id = item.layerTemplateKey;
				let style = null;

				if (item.styleSource && item.styleSource[0]){
					id += "-" + item.styleSource[0].path;
					style = item.styleSource[0].path
				}

				let alreadyAdded = map.layers.getLayerById(id);
				if (!alreadyAdded){
					let pucsStyles = scopeConfig && scopeConfig.pucsLandUseScenarios && scopeConfig.pucsLandUseScenarios.styles;
					let layerTemplateKey = item.layerTemplateKey;

					if (pucsStyles && layerTemplateKey && activePlaceKey) {
						let styleObject = _.find(pucsStyles, {'layerTemplateKey': layerTemplateKey, 'placeKey': activePlaceKey});
						if (styleObject) {
							style = styleObject.styleId;
						}
					}

					map.layers.addInfoLayer({
						layerPaths: item.dataSource,
						stylePaths: style,
						id: id,
						templateId: item.layerTemplateKey
					}, 'info-layers', true);
				}
			}
		});
	};

	removeInfoLayersByScenarios(data) {
		data.map(item => {
			let map = null;
			if (item.scenarioKey){
				map = _.find(this._maps, ['scenarioKey', item.scenarioKey]);
			} else {
				map = _.find(this._maps, (map) => {return map.isDefaultScenarioSituation === true || map.id === 'default-map'});
			}

			if (map){
				let id = item.layerTemplateKey;
				if (item.styleSource && item.styleSource[0]){
					id += "-" + item.styleSource[0].path;
				}

				map._wwd.layers.map(layer => {
					if (layer.metadata && layer.metadata.id === id){
						map.layers.removeLayer(layer, true);
					}
				});
			}
		});
	};



    /**
     * Add WMS layer to given map.
     * @param layerId {string|number} id of WMS Layer
     * @param layerOptions {Object}
     * @param mapId {string} id of the map
     * @param groupId
     */
    addWmsLayerToMap(layerId, layerOptions, mapId, groupId) {
        let self = this;
        let state = this._stateStore.current();
        let scope = state.scopeFull;
        let isIndependent = state.isMapIndependentOfPeriod;
        this._wmsStore.byId(layerId).then(function (results) {
            if (results.length) {
                let layer = results[0];
                self._maps.forEach(function (map) {
                    let periodExists = _.find(layer.periods, function (period) {
                        return period === map._period
                    });

                    if (map.id === mapId && (isIndependent || (!isIndependent && periodExists))) {
                        var customOptions = null;
                        try{
                            customOptions = JSON.parse(layer.custom);
                        } catch(e){}

                        let alreadyExist = map.layers.getLayerById("wmsLayer-" + layer.id) || map.layers.getLayerById(layer.id);

                        // add layer
						if (!alreadyExist){
							map.layers.addWmsLayer({
								url: layer.url,
								layerPaths: layer.layer,
								customParams: layerOptions || customOptions,
								name: layer.name,
								id: layer.id
							}, groupId, true);
						}

                        // add map title
                        if ((scope.mapLayerInfo && scope.mapLayerInfo === 'simple') || (scope.configuration && scope.configuration.mapLayerInfo === "simple")) {
                            let content = layer.name;
                            // TODO: FIX QUICK HACK.
                            if(layerOptions && layerOptions.time) {
                                if (layerOptions.time.length === 4) {
                                    content += " (" + layerOptions.time + ")";
                                } else {
                                    content += " (" + stringUtils.parseDate(layerOptions.time) + ")";
                                }
                            }
                            map.mapWindowTools.addLayerInfo(content);
                        }
                    }
                });
            } else {
                console.error('MapStore#addWmsLayersToMap: No layer with id' + layerId + 'present in WMS Layers store');
            }

        }).catch(function (err) {
            throw new Error(err);
        });
    };

    addChoroplethToMap(mapKey, choroplethKey, data){
    	let map = _.find(this._maps, (map) => {
    		return map.id === mapKey;
		});
    	if (map){
			map.layers.addChoroplethLayer({
				id: choroplethKey,
				name: "Choropleth",
				sldId: data.sldId,
				opacity: 70,
				layer: data.layer,
			}, "thematic-layers", true);
		}
	}

	removeChoroplethFromMap(mapKey, choroplethKey){
		let map = _.find(this._maps, (map) => {
			return map.id === mapKey;
		});
		if (map){
			let layer = map.layers.getLayerById(choroplethKey);
			if (layer){
				map.layers.removeLayer(layer, true);
			}
		}
	}

	changeMapName(mapId, name){
		this._maps.forEach(function(map){
			if (map.id === mapId){
				map._name = name;
				map.mapWindowTools.addMapLabelWithName(name);
			}
		});
	};

    /**
     * Get all maps from this store
     * @returns {{}|*}
     */
    getAll() {
        return this._maps;
    };

    /**
     * Get map according to given period
     * @param id {number} id of the period
     */
    getMapByPeriod(id) {
        return _.filter(this._maps, function (map) {
            return map.period === id;
        })[0];
    };

    /**
     * Get map by id
     * @param id {string} id of the map
     * @returns {Object}
     */
    getMapById(id) {
        return _.filter(this._maps, function (map) {
            return map.id === id;
        })[0];
    };

	handleScenarioDefaultSituation (showDefault) {
		if (showDefault){
			this._dispatcher.notify("scenario#addDefaultSituationMap");
		} else {
			let mapId = "default-map";
			let map = _.find(this._maps, function(map){return map.isDefaultScenarioSituation === true});
			if (map){
				mapId = map._id
			}
			this.remove({id: mapId});
		}
	};

    /**
     * It removes old map from the store.
     * @param options {Object}
     * @param options.id {String} Map which should be removed from DOM.
     */
    remove(options) {
        this._maps = _.reject(this._maps, function (map) {
            return map.id === options.id;
        });
        this._dispatcher.notify('map#removed', options);
    };

    removeAllGeometriesFromAllPlaceLayers(){
        this._maps.forEach(function(map){
            map.removeAllGeometriesFromPlaceLayer();
        });
    }

    /**
     * Remove all layers from group in given map
     * @param group {string}
     * @param mapId {string}
     */
    removeAllLayersFromGroup(group, mapId) {
        this._maps.forEach(function (map) {
            if (map.id === mapId) {
                map._wwd.layers.forEach(function (layer) {
                    if (layer.metadata && layer.metadata.group === group) {
                        map.layers.removeLayerFromMap(layer, true);
                        map.mapWindowTools.removeLayerInfo();
                    }
                });
            }
        });
    };

    /**
     * Remove all layers from group in all maps
     * @param group {string}
     */
    removeAllLayersFromGroupFromAllMaps(group) {
        this._maps.forEach(function (map) {
            map._wwd.layers.forEach(function (layer) {
                if (layer.metadata && layer.metadata.group === group) {
                    map.layers.removeLayerFromMap(layer, true);
                    map.mapWindowTools.removeLayerInfo();
                }
            });
        });
    };

	removeByScenario(scenarioKey){
		let map = _.find(this._maps, function(map){return map.scenarioKey === scenarioKey});
		this.remove({id: map._id});
	};

    removeGeometryFromPlaceLayer(geometryKey, mapKey){
        this._maps.forEach(function(map){
            if (map.id === mapKey){
                map.removeGeometryFromPlaceLayer(geometryKey);
            }
        });
    }

    removeLayerFromGroup(mapId, layerId, group) {
        this._maps.forEach(function (map) {
            if (map.id === mapId) {
                map._wwd.layers.forEach(function (layer) {
                    if (layer.metadata && layer.metadata.group === group && layer.metadata.id === layerId) {
                        map.layers.removeLayer(layer, true);
                        map.mapWindowTools.removeLayerInfo();
                    }
                });
            }
        });
    };

	removeLayerFromMap(layerTemplate, mapId) {
		this._maps.forEach(function (map) {
			if (map.id === mapId) {
				map._wwd.layers.forEach(function (layer) {
					if (layer.metadata) {
						let id = layerTemplate.templateId;
						if (layer.metadata.style){
							id += "-" + layer.metadata.style;
						}
						if (layer.metadata.id === id){
							map.layers.removeLayer(layer, true);
						}
					}
				});
			}
		});
	};

    /**
     * It accepts events in the application and handles these that are relevant.
     * @param type {String} Event type to distinguish whether this store cares.
     * @param options {Object} additional options, may be specific per action.
     */
    onEvent(type, options) {
    	let state = null;
    	let scope = null;
    	let wmsGroup = "wms-layers";
    	if (type === "ADD_INFO_LAYERS_BY_SCENARIOS" || type === "REMOVE_INFO_LAYERS_BY_SCENARIOS" || type === "AOI_GEOMETRY_SET" || type === "ADD_WMS_LAYER" || type === "REMOVE_WMS_LAYER"){
			state = this._stateStore.current();
			scope = state.scopeFull;
			if (scope && scope.isMapIndependentOfPeriod) {
				wmsGroup = "wms-layers-independent";
			}
		}


        if (type === Actions.mapAdd) {
            this.add(options);
        } else if (type === Actions.mapRemove) {
            this.remove(options);
        }

        // notifications from React
		else if (type === "ADD_INFO_LAYERS_BY_SCENARIOS") {
			if (scope.scenarios){
				console.log("## ADD_INFO_LAYERS_BY_SCENARIOS", options);
				this.addInfoLayersByScenarios(options.added, options.activePlaceKey, scope.configuration);
			}
		} else if (type === "REMOVE_INFO_LAYERS_BY_SCENARIOS") {
			if (scope.scenarios){
				console.log("## REMOVE_INFO_LAYERS_BY_SCENARIOS", options);
				this.removeInfoLayersByScenarios(options);
			}
		} else if (type === "ADD_WMS_LAYER") {
            console.log("## ADD_WMS_LAYER", options);
            let customParams = null;
            if (options.period) {
                customParams = {time: options.period};
            }
            this.addWmsLayerToMap(options.layerKey, customParams, options.mapKey, wmsGroup);
        } else if (type === "REMOVE_WMS_LAYER") {
            console.log("## REMOVE_WMS_LAYER", options);
            this.removeLayerFromGroup(options.mapKey, options.layerKey, wmsGroup);
        } else if (type === "AOI_GEOMETRY_SET") {
            if (state.previousAoi) {
                this.removeAllLayersFromGroupFromAllMaps(wmsGroup);
            }
        } else if (type === "PLACE_GEOMETRY_ADD"){
            this.addGeometryToPlaceLayer({
                key: options.geometryKey,
                geometry: options.geometry
            }, options.mapKey);
        } else if (type === "PLACE_GEOMETRY_REMOVE"){
            this.removeGeometryFromPlaceLayer(options.geometryKey, options.mapKey);
        } else if (type === "REDUX_SET_ACTIVE_PLACES"){
            this.removeAllGeometriesFromAllPlaceLayers();
        } else if (type === "REMOVE_MAP_BY_SCENARIO"){
			this.removeByScenario(options.scenarioKey);
		} else if (type === "HANDLE_SCENARIO_DEFAULT_SITUATION"){
			this.handleScenarioDefaultSituation(options.showDeafaultSituation);
		} else if (type === "CHANGE_MAP_NAME") {
			this.changeMapName(options.mapKey, options.name);
		} else if (type === "CHOROPLETH_ADD"){
			this.addChoroplethToMap(options.mapKey, options.choroplethKey, options.data);
		} else if (type === "CHOROPLETH_REMOVE"){
			this.removeChoroplethFromMap(options.mapKey, options.choroplethKey);
		} else if (type === "CHOROPLETH_CHANGE"){
			this.removeChoroplethFromMap(options.mapKey, options.choroplethKey);
			this.addChoroplethToMap(options.mapKey, options.choroplethKey, options.data);
		}
    };
}

export default MapStore;