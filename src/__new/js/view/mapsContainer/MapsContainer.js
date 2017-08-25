define([
	'../../actions/Actions',
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
], function(Actions,
			ArgumentError,
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

		this._mapsCount = 0;

		this.build();
		this._dispatcher.addListener(this.onEvent.bind(this));
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

		this.addCloseButtonOnClickListener();
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
		this._mapsCount++;
		this.rebuildContainer();
	};

	/**
	 * Remove map from DOM
	 * @param id {string} ID of the map
	 */
	MapsContainer.prototype.removeMap = function(id){
		$("#" + id + "-box").remove();
		this._mapsCount--;
		this.rebuildContainer();
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
		this.rebuildContainer();
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

	/**
	 * Add listener to close button of each map except the default one
	 */
	MapsContainer.prototype.addCloseButtonOnClickListener = function(){
		var self = this;
		this._containerSelector.on("click", ".close-map-button", function(){
			var mapId = $(this).attr("data-id");
			self._dispatcher.notify(Actions.mapRemove, {id: mapId});
		});
	};

	MapsContainer.prototype.onEvent = function(type, options){
		if (type === Actions.mapRemove){
			this.removeMap(options.id);
		}
	};

	/**
	 * Rebuild grid according to a number of active maps
	 */
	MapsContainer.prototype.rebuildContainer = function(){
		var width = this._containerSelector.width();
		var height = this._containerSelector.height();

		var a = 'w';
		var b = 'h';
		if (height > width){
			a = 'h';
			b = 'w';
		}

		this._containerSelector.attr('class', 'maps-container');
		var cls = '';
		if (this._mapsCount === 2){
			cls += a + '2';
		} else if (this._mapsCount > 2 && this._mapsCount <= 4){
			cls += a + '2 ' + b + '2';
		} else if (this._mapsCount > 4 && this._mapsCount <= 6){
			cls += a + '3 ' + b + '2';
		} else if (this._mapsCount > 6 && this._mapsCount <= 9){
			cls += a + '3 ' + b + '3';
		} else if (this._mapsCount > 9 && this._mapsCount <= 12){
			cls += a + '4 ' + b + '3';
		} else if (this._mapsCount > 12 && this._mapsCount <= 16){
			cls += a + '4 ' + b + '4';
		}
		this._containerSelector.addClass(cls)
	};

	return MapsContainer;
});