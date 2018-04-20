define(['../../actions/Actions',
		'../../error/ArgumentError',
		'../../error/NotFoundError',
		'../../util/Logger',

		'../../util/dataMining',
		'./layers/Layers',
		'./MapWindowTools/MapWindowTools',
		'../../worldwind/MyGoToAnimator',
		'./geometries/MultiPolygon',
		'../../worldwind/layers/osm3D/OSMTBuildingLayer',
		'../../worldwind/SelectionController',
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

			DataMining,
			Layers,
			MapWindowTools,
			MyGoToAnimator,
			MultiPolygon,
			OSMTBuildingLayer,
			SelectionController,
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
	 * @param options.orderFromStart {number} Order of a map from MapsContainer instance initialization
	 * @param options.period {Number|null} Period associated with this map.
	 * @param options.dispatcher {Object} Object for handling events in the application.
	 * @param options.store {Object}
	 * @param options.store.state {StateStore}
	 * @param options.store.scopes {Scopes}
	 * @param options.store.map {MapStore}
	 * @param options.store.periods {Periods}
	 * @param options.store.locations {Locations}
	 * @constructor
	 */
	var WorldWindMap = function(options){
		if (!options.mapsContainer){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindMap", "constructor", "missingMapsContainer"));
		}
        if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WorldWindMap', 'constructor', 'Stores must be provided'));
        }
        if(!options.store.locations){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WorldWindMap', 'constructor', 'Stores locations must be provided'));
        }
		if (!options.store.scopes){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindMap", "constructor", "missingScopesStore"));
		}
        if(!options.store.state){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WorldWindMap', 'constructor', 'Stores state must be provided'));
        }
        if(!options.store.map){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WorldWindMap', 'constructor', 'Stores map must be provided'));
        }
        if(!options.store.periods){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WorldWindMap', 'constructor', 'Stores periods must be provided'));
        }


		this._mapsContainerSelector = options.mapsContainer;

		this._store = options.store;
		this._scopesStore = options.store.scopes;
		this._stateStore = options.store.state;
		this._mapStore = options.store.map;
		this._periodsStore = options.store.periods;

		this._dataMining = new DataMining({
            store: {
                state: options.store.state
            }
		});

		this._dispatcher = options.dispatcher;
		this._id = options.id || new Uuid().generate();
		this._mapSelector = $("#" + this._id);

		this._name = "Map " + options.orderFromStart;
		this._selected = false;
		this._aoiLayer = null;
		this._placeLayer = null;

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

		name: {
			get: function() {
				return this._name;
			},
			set: function(name) {
				this._name = name;
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
	 * It returns promise which in the end returns URL to be sent to the server. This URL is BASE64 encoded state of the
	 * WWW.
	 * @return {Promise<any>}
	 */
	WorldWindMap.prototype.snapshot = function() {
		var index;
		var self = this;
		return new Promise(function(resolve){
			// TODO: There might happen possible concurrency problem.
			index = self._wwd._redrawCallbacks.length;
			self._wwd._redrawCallbacks.push(function(worldwind, stage) {
				if(stage === WorldWind.AFTER_REDRAW) {
					resolve(document.getElementById(self._id + '-canvas').toDataURL());
				}
			});
		}).then(function(url){
			self._wwd._redrawCallbacks.splice(index, 1);

			return url;
		});
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
	 * Add listener for drag and drop files
	 */
	WorldWindMap.prototype.addDropListener = function(){
		$('body').off('drop').on('drop', function(e){
			e.preventDefault();
			if(e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files.length > 0) {
				var files = e.originalEvent.dataTransfer.files;
				this.addFiles(files);
			}

			if(!e.originalEvent.dataTransfer.files || e.originalEvent.dataTransfer.files.length === 0) {
				var url = e.originalEvent.dataTransfer.getData("URL");
				this.addUrl(url);
			}

			return false;
		}.bind(this));
	};

	WorldWindMap.prototype.addUrl = function(url) {
		if(url.endsWith('.geojson') || url.endsWith('.json')) {
			this.addGeoJson(url);
		} else if(url.endsWith('.tif') || url.endsWith('.tiff')) {
			this.addGeoTiff(url);
		} else if(url.endsWith('.kml')) {
			this.addKML(url);
		}
	};

	WorldWindMap.prototype.addFiles = function(files) {
		var reader = new FileReader();
		var self = this;

		for(var i=0;i<files.length;i++) {
			if(files[i].type === 'application/vnd.google-earth.kml+xml') {
				reader.onload = (function() {
					//console.log(this.result);
					self.addKML(this.result);
				});
				reader.readAsDataURL(files[i]);
			}

			if(files[i].type === 'image/tiff') {
				reader.onload = (function() {
					//console.log(this.result);
					self.addGeoTiff(this.result);
				});
				reader.readAsDataURL(files[i]);
			}

			if(files[i].name.endsWith('.geojson')) {
				reader.onload = (function() {
					//console.log(this.result);
					self.addGeoJson(this.result);
				});
				reader.readAsDataURL(files[i]);
			}
		}
	};

	WorldWindMap.prototype.addGeoJson = function(url) {
		var renderableLayer = new WorldWind.RenderableLayer("GeoJSON");
		this._wwd.addLayer(renderableLayer);
		var geoJson = new WorldWind.GeoJSONParser(url);
		geoJson.load(null, null, renderableLayer);
		this._wwd.redraw();
	};

	WorldWindMap.prototype.addGeoTiff = function(url) {
		var geotiffObject = new WorldWind.GeoTiffReader(url);
		var self = this;

		geotiffObject.readAsImage(function (canvas) {
			var surfaceGeoTiff = new WorldWind.SurfaceImage(
				geotiffObject.metadata.bbox,
				new WorldWind.ImageSource(canvas)
			);

			var geotiffLayer = new WorldWind.RenderableLayer("GeoTiff");
			geotiffLayer.addRenderable(surfaceGeoTiff);
			self._wwd.addLayer(geotiffLayer);
			self._wwd.redraw();
		});
	};

	WorldWindMap.prototype.addKML = function(url) {
		var self = this;
		var kmlFilePromise = new WorldWind.KmlFile(url, []);
		kmlFilePromise.then(function (kmlFile) {
			var renderableLayer = new WorldWind.RenderableLayer("Surface Shapes");
			renderableLayer.addRenderable(kmlFile);

			self._wwd.addLayer(renderableLayer);
			self._wwd.redraw();
		});
	};

	WorldWindMap.prototype.addGeometryToPlaceLayer = function(geometry){
		if (!this._placeLayer){
			this._placeLayer = new WorldWind.RenderableLayer('place-layer');
			this._placeLayer.metadata = {
				group: "place-layer"
			};
			this._wwd.addLayer(this._placeLayer);
		}
		var renderables = new MultiPolygon({geometry: geometry.geometry, key: geometry.key, switchedCoordinates: true}).render();
		this._placeLayer.addRenderables(renderables);
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
	 * Add listeners to map, which listen any move or zoom of the map
	 */
	WorldWindMap.prototype.addMapControlListeners = function(){
		this._wwd.addEventListener("mousemove", this.updateNavigatorState.bind(this));
		this._wwd.addEventListener("wheel", this.updateNavigatorState.bind(this));
	};

	/**
	 * Add callback for snapshots
	 */
	WorldWindMap.prototype.addSnapshotCallback = function(){
		var self = this;
		this._wwd._redrawCallbacks.push(function(){
			if (self._snapshotTimeout){
				clearTimeout(self._snapshotTimeout);
			}
			self._snapshotTimeout = setTimeout(function(){
				var input = document.getElementById('top-toolbar-snapshot');
				$(input).attr('data-url', document.getElementById(self._id + '-canvas').toDataURL());
			},1000);
		});
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

		this.mapWindowTools = this.buildMapWindowTools();
		this.setupWebWorldWind();
		this.addDropListener();
		this.handleScopeSettings();

		if (this._id !== 'default-map'){
			this.mapWindowTools.addMapLabel(this._period);
		}
	};

	/**
	 * It builds an instance of MyGoToAnimator
	 * @returns {MyGoToAnimator}
	 */
	WorldWindMap.prototype.buildGoToAnimator = function(){
		return new MyGoToAnimator(this._wwd, {
			store: {
				locations: this._store.locations,
				state: this._store.state
			},
			dispatcher: this._dispatcher
		});
	};

	/**
	 * @returns {MapWindowTools}
	 */
	WorldWindMap.prototype.buildMapWindowTools = function(){
		return new MapWindowTools({
			dispatcher: this._dispatcher,
			mapId: this._id,
			mapName: this._name,
			store: {
				map: this._store.map,
				periods: this._periodsStore,
				scopes: this._scopesStore,
				state: this._stateStore
			},
			targetContainer: this._mapBoxSelector
		});
	};

	/**
	 * It builds an instance of Layers for this map
	 * @returns {Layers}
	 */
	WorldWindMap.prototype.buildLayers = function(){
		return new Layers(this._wwd, {
			selectController: this.selectionController
		});
	};

	/**
	 * It builds an instance of SelectionController
	 * @returns {SelectionController}
	 */
	WorldWindMap.prototype.buildSelectionController = function(){
		return new SelectionController(this._wwd);
	};

	/**
	 * Build the World Wind Window
	 * @returns {WorldWind.WorldWindow}
	 */
	WorldWindMap.prototype.buildWorldWindow = function(){
		return new WorldWind.WorldWindow(this._id + "-canvas");
	};

	/**
	 * Change geometry in AOI Layer, if layer exists
	 * @param geometry {GeoJSON}
	 * @param geometry.coordintes {Array}
	 * @param geometry.type {string}
	 */
	WorldWindMap.prototype.changeGeometryInAoiLayer = function(geometry){
		if (this._aoiLayer){
			this._aoiLayer.removeAllRenderables();
			var renderables = new MultiPolygon({geometry: geometry, switchedCoordinates: true}).render();

			this._aoiLayer.addRenderables(renderables);
			this._wwd.redraw();
		}
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
	 * It returns container for rendering of Web World Wind
	 * @returns {Object} JQuery selector
	 */
	WorldWindMap.prototype.getContainer = function(){
		return this._mapBoxSelector;
	};

	/**
	 * Go to specific position in map
	 * @param position {Position}
	 */
	WorldWindMap.prototype.goTo = function(position) {
		this._wwd.navigator.lookAtLocation = position;
		this._wwd.redraw();
		this._wwd.redrawIfNeeded(); // TODO: Check with new releases. This isn't part of the public API and therefore might change.
	};

	/**
	 * Handle AOI Layer. If exists
	 */
	WorldWindMap.prototype.handleAoiLayer = function(layerData){
		if (layerData.layer){
			this._aoiLayer = layerData.layer;
		} else {
			this._aoiLayer = new WorldWind.RenderableLayer('aoi-layer');
			this._dispatcher.notify('scope#aoiLayerUpdate', this._aoiLayer);
		}
		this._aoiLayer.metadata = {
			group: "aoi-layer"
		};
		this._wwd.addLayer(this._aoiLayer);
		this.redraw();
	};

	/**
	 * Handle settings for current scope
	 */
	WorldWindMap.prototype.handleScopeSettings = function(){
		let state = this._stateStore.current();
		if (state.aoiLayer){
			this.handleAoiLayer(state.aoiLayer);
		}
	};

	/**
	 * Rebuild map
	 */
	WorldWindMap.prototype.rebuild = function(){
		this._stateStore.removeLoadingOperation("initialLoading");
		var state = this._stateStore.current();
		var changes = state.changes;

		if (changes.scope || changes.location || _.isEmpty(changes)){
			this._stateStore.removeLoadingOperation("appRendering");
		}

		/**
		 * Set location if location or scope has been changed, but dataview
		 */
		if ((changes.scope || changes.location) && !changes.dataview){
			this._stateStore.addLoadingOperation("ScopeLocationChanged");
			this._goToAnimator.setLocation();
		}

		var maps = this._mapStore.getAll();
		if (this._id === "default-map" || maps.length === 1){
			this._stateStore.addLoadingOperation("DefaultMap");
			this.updateNavigatorState();
			var periods = state.periods;
			if (periods.length === 1 || !this._period){
				this._period = periods[0];
				this._dispatcher.notify('periods#initial', periods);
			}
			this.mapWindowTools.addMapLabel(this._period);
			if (!state.isMapIndependentOfPeriod){
				this.unselect();
				this._dispatcher.notify('map#defaultMapUnselected');
			}
			if (!this._aoiLayer){
				this.handleScopeSettings();
			}
		}
	};

	/**
	 * Redraw the map
	 */
	WorldWindMap.prototype.redraw = function(){
		this._wwd.redraw();
	};

	WorldWindMap.prototype.removeAllGeometriesFromPlaceLayer = function () {
		var self = this;
		if (this._placeLayer && this._placeLayer.renderables){
			this._placeLayer.removeAllRenderables();
			this.redraw();
		}
	};

	WorldWindMap.prototype.removeGeometryFromPlaceLayer = function (geometryKey) {
		var self = this;
		if (this._placeLayer && geometryKey){
			var renderables = _.filter(this._placeLayer.renderables, function (rend){
				return rend.key === geometryKey});
			if (renderables && renderables.length){
				renderables.forEach(function(renderable){
					self._placeLayer.removeRenderable(renderable);
				});
			}
			this.redraw();
		}
	};

	/**
	 * Remove layer from map
	 * @param layer {Layer}
	 */
	WorldWindMap.prototype.removeLayer = function(layer) {
		this._wwd.removeLayer(layer);
	};

	/**
	 * Select map
	 */
	WorldWindMap.prototype.select = function(){
		this._selected = true;
		this._mapBoxSelector.addClass('selected');
	};

	/**
	 * Get navigator state from store and set this map navigator's parameters.
	 */
	WorldWindMap.prototype.setNavigator = function(){
		var navigatorState = this._stateStore.getNavigatorState();

		if (navigatorState){
			this._wwd.navigator.heading = navigatorState.heading;
			this._wwd.navigator.lookAtLocation = navigatorState.lookAtLocation;
			this._wwd.navigator.range = navigatorState.range;
			this._wwd.navigator.roll = navigatorState.roll;
			this._wwd.navigator.tilt = navigatorState.tilt;

			this._goToAnimator.checkRange(navigatorState.range);
			this.redraw();
		}
	};

	/**
	 * Set map period
	 * @param period {number}
	 */
	WorldWindMap.prototype.setPeriod = function(period){
		this._period = period;
	};

	/**
	 * Set projection of current map
	 * @param projection {string} 2D or 3D
	 */
	WorldWindMap.prototype.setProjection = function(projection){
		if (projection === '2D'){
			this._wwd.globe = new WorldWind.Globe2D();
			this._wwd.globe.projection = new WorldWind.ProjectionMercator();
		} else if (projection === '3D'){
			this._wwd.globe = new WorldWind.Globe(new WorldWind.EarthElevationModel());
		}
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
	 * Set up Web World Wind
	 */
	WorldWindMap.prototype.setupWebWorldWind = function(){
		this._wwd = this.buildWorldWindow();

		if (!this._stateStore.current().isMap3D){
			this.setProjection('2D');
		}

		this._goToAnimator = this.buildGoToAnimator();
		this.selectionController = this.buildSelectionController();
		this.layers = this.buildLayers();

		this.addMapControlListeners();
		this.setNavigator();
	};

	/**
	 * Update state of the navigator in MapStore.
	 * It is used for contolling of multiple maps at the same time.
	 */
	WorldWindMap.prototype.updateNavigatorState = function(){
		this._dispatcher.notify('map#control', this._wwd.navigator);
	};

	/**
	 * Unselect map
	 */
	WorldWindMap.prototype.unselect = function(){
		this._selected = false;
		this._mapBoxSelector.removeClass('selected');
	};

	/**
	 * Zoom map to given area
	 * @param bboxes {Array} list of bboxes of areas
	 */
	WorldWindMap.prototype.zoomToArea = function (bboxes) {
		this._goToAnimator.zoomToArea(bboxes);
		this.redraw();
	};

	/**
	 * Zoom map to extent (place or all places)
	 */
	WorldWindMap.prototype.zoomToExtent = function () {
		this._goToAnimator.setLocation();
		this.redraw();
	};

	// TODO review following methods ------------------------------------------
	/**
	 * Execute on map click. Find out a location of click target in lat, lon. And execute getFeatureInfo query for this location.
	 * TODO better name of this method
	 * @param callback {function} on click callback
	 * @param property {string} property for to find via getFeatureInfo
	 * @param event {Object}
	 */
	WorldWindMap.prototype.onMapClick = function(callback, property, event){
		var self = this;
		var gid = null;
		var coordinates = null;
		var auLayer = this.layers.getAuLayer()[0];
		var auBaseLayers = this._dataMining.getAuBaseLayers(this._period);

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

	// todo comments
	WorldWindMap.prototype.getLayersInfo = function(callback, event) {
		var x = event.x,
			y = event.y;
		var position = this.getPositionFromCanvasCoordinates(x,y);

		var tablePromises = event.worldWindow.layers.map(function(layer){
			if(!layer || !layer.metadata || !layer.metadata.group ||
				layer.metadata.group === 'areaoutlines' ||
				layer.metadata.group === 'background-layers' ||
				layer.metadata.group === 'place-layer') {
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
				srs: crs,
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

	// TODO temporary methods -------------------------------------------------

	/**
	 * TODO temporary solution for zoom to selected from Areas widget. It is used in DROMAS project.
	 * TODO It sholud be removed when new Areas widget will be implemented.
	 * @param bbox {Object}
	 */
	WorldWindMap.prototype.setPositionRangeFromBbox = function(bbox){
		var position = {
			longitude: (bbox.lonMax + bbox.lonMin)/2,
			latitude: (bbox.latMax + bbox.latMin)/2
		};
		this.goTo(position);
		this.setRange(5000);
	};

	/**
	 * @param type {string} type of event
	 * @param options {Object}
	 */
	WorldWindMap.prototype.onEvent = function(type, options){
		if (type === Actions.mapControl) {
			this._stateStore.removeLoadingOperation("DefaultMap");
		}
	};

	return WorldWindMap;
});