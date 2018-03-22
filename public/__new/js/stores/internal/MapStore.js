define([
	'../../actions/Actions',
	'../../error/ArgumentError',
	'../../error/NotFoundError',
	'../../util/Logger',
	'underscore'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,
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

	/**
	 * Add WMS layer to given map.
	 * @param layerId {string|number} id of WMS Layer
	 * @param layerOptions {Object}
	 * @param mapId {string} id of the map
	 */
	MapStore.prototype.addWmsLayerToMap = function(layerId, layerOptions, mapId){
		var self = this;
		var scope = this._stateStore.current().scopeFull;
		this._wmsStore.byId(layerId).then(function(results){
			if (results.length){
				var layer = results[0];
				self._maps.forEach(function(map){
					if (map.id === mapId){

						// add layer
						map.layers.addWmsLayer({
							url: layer.url,
							layerPaths: layer.layer,
							customParams: layerOptions,
							name: layer.name,
							id: layer.id
						},'wms-layers-independent',true);

						// add map title
						if (scope.mapLayerInfo && scope.mapLayerInfo === 'simple'){
							map.mapWindowTools.addLayerInfo(layer.name + " (" + layerOptions.time + ")");
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

	/**
	 * It removes old map from the store.
	 * @param options {Object}
	 * @param options.id {String} Map which should be removed from DOM.
	 */
	MapStore.prototype.remove = function(options) {
		this._maps = _.reject(this._maps, function(map) { return map.id === options.id; });
		this._dispatcher.notify('map#removed', options);
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

	/**
	 * It accepts events in the application and handles these that are relevant.
	 * @param type {String} Event type to distinguish whether this store cares.
	 * @param options {Object} additional options, may be specific per action.
	 */
	MapStore.prototype.onEvent = function(type, options) {
		var state = this._stateStore.current();
		var scope = state.scopeFull;

		if(type === Actions.mapAdd) {
			this.add(options);
		} else if (type === Actions.mapRemove) {
			this.remove(options);
		}

		// notifications from React
		else if (type === "ADD_WMS_LAYER"){
			// TODO replace with parameters from options
			if (scope.oneLayerPerMap){
				this.removeAllLayersFromGroup('wms-layers-independent', state.selectedMapId)
			}
			this.addWmsLayerToMap(3, {time: '2017-12-01'}, state.selectedMapId);
		} else if (type === "AOI_GEOMETRY_SET"){
			this.removeAllLayersFromGroupFromAllMaps('wms-layers-independent');
		}

	};

	return MapStore;
});