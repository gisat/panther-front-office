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
			baseLayer: null,
			backgroundLayers: []
		};

		this._dispatcher.addListener(this.onEvent.bind(this));
	};

	/**
	 * @param map {WorldWindMap}
	 * @param [layer] {Object}
	 * @param [layer.active] {boolean}
	 * @param [layer.data] {MyOsmLayer}
	 */
	LayerStore.prototype.addBaseLayer = function(map, layer){
		if (!layer){
			this._layers.baseLayer = {
				active: true,
				data: new MyOsmLayer({
					attribution: "\u00A9 Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL",
					source: "http://a.basemaps.cartocdn.com/light_nolabels/"})
			};
		}

		map.layers.addBaseLayer(this._layers.baseLayer.data);
		this._dispatcher.notify("baseLayer#update", {created: true, active: true});
	};

	/**
	 * If the base layer was already created, use it for the map. Otherwise, create the base layer.
	 * @param map {WorldWindMap}
	 */
	LayerStore.prototype.handleBaseLayer = function(map){
		var state = this._stateStore.current();
		if (state.mapDefaults && state.mapDefaults.baseLayer && state.mapDefaults.baseLayer.created && this._layers.baseLayer.data){
			this.addBaseLayer(map, this._layers.baseLayer.data);
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
		if (type === 'map#added'){
			this.handleBaseLayer(options.map);
			// this.handleBackroundLayers(options.map);
		}
	};

	return LayerStore;
});