define(['../../actions/Actions',
		'../../error/ArgumentError',
		'../../error/NotFoundError',
		'../../util/Logger',

		'./layers/Layers',
		'../../worldwind/MyGoToAnimator',
		'../../worldwind/layers/osm3D/OSMTBuildingLayer',
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
			OSMTBuildingLayer,
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
	 * @param options.mapsContainer {Object} JQuery selector of target element
	 * @param options.period {Number|null} Period associated with this map.
	 * @param options.dispatcher {Object} Object for handling events in the application.
	 * @constructor
	 */
	var WorldWindMap = function(options){
		if (!options.mapsContainer){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindMap", "constructor", "missingMapsContainer"));
		}
		this._mapsContainerSelector = options.mapsContainer;

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
	 * It builds Web World Wind
	 */
	WorldWindMap.prototype.build = function(){
		var html = S(worldWindMap).template({
			id: this._id
		}).toString();
		this._mapsContainerSelector.append(html);
		this._mapBoxSelector = this._mapsContainerSelector.find("#" + this._id + "-box");

		this.setupWebWorldWind();
		if (this._id !== 'default-map'){
			this.addCloseButton();
			this.addPeriod();
		}
	};

	/**
	 * Add close button to this map
	 */
	WorldWindMap.prototype.addCloseButton = function(){
		var html = '<div title="Remove map" class="close-map-button" data-id="' + this._id + '"><i class="fa fa-times close-map-icon" aria-hidden="true"></i></div>';
		this._mapBoxSelector.find(".map-window-tools").append(html);
	};

	/**
	 * Add label with info about period to the map and add dataPeriod attribute of the map container (it is used for sorting)
	 */
	WorldWindMap.prototype.addPeriod = function(){
		if (this._periodLabelSelector){
			this._periodLabelSelector.remove();
		}
		var self = this;
		Stores.retrieve("period").byId(this._period).then(function(periods){
			if (periods.length === 1){
				var periodName = periods[0].name;
				var html = '<div class="map-period-label">' + periodName + '</div>';
				self._mapBoxSelector.attr("data-period", periodName);
				self._mapBoxSelector.find(".map-window-tools").append(html);
				self._periodLabelSelector = self._mapBoxSelector.find(".map-period-label")
			}
		});
	};

	/**
	 * Set up Web World Wind
	 */
	WorldWindMap.prototype.setupWebWorldWind = function(){
		this._wwd = this.buildWorldWindow();
		this._wwd.addEventListener("mousemove", this.updateNavigatorState.bind(this));
		this._wwd.addEventListener("wheel", this.updateNavigatorState.bind(this));

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
	 * Rebuild map
	 */
	WorldWindMap.prototype.rebuild = function(){
		var state = Stores.retrieve("state").current();
		if (state.changes.scope || state.changes.location){
			this._goToAnimator.setLocation();
		}
		if (this._id === "default-map"){
			this.updateNavigatorState();
			var periods = state.periods;
			if (periods.length === 1){
				this._period = periods[0];
			}
			if (!Config.toggles.hideSelectorToolbar){
				this.addPeriod();
			}
		} else {
			var self = this;
			setTimeout(function(){
				self.setNavigator();
			},1000);
		}
	};

	/**
	 * Update state of the navigator in MapStore. It is used for contolling of multiple maps at the same time.
	 */
	WorldWindMap.prototype.updateNavigatorState = function(){
		this._dispatcher.notify(Actions.mapControl, this._wwd.navigator);
	};

	/**
	 * Get navigator state from store and set this map navigator's parameters.
	 */
	WorldWindMap.prototype.setNavigator = function(){
		var navigatorState = Stores.retrieve('map').getNavigatorState();

		this._wwd.navigator.heading = navigatorState.heading;
		this._wwd.navigator.lookAtLocation = navigatorState.lookAtLocation;
		this._wwd.navigator.range = navigatorState.range;
		this._wwd.navigator.roll = navigatorState.roll;
		this._wwd.navigator.tilt = navigatorState.tilt;

		this.redraw();
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

	/**
	 * Add layer to map
	 * @param layer {Layer}
	 */
	WorldWindMap.prototype.addLayer = function(layer) {
		this._wwd.addLayer(layer);
	};

	/**
	 * Remove layer from map
	 * @param layer {Layer}
	 */
	WorldWindMap.prototype.removeLayer = function(layer) {
		this._wwd.removeLayer(layer);
	};

	/**
	 * Go to specific position in map
	 * @param position {Position}
	 */
	WorldWindMap.prototype.goTo = function(position) {
		console.log('WorldWindMap#goTo Position: ', position);

        this._wwd.navigator.lookAtLocation = position;
        this._wwd.redraw();
	};

	/**
	 * Switch projection from 3D to 2D and vice versa
	 */
	WorldWindMap.prototype.switchProjection = function(){
		var globe = null;
		var is2D = this._wwd.globe.is2D();
		if (is2D){
			globe = new WorldWind.Globe(new WorldWind.EarthElevationModel());
		} else {
			globe = new WorldWind.Globe2D();
			globe.projection = new WorldWind.ProjectionMercator();
		}
		this._wwd.globe = globe;
		this.redraw();
	};

	/**
	 * Add on click recognizer
	 * @param callback {function} on click callback
	 */
	WorldWindMap.prototype.addClickRecognizer = function(callback){
		if (!this._clickRecognizer){
			this._clickRecognizer = new WorldWind.ClickRecognizer(this._wwd, this.onMapClick.bind(this, callback));
		}
		this._clickRecognizer.enabled = true;
	};

	/**
	 * Disable map on click recognizer
	 */
	WorldWindMap.prototype.disableClickRecognizer = function(){
		this._clickRecognizer.enabled = false;
	};

	/**
	 * Do on map click
	 * @param callback {function}
	 * @param event {Object}
	 */
	WorldWindMap.prototype.onMapClick = function(callback, event){
		var gid = null;
		var coordinates = null;
		var auLayer = this.layers.getAuLayer()[0];
		var auLayerSource = "panther:layer_226"; // TODO find it out from OlMap
		var property = "gid";

		var x = event._clientX,
			y = event._clientY;
		var pickList = this._wwd.pick(this._wwd.canvasCoordinates(x, y));
		if (pickList){
			var position = pickList.objects[0].position;
			coordinates = {
				lat: position.latitude,
				lon: position.longitude
			};
		}

		if (auLayer.metadata.active && coordinates){
			auLayer.getFeatureInfo(property, coordinates, auLayerSource).then(function(feature){
				if (feature && feature.properties){
					gid = feature.properties[property];
				}
				callback(gid);
			});
		} else {
			callback(gid);
		}
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

	return WorldWindMap;
});