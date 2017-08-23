define(['../../actions/Actions',
		'../../error/ArgumentError',
		'../../error/NotFoundError',
		'../../util/Logger',

		'./layers/Layers',
		'../../worldwind/MyGoToAnimator',
		'../../stores/Stores',
		'../../stores/internal/VisibleLayersStore',
		'../../util/Uuid',

		'string',
		'jquery',
		'text!./WorldWindMap.html',
		'css!./WorldWindMap',
		'worldwind'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,

			Layers,
			MyGoToAnimator,
			Stores,
			VisibleLayersStore,
			Uuid,

			S,
			$,
			worldWindMap
){
	/**
	 * Class World Wind Map
	 * @param options {Object}
	 * @param options.id {String|null} Id distinguishing the map from the other ones.
	 * @param options.mapsContainer {MapsContainer} Container where the map will be rendered
	 * @param options.period {Number|null} Period associated with this map.
	 * @param options.dispatcher {Object} Object for handling events in the application.
	 * @constructor
	 */
	var WorldWindMap = function(options){
		if (!options.mapsContainer){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindMap", "constructor", "missingMapsContainer"));
		}

		this._mapsContainer = options.mapsContainer;
		this._mapsContainerSelector = this._mapsContainer.getContainerSelector();
		this._dispatcher = options.dispatcher;

		this._id = options.id || new Uuid().generate();

		/**
		 * Every map is associated with the period. If no period is specified, then it is supplied latest when the first
		 * state change containing period happens.
		 * @type {Number|null}
		 * @private
		 */
		this._period = options.period || null; // Accept all state changes unless the period is specified.

		/**
		 * Store containing selected layers. It is responsible for adding newly selected layers and removing the
		 * unselected ones.
		 * It isn't actually used here. It is only created, but as the map can be destroyed, the store must be also
		 * destroyed.
		 * @type {SelectedLayersStore}
		 * @private
		 */
		this._selectedLayers = new VisibleLayersStore({
			dispatcher: options.dispatcher,
			id: this._id,
			map: this
		});

		this.build();
		this._dispatcher.addListener(this.onEvent.bind(this));
	};

	Object.defineProperties(WorldWindMap.prototype, {
		/**
		 * Unique identifier of the map.
		 * @memberOf WorldWindMap.prototype
		 * @type {String}
		 */
		id: {
			get: function() {
				return this._id;
			}
		},

		/**
		 * Period associated with given map.
		 * @memberOf WorldWindMap.prototype
		 * @type {Number}
		 */
		period: {
			get: function() {
				return this._period;
			},
			set: function(period) {
				this._period = period;
			}
		},

		selectedLayers: {
			get: function() {
				return this._selectedLayers;
			}
		}
	});


	/**
	 * Rebuild world wind map
	 * @param config {Object} ThemeYearsConfParams global object
	 * @param widget {JQuery} JQuery widget selector
	 */
	WorldWindMap.prototype.rebuild = function(config, widget){
		this._goToAnimator.setLocation(config, widget)
	};

	/**
	 * It builds Web World Wind
	 */
	WorldWindMap.prototype.build = function(){
		var html = S(worldWindMap).template({
			id: this._id
		}).toString();
		this._mapsContainerSelector.append(html);
		this._mapBoxSelector = this._mapsContainerSelector.find("#" + this._id + "-box");

		this.setupWebWorldWind();
	};

	/**
	 * @param type {string} type of event
	 * @param options {Object}
	 */
	WorldWindMap.prototype.onEvent = function(type, options){
		if (type === Actions.mapControl) {
			this.setNavigator(options);
		}
	};

	WorldWindMap.prototype.handleManualRedraw = function(e){
		var navigatorSettings = this._wwd.navigator;
		this._dispatcher.notify(Actions.mapControl, navigatorSettings);
	};

	/**
	 * Set navigator state
	 */
	WorldWindMap.prototype.setNavigator = function(){
		var navigatorState = Stores.retrieve('map').getNavigatorState();

		this._wwd.navigator.heading = navigatorState.heading;
		this._wwd.navigator.lookAtLocation = navigatorState.lookAtLocation;
		this._wwd.navigator.range = navigatorState.range;
		this._wwd.navigator.roll = navigatorState.roll;
		this._wwd.navigator.tilt = navigatorState.tilt;
		this._wwd.redraw();
	};

	/**
	 * Set up Web World Wind
	 */
	WorldWindMap.prototype.setupWebWorldWind = function(){
		this._wwd = this.buildWorldWindow();
		this._wwd.addEventListener("mousemove", this.handleManualRedraw.bind(this));
		this._wwd.addEventListener("wheel", this.handleManualRedraw.bind(this));

		this._goToAnimator = new MyGoToAnimator(this._wwd);
		this.layers = new Layers(this._wwd);
	};

	/**
	 * Build the World Wind Window
	 * @returns {WorldWind.WorldWindow}
	 */
	WorldWindMap.prototype.buildWorldWindow = function(){
		return new WorldWind.WorldWindow(this._id + "-canvas");
	};

	/**
	 * It returns container for rendering of Web World Wind
	 * @returns {Object} JQuery selector
	 */
	WorldWindMap.prototype.getContainer = function(){
		return this._mapBoxSelector;
	};

	/**
	 * Redraw the map
	 */
	WorldWindMap.prototype.redraw = function(){
		this._wwd.redraw();
	};

	WorldWindMap.prototype.addLayer = function(layer) {
		this._wwd.addLayer(layer);
	};

	WorldWindMap.prototype.removeLayer = function(layer) {
		this._wwd.removeLayer(layer);
	};

	WorldWindMap.prototype.goTo = function(position) {
		this._wwd.goTo(position);
	};

	return WorldWindMap;
});