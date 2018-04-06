define([
	'../../actions/Actions',
	'../../error/ArgumentError',
	'../../error/NotFoundError',
	'../../util/Logger',

	'../../worldwind/layers/MyOsmLayer',

	'underscore'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,

			MyOsmLayer,

			_
){
	/**
	 * @constructor
	 * @param options {Object}
	 * @param options.dispatcher {Object} Dispatcher, which is used to distribute actions across the application.
	 * @param options.store {Object}
	 * @param options.store.state {Object}
	 */
	var LayerStore = function(options) {
		if (!options.dispatcher){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "LayerStore", "constructor", "Dispatcher must be provided"));
		}
		if(!options.store){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'LayerStore', 'constructor', 'Stores must be provided'));
		}
		if(!options.store.state){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'LayerStore', 'constructor', 'State store must be provided'));
		}

		this._dispatcher = options.dispatcher;
		this._stateStore = options.store.state;
		this._layers = {
			backgroundLayers: []
		};

		this._dispatcher.addListener(this.onEvent.bind(this));
	};

	/**
	 *
	 * @param [layer] {MyOsmLayer}
	 */
	LayerStore.prototype.addBaseLayer = function(map, layer){
		var baseLayer = layer;

		if (!baseLayer){
			baseLayer = new MyOsmLayer({
				attribution: "\u00A9 Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL",
				source: "http://a.basemaps.cartocdn.com/light_nolabels/"});
			this._layers.backgroundLayers.push({
				key: "base-layer",
				data: baseLayer
			});
		}

		map.layers.addBaseLayer(baseLayer);
		this._dispatcher.notify("backgroundLayer#add", {key: "base-layer"});
	};

	LayerStore.prototype.handleBaseLayer = function(map){
		var state = this._stateStore.current();
		if (state.mapDefaults && state.mapDefaults.backgroundLayers){
			debugger;
			// if so, find the layer in layers.backgroundLayers
			// this.addBaseLayer(map, layer);

			// else
			// this.addBaseLayer(map);
		} else {
			this.addBaseLayer(map);
		}
	};

	/**
	 * It accepts events in the application and handles these that are relevant.
	 * @param type {String} Event type to distinguish whether this store cares.
	 * @param options {Object} additional options, may be specific per action.
	 */
	LayerStore.prototype.onEvent = function(type, options) {
		if (type === 'map#initialized'){
			this.handleBaseLayer(options.map);
		}
	};

	return LayerStore;
});