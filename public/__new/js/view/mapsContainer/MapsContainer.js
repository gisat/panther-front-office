define([
	'../../actions/Actions',
	'../../error/ArgumentError',
	'../../error/NotFoundError',
	'../../util/Logger',

	'../worldWind/controls/Controls',
	'../../util/Filter',
	'../worldWind/WorldWindMap',

	'string',
	'jquery',
	'text!./MapsContainer.html',
	'tinysort',
	'css!./MapsContainer'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,

			Controls,
			Filter,
			WorldWindMap,

			S,
			$,
			mapsContainer,
			tinysort
){
	/**
	 * Class representing container containing maps
	 * @param options {Object}
	 * @param options.id {string} id of the container
	 * @param options.dispatcher {Object} Object for handling events in the application.
	 * @param options.target {Object} JQuery selector of parent element
	 * @param options.store {Object}
	 * @param options.store.map {MapStore}
	 * @param options.store.scopes {Scopes}
	 * @param options.store.state {StateStore}
	 * @param options.store.periods {Periods}
	 * @param options.store.locations {Locations}
	 * @param options.store.wmsLayers {WmsLayers}
	 * @constructor
	 */
	var MAX_MAPS = 12;

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
        if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MapsContainer', 'constructor', 'Stores must be provided'));
        }
		if (!options.store.map){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MapsContainer", "constructor", "missingMapStore"));
		}
		if (!options.store.scopes){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MapsContainer", "constructor", "missingScopesStore"));
		}
		if (!options.store.state){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MapsContainer", "constructor", "missingStateStore"));
		}
        if (!options.store.periods){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MapsContainer", "constructor", "missingPeriodsStore"));
        }
        if (!options.store.locations){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MapsContainer", "constructor", "missingLocationsStore"));
        }
		if (!options.store.wmsLayers){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MapsContainer", "constructor", "Wms layers Store must be provided"));
		}
		this._target = options.target;
		this._id = options.id;
		this._dispatcher = options.dispatcher;

		this._mapStore = options.store.map;
		this._stateStore = options.store.state;
		this._scopesStore = options.store.scopes;
		this._wmsStore = options.store.wmsLayers;
		this._store = options.store;

		this._mapControls = null;
		this._toolsPinned = false;

		this._mapsInContainerCount = 0;
		this._mapsToContainerAdded = 1;

		this.build();

		this._dispatcher.addListener(this.onEvent.bind(this));
		options.store.periods.addListener(this.onEvent.bind(this));
	};

	/**
	 * Add map controls
	 * @param map {WorldWindMap}
	 */
	MapsContainer.prototype.addControls = function(map){
		// if there are controls for default map already, attach world window of this map to them
		if (this._mapControls){
			this._mapControls.addWorldWindow(map._wwd);
		} else {
			this._mapControls = this.buildMapControls(map._wwd);
		}
	};

	/**
	 * Add map to container
	 * @param id {string|null} Id of the map
	 * @param periodId {number} Id of the period connected with map
	 */
	MapsContainer.prototype.addMap = function (id, periodId) {
		var state = this._stateStore.current();
		if (state.isMapIndependentOfPeriod && state.periods){
			periodId = state.periods[0];
		}
		var worldWindMap = this.buildWorldWindMap(id, periodId, this._mapsToContainerAdded++);
		this._dispatcher.notify('map#add', {map: worldWindMap});
		this.addControls(worldWindMap);

		if (state.isMapIndependentOfPeriod || id === 'default-map'){
			this.handleMapSelection(worldWindMap);
		}
		this.rebuildContainerLayout();
	};

	/**
	 * Add on click listener to all map boxes
	 */
	MapsContainer.prototype.addMapBoxOnClickListener = function(){
		var self = this;
		this._containerSelector.on("click", ".world-wind-map-box", function(){
			var state = self._stateStore.current();
			if (state.isMapIndependentOfPeriod){
				var mapId = $(this).find('.world-wind-map').attr('id');
				var map = self._mapStore.getMapById(mapId);
				self.handleMapSelection(map);
			}
		});
	};

	/**
	 * Rebuild the container when sidebar-reports panel changes it's state
	 */
	MapsContainer.prototype.addSidebarReportsStateListener = function(){
		$("#sidebar-reports-toggle").on("click", this.rebuildContainerLayout.bind(this));
	};

	/**
	 * Build container
	 */
	MapsContainer.prototype.build = function(){
		this._containerSelector = $("#" + this._id);

		this.addSidebarReportsStateListener();
		this.addMapBoxOnClickListener();
	};

	/**
	 * Build controls and setup interaction
	 * @param wwd {WorldWindow}
	 */
	MapsContainer.prototype.buildMapControls = function(wwd){
		return new Controls({
			mapContainer: this._containerSelector.find('.maps-container-top'),
			worldWindow: wwd
		});
	};

	/**
	 * Build a World Wind Map
	 * @param id {string} Id of the map which should distinguish one map from another
	 * @param periodId {number} Id of the period
	 * @param orderFromStart {number} Order of a map from MapsContainer instance initialization
	 * @returns {WorldWindMap}
	 */
	MapsContainer.prototype.buildWorldWindMap = function(id, periodId, orderFromStart){
		return new WorldWindMap({
			dispatcher: window.Stores,
			id: id,
			period: periodId,
			orderFromStart: orderFromStart,
			mapsContainer: this._containerSelector.find(".map-fields"),
			store: {
				scopes: this._scopesStore,
				state: this._stateStore,
				map: this._mapStore,
				periods: this._store.periods,
				locations: this._store.locations
			}
		});
	};

	/**
	 * Change geometry in AOI layer for all maps
	 * @param geometry {GeoJSON}
	 */
	MapsContainer.prototype.changeGeometryInAoiLayer = function(geometry){
		var maps = this._mapStore.getAll();
		maps.forEach(function(map){
			map.changeGeometryInAoiLayer(geometry);
		});
	};

	/**
	 * Check close button for all maps.
	 * If there is only one map present, remove check button.
	 * Otherwise add close button to all maps.
	 */
	MapsContainer.prototype.checkMapsCloseButton = function(){
		var maps = this._mapStore.getAll();

		if (maps.length === 1){
			maps[0].mapWindowTools.removeCloseButton();
		} else {
			maps.forEach(function(map){
				map.mapWindowTools.addCloseButton();
			});
		}
	};

	/**
	 * Deal with maps according to dataview settings
	 * @param mapsMetadata {Array} list of maps
	 * @param selectedMap {number} id of selected map
	 */
	MapsContainer.prototype.handleMapsFromDataview = function(mapsMetadata, selectedMap){
		var state = this._stateStore.current();
		var self = this;
		if (state.isMapIndependentOfPeriod){
			mapsMetadata.forEach(function(map){
				if (map.key !== 'default-map'){
					self.addMap(map.key, map.period);
				}
			});
		}
		if (selectedMap){
			this.handleMapSelection(null, selectedMap)
		}
	};

	/**
	 * Adjust container size when Map tools widget is pinned
	 * @param toolsPinned {boolean}
	 */
	MapsContainer.prototype.handleTools = function (toolsPinned) {
		if (toolsPinned){
			this._toolsPinned = true;
			this._containerSelector.addClass("tools-active");
		} else {
			this._toolsPinned = false;
			this._containerSelector.removeClass("tools-active");
		}
	};

	/**
	 * Rebuild container grid according to a number of active maps.
	 * If any widget is pinned, adjust the grid as well.
	 */
	MapsContainer.prototype.rebuildContainerLayout = function(){
		this._mapsInContainerCount = this._mapStore.getAll().length;
		if (this._mapsInContainerCount >= MAX_MAPS){
			this._dispatcher.notify('mapsContainer#disableAdding');
		} else {
			this._dispatcher.notify('mapsContainer#enableAdding');
		}

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
		if (this._mapsInContainerCount === 1){
			cls += a + '1 ' + b + '1';
		} else if (this._mapsInContainerCount === 2){
			cls += a + '2 ' + b + '1';
		} else if (this._mapsInContainerCount > 2 && this._mapsInContainerCount <= 4){
			cls += a + '2 ' + b + '2';
		} else if (this._mapsInContainerCount > 4 && this._mapsInContainerCount <= 6){
			cls += a + '3 ' + b + '2';
		} else if (this._mapsInContainerCount > 6 && this._mapsInContainerCount <= 9){
			cls += a + '3 ' + b + '3';
		} else if (this._mapsInContainerCount > 9 && this._mapsInContainerCount <= 12){
			cls += a + '4 ' + b + '3';
		} else if (this._mapsInContainerCount > 12 && this._mapsInContainerCount <= 16){
			cls += a + '4 ' + b + '4';
		}

		if (this._toolsPinned){
			cls += " tools-active"
		}
		this._containerSelector.addClass(cls);
		this.sortMaps();
	};

	/**
	 * If maps depends of periods, rebuild maps container with list of periods.
	 * For new periods, add maps. On the other hand, remove maps which are not connected with any of periods in the list.
	 * @param periods {Array} selected periods.
	 */
	MapsContainer.prototype.rebuildContainerWithPeriods = function(periods){
		var allMaps = this._mapStore.getAll();
		var mapsCount = Object.keys(allMaps).length;
		var periodsCount = periods.length;

		var self = this;
		if (mapsCount < periodsCount){
			// go trough periods, check if map exists for period, if not, add map
			periods.forEach(function(period){
				var map = self._mapStore.getMapByPeriod(period);
				if (!map){
					self.addMap(null, period);
				}
			});
		} else if (mapsCount > periodsCount) {
			if (periodsCount === 1){
				var counter = mapsCount;
				allMaps.forEach(function(map){
					counter--;
					if (counter > 0){
						map._wwd.drawContext.currentGlContext.getExtension('WEBGL_lose_context').loseContext();
						self._dispatcher.notify("map#remove",{id: map.id});
					} else {
						map.rebuild();
					}
				});
			} else {
				// go trough maps, check if period exists for map, if not, remove map
				allMaps.forEach(function(map){
					var period =_.filter(periods, function(per){
						return per === map.period;
					});
					if (period.length === 0){
						map._wwd.drawContext.currentGlContext.getExtension('WEBGL_lose_context').loseContext();
						self._dispatcher.notify("map#remove",{id: map.id});
					}
				});

				// remove duplicates
			}
		}
	};

	/**
	 * Rebuild all maps in container
	 */
	MapsContainer.prototype.rebuildMaps = function(){
		var maps = this._mapStore.getAll();
		maps.forEach(function(map){
			map.rebuild();
		});
		this.rebuildContainerLayout();
	};

	/**
	 * Remove map from container
	 * @param id {string} ID of the map
	 */
	MapsContainer.prototype.removeMapFromContainer = function(id){
		$("#" + id + "-box").remove();
		this.rebuildContainerLayout();
	};

	/**
	 * If current map is provided, select it.
	 * If selectedId is porvided, select map with this id
	 * Otherwise find out, if any map is selected. If not, select the first one.
	 * @param [currentMap] {WorldWindMap} optional parameter
	 * @param [selectedId] {string} id of map which will be selected
	 */
	MapsContainer.prototype.handleMapSelection = function(currentMap, selectedId){
		var allMaps = this._mapStore.getAll();
		if (currentMap){
			allMaps.forEach(function(map){
				map.unselect();
			});
			currentMap.select();
			this._dispatcher.notify('map#selected', {
				id: currentMap._id
			});
		} else if (selectedId) {
			var self = this;
			allMaps.forEach(function(map){
				map.unselect();
				if (map._id === selectedId){
					map.select();
					self._dispatcher.notify('map#selected', {
						id: selectedId
					});
				}
			});
		} else {
			var selected = false;
			allMaps.forEach(function(map){
				if (map._selected){
					selected = true;
				}
			});
			if (!selected){
				var firstMap = allMaps[0];
				firstMap.select();
				this._dispatcher.notify('map#selected', {
					id: firstMap._id
				});
			}
		}
	};

	/**
	 * Set position of all maps in this container
	 * @param position {WorldWind.Position}
	 */
	MapsContainer.prototype.setAllMapsPosition = function(position){
		var maps = this._mapStore.getAll();
		maps.forEach(function(map){
			map.goTo(position);
		});
	};

	/**
	 * Set range of all maps in this container
	 * @param range {number}
	 */
	MapsContainer.prototype.setAllMapsRange = function(range){
		var maps = this._mapStore.getAll();
		maps.forEach(function(map){
			map.setRange(range);
		});
	};

	/**
	 * Set a period of all maps. It is used if maps are independent of periods
	 * @param periodId {number}
	 */
	MapsContainer.prototype.setPeriodOfAllMaps = function (periodId) {
		var maps = this._mapStore.getAll();
		maps.forEach(function(map){
			map.setPeriod(periodId);
		});
	};

	/**
	 * Set projection of all maps
	 * @param targetProjection {string} 2D or 3D
	 */
	MapsContainer.prototype.setProjection = function (targetProjection) {
		var maps = this._mapStore.getAll();
		for(var key in maps){
			maps[key].setProjection(targetProjection);
		}
	};

	/**
	 * Sort maps in container by associated period
	 */
	MapsContainer.prototype.sortMaps = function(){
		var state = this._stateStore.current();
		if (state.isMapIndependentOfPeriod){
			// TODO sort maps somehow
		} else {
			var containerCls = this._containerSelector.find(".map-fields").attr('class');
			var container = document.getElementsByClassName(containerCls)[0];
			var maps = container.childNodes;
			tinysort(maps, {attr: 'data-period'});
		}
	};

	/**
	 * Update navigator of all available maps
	 */
	MapsContainer.prototype.updateAllMapsNavigators = function(){
		var maps = this._mapStore.getAll();
		maps.forEach(function(map){
			map.setNavigator();
		});
	};

	/**
	 * Zoom all maps to area
	 * @param bboxes {Array} bboxes of areas
	 */
	MapsContainer.prototype.zoomToArea = function(bboxes){
		var maps = this._mapStore.getAll();
		for(var key in maps){
			maps[key].zoomToArea(bboxes);
		}
	};

	/**
	 * Zoom all maps to extent
	 */
	MapsContainer.prototype.zoomToExtent = function(){
		var maps = this._mapStore.getAll();
		for(var key in maps){
			maps[key].zoomToExtent();
		}
	};

	// TODO temporary methods ----------------------------------------------------
	/**
	 * TODO temporary solution for zoom to selected from Areas widget.
	 * TODO Should be removed in a version with new areas widget.
	 * @param gid {string} gid of selected area
	 */
	MapsContainer.prototype.handleSelection = function(gid){
		var self = this;
		new Filter({
			dispatcher: function(){}
		}).featureInfo([], gid, this._stateStore.current().periods).then(function(result){
			if (result && result.length){
				var extent = result[0].wgsExtent;
				var bbox = {
					lonMin: extent[0],
					latMin: extent[1],
					lonMax: extent[2],
					latMax: extent[3]
				};
				self.adaptAllMapsToSelection(bbox);
			}
		}).catch(function(err){
			throw new Error(err);
		});
	};

	/**
	 * TODO temporary solution for zoom to selected from Areas widget.
	 * TODO Should be removed in a version with new areas widget.
	 * @param bbox
	 */
	MapsContainer.prototype.adaptAllMapsToSelection = function(bbox){
		var maps = this._mapStore.getAll();
		maps.forEach(function(map){
			map.setPositionRangeFromBbox(bbox);
		});
	};

	/**
	 * @param type {string} type of event
	 * @param options {Object|string}
	 */
	MapsContainer.prototype.onEvent = function(type, options){
		var state = this._stateStore.current();
		var periods = state.periods;
		var isMapIndependentOfPeriod = state.isMapIndependentOfPeriod;
		if (type === Actions.mapRemoved){
			this.removeMapFromContainer(options.id);
			this.checkMapsCloseButton();
			if (isMapIndependentOfPeriod){
				this.handleMapSelection();
			}
		} else if (type === Actions.periodsRebuild){
			this.rebuildContainerWithPeriods(periods);
			this.checkMapsCloseButton();
		} else if (type === Actions.periodsDefault){
			this.setPeriodOfAllMaps(periods[0]);
			this.checkMapsCloseButton();
		} else if (type === Actions.mapZoomSelected){
			this.zoomToArea(options);
		} else if (type === Actions.mapZoomToExtent){
			this.zoomToExtent();
		} else if (type === Actions.mapsContainerAddMap){
			this.addMap();
			this.checkMapsCloseButton();
		} else if (type === Actions.mapsContainerToolsPinned){
			this.handleTools(true);
		} else if (type === Actions.mapsContainerToolsDetached){
			this.handleTools(false);
		} else if (type === Actions.mapSwitchTo2D){
			this.setProjection('2D');
		} else if (type === Actions.mapSwitchTo3D){
			this.setProjection('3D');
		} else if (type === Actions.navigatorUpdate){
			this.updateAllMapsNavigators();
		}

		// notifications from React
		else if (type === "AOI_GEOMETRY_SET"){
			this.zoomToArea(options.extent);
			this.changeGeometryInAoiLayer(options.geometry);
		}

		// TODO temporary for Dromas. It should be removed in a version with new areas widget
		else if (type === Actions.mapSelectFromAreas){
			this.handleSelection(options);
		}
	};

	return MapsContainer;
});