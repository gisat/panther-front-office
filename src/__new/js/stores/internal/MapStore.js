define([
	'../../actions/Actions'
], function(Actions){
	/**
	 * It creates MapStore and contains maps themselves
	 * @constructor
	 * @param options {Object}
	 * @param options.dispatcher Dispatcher, which is used to distribute actions across the application.
	 * @param options.maps {WorldWindMap[]} 3D maps which are handled by this store.
	 */
	var MapStore = function(options) {
		options.dispatcher.addListener(this.onEvent.bind(this));

		this._maps = {};
		this._navigatorState = {};

		if (options.maps){
			options.maps.forEach(function(map){
				this._maps[map._id] = map;
			}.bind(this));
		}
	};

	/**
	 * It adds new map into this store.
	 * @param options {Object}
	 * @param options.map {WorldWindMap} Visible map.
	 */
	MapStore.prototype.add = function(options) {
		this._maps[options.map._id] = options.map;
	};

	/**
	 * It removes old map from the store.
	 * @param options {Object}
	 * @param options.id {String} Map which should be removed from DOM.
	 */
	MapStore.prototype.remove = function(options) {
		delete this._maps[options.id];
	};

	/**
	 * Get all maps from this store
	 * @returns {{}|*}
	 */
	MapStore.prototype.getAll = function(){
		return this._maps;
	};

	/**
	 * It updates the settings of World wind navigator
	 * @param options {Object}
	 */
	MapStore.prototype.updateNavigator = function(options){
		this._navigatorState = options;
	};

	/**
	 * Return the current settings of World wind navigator
	 * @returns {Object}
	 */
	MapStore.prototype.getNavigatorState = function(){
		return this._navigatorState;
	};

	/**
	 * It accepts events in the application and handles these that are relevant.
	 * @param type {String} Event type to distinguish whether this store cares.
	 * @param options {Object} additional options, may be specific per action.
	 */
	MapStore.prototype.onEvent = function(type, options) {
		if(type === Actions.mapAdd) {
			this.add(options);
		} else if (type === Actions.mapRemove) {
			this.remove(options);
		} else if (type === Actions.mapControl) {
			this.updateNavigator(options);
		}
	};

	return MapStore;
});