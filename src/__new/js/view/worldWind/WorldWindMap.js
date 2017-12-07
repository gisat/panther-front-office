define(['../../actions/Actions',
		'../../error/ArgumentError',
		'../../error/NotFoundError',
		'../../util/Logger',

		'../../util/dataMining',
		'./layers/Layers',
		'../../worldwind/MyGoToAnimator',
		'../../worldwind/layers/osm3D/OSMTBuildingLayer',
		'../../stores/Stores',
		'../../stores/internal/VisibleLayersStore',
		'../../util/Uuid',
		'../../worldwind/WmsFeatureInfo',

		'string',
		'jquery',
		'text!./WorldWindMap.html',
		'css!./WorldWindMap',
		'worldwind'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,

			dataMininig,
			Layers,
			MyGoToAnimator,
			OSMTBuildingLayer,
			Stores,
			VisibleLayersStore,
			Uuid,
			WmsFeatureInfo,

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
			this.addPeriod();
		}
	};

	/**
	 * Add close button to this map
	 */
	WorldWindMap.prototype.addCloseButton = function(){
		var closeButton = this._mapBoxSelector.find(".close-map-button");
		if (closeButton.length === 0){
			var html = '<div title="Remove map" class="close-map-button" data-id="' + this._id + '"><i class="close-map-icon">&#x2715;</i></div>';
			this._mapBoxSelector.find(".map-window-tools").append(html);
		}
	};

	/**
	 * Remove close button to this map
	 */
	WorldWindMap.prototype.removeCloseButton = function(){
		this._mapBoxSelector.find(".close-map-button").remove();
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
				self._mapBoxSelector.find(".map-period-label").remove();
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
		console.log('WorldWindMap#rebuild');
		var state = Stores.retrieve("state").current();
		var self = this;
		if ((state.changes.scope || state.changes.location) && !state.changes.dataview){
			this._goToAnimator.setLocation();
			setTimeout(function(){
				console.log('WorldWindMap#rebuild Hide Loading');
				$("#loading-screen").css("display", "none")
			},1000);
		}
		if (this._id === "default-map"){
			self.updateNavigatorState();
			var periods = state.periods;
			if (periods.length === 1 || !this._period){
				this._period = periods[0];
			}
			if (!Config.toggles.hideSelectorToolbar){
				this.addPeriod();
			}
			if (state.changes.dataview || state.changes.level){
				setTimeout(function(){
					console.log('WorldWindMap#rebuild Hide Loading');
					$("#loading-screen").css("display", "none")
				},1000);
			}
		} else {
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
	 * Set map range
	 * @param range {number}
	 */
	WorldWindMap.prototype.setRange = function(range){
		this._wwd.navigator.range = range;
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
        this._wwd.redrawIfNeeded(); // TODO: Check with new releases. This isn't part of the public API and therefore might change.
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
	 * @param property {string} property for to find via getFeatureInfo
	 */
	WorldWindMap.prototype.addClickRecognizer = function(callback, property){
		if (!this._clickRecognizer){
			this._clickRecognizer = new WorldWind.ClickRecognizer(this._wwd.canvas, this.onMapClick.bind(this, callback, property));
		}
		this._clickRecognizer.enabled = true;
	};

	/**
	 * Disable map on click recognizer
	 */
	WorldWindMap.prototype.disableClickRecognizer = function(){
		if (this._clickRecognizer){
			this._clickRecognizer.enabled = false;
		}
	};

	/**
	 * Execute on map click. Find out a location of click target in lat, lon. And execute getFeatureInfo query for this location.
	 * @param callback {function} on click callback
	 * @param property {string} property for to find via getFeatureInfo
	 * @param event {Object}
	 */
	WorldWindMap.prototype.onMapClick = function(callback, property, event){
		var self = this;
		var gid = null;
		var coordinates = null;
		var auLayer = this.layers.getAuLayer()[0];
		var auBaseLayers = dataMininig.getAuBaseLayers(this._period);

		var x = event._clientX;
		var y = event._clientY;
		var position = this.getPositionFromCanvasCoordinates(x,y);
		if (position) {
			coordinates = {
				lat: position.latitude,
				lon: position.longitude
			};
		}

		if (auLayer.metadata.active && coordinates){
			auLayer.getFeatureInfo(property, coordinates, auBaseLayers.join(",")).then(function(feature){
				if (feature && feature.properties){
					gid = feature.properties[property];
				}
				callback(gid, self._period, {x:x,y:y});
			});
		} else {
			callback(gid);
		}
	};

	WorldWindMap.prototype.getLayersInfo = function(callback, event) {
		var x = event.x,
			y = event.y;
		var position = this.getPositionFromCanvasCoordinates(x,y);

		var tablePromises = event.worldWindow.layers.map(function(layer){
			console.log('WorldWindMap#showFeatureInfo Layer: ', layer);
			if(!layer || !layer.metadata || !layer.metadata.group || layer.metadata.group === 'areaoutlines') {
				return;
			}
			var serviceAddress = layer.urlBuilder.serviceAddress;
			var layerNames = layer.urlBuilder.layerNames;
			var crs = layer.urlBuilder.crs;
			var name = layerNames;
			var customParams = null;
			if (layer.metadata && layer.metadata.name){
				name = layer.metadata.name;
			}
			if (layer.urlBuilder.customParams){
				customParams = layer.urlBuilder.customParams;
			}

			return new WmsFeatureInfo({
				customParameters: customParams,
				serviceAddress: serviceAddress,
				layers: layerNames,
				position: position,
				src: crs,
				screenCoordinates: {x: x, y: y},
				name: name
			}).get();
		}).filter(function(state){
			return state;
		});

		return Promise.all(tablePromises).then(function(result){
			callback(result)
		});
	};

	/**
	 * Get geographic position from canvas coordinates
	 * @param x {number}
	 * @param y {number}
	 * @returns {WorldWind.Position}
	 */
	WorldWindMap.prototype.getPositionFromCanvasCoordinates = function(x, y){
		var currentPoint = this._wwd.pickTerrain(this._wwd.canvasCoordinates(x, y));
		if(!currentPoint.objects.length) {
			// TODO: Build better error mechanism.
			alert('Please click on the area containing the globe.');
			return;
		}
		return currentPoint.objects[0].position;
	};

	/**
	 * TODO temporary solution for zoom to selected from Areas widget
	 * @param bbox {Object}
	 */
	WorldWindMap.prototype.setPositionRangeFromBbox = function(bbox){
		var position = {
			longitude: (bbox.lonMax + bbox.lonMin)/2,
			latitude: (bbox.latMax + bbox.latMin)/2
		};
		this.goTo(position);
		this.setRange(5000);
		// TODO solve range in this way
		// this._wwd.deepPicking = true;
		// var locations = this._wwd.pickTerrain({0:1, 1:1});
		// var locations2 = this._wwd.pickTerrain({0:(this._wwd.viewport.width - 1), 1:(this._wwd.viewport.height-1)});
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