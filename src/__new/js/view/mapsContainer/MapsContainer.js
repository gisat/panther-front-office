define([
	'../../error/ArgumentError',
	'../../error/NotFoundError',
	'../../util/Logger',

	'../worldWind/controls/Controls',
	'../../stores/Stores',
	'../worldWind/WorldWindMap',

	'string',
	'jquery',
	'text!./MapsContainer.html',
	'css!./MapsContainer'
], function(ArgumentError,
			NotFoundError,
			Logger,

			Controls,
			Stores,
			WorldWindMap,

			S,
			$,
			mapsContainer
){
	/**
	 * Class representing container containing maps
	 * @param options {Object}
	 * @param options.id {string} id of the container
	 * @param options.dispatcher {Object} Object for handling events in the application.
	 * @param options.target {Object} JQuery selector of target element
	 * @param options.mapStore {MapStore}
	 * @constructor
	 */
	var MapsContainer = function(options){
		if (!options.target || !options.target.length){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MapsContainer", "constructor", "missingTarget"));
		}
		if (!options.dispatcher){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MapsContainer", "constructor", "missingDispatcher"));
		}
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MapsContainer", "constructor", "missingId"));
		}
		if (!options.mapStore){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MapsContainer", "constructor", "missingMapStore"));
		}
		this._target = options.target;
		this._id = options.id;
		this._dispatcher = options.dispatcher;
		this._mapStore = options.mapStore;

		this._mapControls = null;

		this.build();
	};

	/**
	 * Build container
	 */
	MapsContainer.prototype.build = function(){
		var html = S(mapsContainer).template({
			id: this._id
		}).toString();
		this._target.append(html);
		this._containerSelector = $("#" + this._id);
	};

	/**
	 * Add map to container
	 * @param id {string} Id of the map
	 */
	MapsContainer.prototype.addMap = function (id) {
		var worldWindMap = this.buildWorldWindMap(id);
		this._dispatcher.notify('map#add', {map: worldWindMap});

		// if there are controls for default map already, attach world window of this map to them
		if (this._mapControls){
			this._mapControls.addWorldWindow(worldWindMap._wwd);
		} else {
			this._mapControls = this.buildMapControls(worldWindMap._wwd);
		}
	};

	/**
	 * Rebuild all maps in container
	 */
	MapsContainer.prototype.rebuildMaps = function(){
		var appState = Stores.retrieve('state').current();
		var maps = this._mapStore.getAll();
		for(var key in maps){
			maps[key].rebuild(appState);
		}
	};

	/**
	 * Set position of all maps in this container
	 * @param position {WorldWind.Position}
	 */
	MapsContainer.prototype.setAllMapsPosition = function(position){
		var maps = this._mapStore.getAll();
		for(var key in maps){
			maps[key].goTo(position);
		}
	};

	/**
	 * Build a World Wind Map
	 * @param id {string} Id of the map which should distinguish one map from another
	 * @returns {WorldWindMap}
	 */
	MapsContainer.prototype.buildWorldWindMap = function(id){
		return new WorldWindMap({
			dispatcher: window.Stores,
			id: id,
			mapsContainer: this._containerSelector
		});
	};

	/**
	 * Build controls and setup interaction
	 * @param wwd {WorldWindow}
	 */
	MapsContainer.prototype.buildMapControls = function(wwd){
		return new Controls({
			mapContainer: this._containerSelector,
			worldWindow: wwd
		});
	};

	/**
	 * Retrun Jquery selector of maps container
	 * @returns {*|jQuery|HTMLElement}
	 */
	MapsContainer.prototype.getContainerSelector = function(){
		return this._containerSelector;
	};

	return MapsContainer;
});