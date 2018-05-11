define([
	'../../actions/Actions',
	'../../error/ArgumentError',
	'../../error/NotFoundError',
	'../../util/Logger',

	'../../util/stringUtils',

	'underscore'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,
			utils,
			_
){
	/**
	 * It creates MapStore and contains maps themselves
	 * @constructor
	 * @param options {Object}
	 * @param options.dispatcher {Object} Dispatcher, which is used to distribute actions across the application.
	 * @param options.maps {WorldWindMap[]} 3D maps which are handled by this store.
	 * @param options.store {Object}
	 */
	var MapStore = function(options) {
		if (!options.dispatcher){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MapStore", "constructor", "Dispatcher must be provided"));
		}
		if(!options.store){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MapStore', 'constructor', 'Stores must be provided'));
		}

		this._dispatcher = options.dispatcher;
		this._stateStore = options.store.state;
		this._wmsStore = options.store.wms;

		this._maps = [];

		if (options.maps){
			options.maps.forEach(function(map){
				this._maps.push(map);
			}.bind(this));
		}

		this._dispatcher.addListener(this.onEvent.bind(this));
	};

	/**
	 * It adds new map into this store.
	 * @param options {Object}
	 * @param options.map {WorldWindMap} Visible map.
	 */
	MapStore.prototype.add = function(options) {
		this._maps.push(options.map);
		this._dispatcher.notify('map#added', options);
	};

	MapStore.prototype.addGeometryToPlaceLayer = function(geometry, mapKey){
		this._maps.forEach(function(map){
			if (map.id === mapKey){
				map.addGeometryToPlaceLayer(geometry);
			}
		});
	};

	/**
	 * Add WMS layer to given map.
	 * @param layerId {string|number} id of WMS Layer
	 * @param layerOptions {Object}
	 * @param mapId {string} id of the map
	 */
	MapStore.prototype.addWmsLayerToMap = function(layerId, layerOptions, mapId, groupId){
		var self = this;
		var state = this._stateStore.current();
		var scope = state.scopeFull;
		var isIndependent = state.isMapIndependentOfPeriod;
		this._wmsStore.byId(layerId).then(function(results){
			if (results.length){
				var layer = results[0];
				self._maps.forEach(function(map){
					var periodExists = _.find(layer.periods, function(period){return period == map._period});

					if (map.id === mapId && (isIndependent || (!isIndependent && periodExists))){
						var customOptions = null;
						try{
							customOptions = JSON.parse(layer.custom);
						} catch(e){}

						// add layer
						map.layers.addWmsLayer({
							url: layer.url,
							layerPaths: layer.layer,
							customParams: layerOptions || customOptions,
							name: layer.name,
							id: layer.id
						},groupId,true);

						// add map title
						if (scope.mapLayerInfo && scope.mapLayerInfo === 'simple'){
							var content = layer.name;
							if (layerOptions && layerOptions.time){
								// TODO: FIX QUICK HACK.
								if(layerOptions.time.length === 4) {
                                    content += " (" + layerOptions.time + ")";
								} else {
                                    content += " (" + utils.parseDate(layerOptions.time) + ")";
                                }
							}
							map.mapWindowTools.addLayerInfo(content);
						}
					}
				});
			} else {
				console.error('MapStore#addWmsLayersToMap: No layer with id' + layerId + 'present in WMS Layers store');
			}

		}).catch(function(err){
			throw new Error(err);
		});
	};

	MapStore.prototype.changeMapName = function(mapId, name){
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
	MapStore.prototype.getAll = function(){
		return this._maps;
	};

	/**
	 * Get map according to given period
	 * @param id {number} id of the period
	 */
	MapStore.prototype.getMapByPeriod = function(id) {
		return _.filter(this._maps, function (map) {
			return map.period === id;
		})[0];
	};

	/**
	 * Get map by id
	 * @param id {string} id of the map
	 * @returns {Object}
	 */
	MapStore.prototype.getMapById = function(id){
		return _.filter(this._maps, function (map) {
			return map.id === id;
		})[0];
	};

	MapStore.prototype.handleScenarioDefaultSituation = function (showDefault) {
		if (showDefault){
			this._dispatcher.notify("scenario#addDefaultSituationMap");
		} else {
			var mapId = "default-map";
			var map = _.find(this._maps, function(map){return map.isDefaultScenarioSituation === true});
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
	MapStore.prototype.remove = function(options) {
		this._maps = _.reject(this._maps, function(map) { return map.id === options.id; });
		this._dispatcher.notify('map#removed', options);
	};

	MapStore.prototype.removeAllGeometriesFromAllPlaceLayers = function(){
		this._maps.forEach(function(map){
			map.removeAllGeometriesFromPlaceLayer();
		});
	};

	/**
	 * Remove all layers from group in given map
	 * @param group {string}
	 * @param mapId {string}
	 */
	MapStore.prototype.removeAllLayersFromGroup = function(group, mapId){
		this._maps.forEach(function(map){
			if (map.id === mapId){
				map._wwd.layers.forEach(function(layer){
					if (layer.metadata && layer.metadata.group === group){
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
	MapStore.prototype.removeAllLayersFromGroupFromAllMaps = function(group){
		this._maps.forEach(function(map){
			map._wwd.layers.forEach(function(layer){
				if (layer.metadata && layer.metadata.group === group){
					map.layers.removeLayerFromMap(layer, true);
					map.mapWindowTools.removeLayerInfo();
				}
			});
		});
	};

	MapStore.prototype.removeByScenario = function(scenarioKey){
		var map = _.find(this._maps, function(map){return map.scenarioKey === scenarioKey});
		this.remove({id: map._id});
	};

	MapStore.prototype.removeGeometryFromPlaceLayer = function(geometryKey, mapKey){
		this._maps.forEach(function(map){
			if (map.id === mapKey){
				map.removeGeometryFromPlaceLayer(geometryKey);
			}
		});
	};

	MapStore.prototype.removeLayerFromGroup = function(mapId, layerId, group){
		this._maps.forEach(function(map){
			if (map.id === mapId){
				map._wwd.layers.forEach(function(layer){
					if (layer.metadata && layer.metadata.group === group && layer.metadata.id == layerId){
						map.layers.removeLayerFromMap(layer, true);
						map.mapWindowTools.removeLayerInfo();
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
	MapStore.prototype.onEvent = function(type, options) {
		var state = this._stateStore.current();
		var scope = state.scopeFull;
		var wmsGroup = "wms-layers";
		if(scope && scope.isMapIndependentOfPeriod){
			wmsGroup = "wms-layers-independent";
		}

		if(type === Actions.mapAdd) {
			this.add(options);
		} else if (type === Actions.mapRemove) {
			this.remove(options);
		}

		// notifications from React
		else if (type === "ADD_WMS_LAYER"){
			console.log("## ADD_WMS_LAYER", options);
			let customParams = null;
			if (options.period){
				customParams = {time: options.period};
			}
			this.addWmsLayerToMap(options.layerKey, customParams, options.mapKey, wmsGroup);
		} else if (type === "REMOVE_WMS_LAYER"){
			console.log("## REMOVE_WMS_LAYER", options);
			this.removeLayerFromGroup(options.mapKey, options.layerKey, wmsGroup);
		} else if (type === "AOI_GEOMETRY_SET"){
			if (state.previousAoi){
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
		}
	};

	return MapStore;
});