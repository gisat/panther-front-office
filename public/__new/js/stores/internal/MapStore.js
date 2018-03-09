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
	 */
	var MapStore = function(options) {
		if (!options.dispatcher){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MapStore", "constructor", "Dispatcher must be provided"));
		}

		this._dispatcher = options.dispatcher;

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
	 * It accepts events in the application and handles these that are relevant.
	 * @param type {String} Event type to distinguish whether this store cares.
	 * @param options {Object} additional options, may be specific per action.
	 */
	MapStore.prototype.onEvent = function(type, options) {
		if(type === Actions.mapAdd) {
			this.add(options);
		} else if (type === Actions.mapRemove) {
			this.remove(options);
		}
	};

	return MapStore;
});