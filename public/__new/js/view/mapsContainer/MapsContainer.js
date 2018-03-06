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
	 * @param options.store.state {StateStore}
	 * @param options.store.periods {Periods}
	 * @param options.store.locations {Locations}
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
        if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MapsContainer', 'constructor', 'Stores must be provided'));
        }
		if (!options.store.map){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MapsContainer", "constructor", "missingMapStore"));
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
		this._target = options.target;
		this._id = options.id;
		this._dispatcher = options.dispatcher;

		this._mapStore = options.store.map;
		this._stateStore = options.store.state;
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
	 * Rebuild maps container with list of periods. For new periods, add maps. On the other hand, remove maps which
	 * are not connected with any of periods in the list
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

					// TODO solve default maps problem
					if (map.id !== "default-map"){
						counter--;
						if (counter > 0){
							map._wwd.drawContext.currentGlContext.getExtension('WEBGL_lose_context').loseContext();
							self._dispatcher.notify("map#remove",{id: map.id});
						} else {
							map._id = "default-map";
							map.rebuild();
						}
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
			}
		}
	};

	/**
	 * Add map to container
	 * @param id {string|null} Id of the map
	 * @param periodId {number} Id of the period connected with map
	 */
	MapsContainer.prototype.addMap = function (id, periodId) {
		var worldWindMap = this.buildWorldWindMap(id, periodId, this._mapsToContainerAdded++);
		this._dispatcher.notify('map#add', {map: worldWindMap});
		this.addControls(worldWindMap);
		this.rebuildContainerLayout();
	};

	/**
	 * Remove map from container
	 * TODO clearly distinguish this method and removeMapFromContainer (or perhaps mapIsUpToRemove?)
	 * @param id {string} ID of the map
	 */
	MapsContainer.prototype.removeMap = function(id){
		$("#" + id + "-box").remove();
		this.rebuildContainerLayout();
	};

	/**
	 * Add listener to close button of each map
	 * TODO this should be independent of period
	 * TODO Something like creation of removeMapFromContainer
	 */
	MapsContainer.prototype.addCloseButtonOnClickListener = function(){
		var self = this;
		this._containerSelector.on("click", ".close-map-button", function(){
			var mapId = $(this).attr("data-id");
			var mapPeriod = self._mapStore.getMapById(mapId).period;
			var periods = _.reject(self._stateStore.current().periods, function(period) { return period === mapPeriod; });
			self._dispatcher.notify("periods#change", periods);
		});
	};

	// TODO reviewed methods --------------------------------------------------------------------------------------------

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
	 * Rebuild the container when sidebar-reports panel changes it's state
	 */
	MapsContainer.prototype.addSidebarReportsStateListener = function(){
		$("#sidebar-reports-toggle").on("click", this.rebuildContainerLayout.bind(this));
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
		this.addSidebarReportsStateListener();
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
				state: this._stateStore,
				map: this._mapStore,
				periods: this._store.periods,
				locations: this._store.locations
			}
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
			maps[0].removeCloseButton();
		} else {
			maps.forEach(function(map){
				map.addCloseButton();
			});
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
		if (type === Actions.mapRemove){
			this.removeMap(options.id);
		} else if (type === Actions.periodsRebuild){
			var periods = this._stateStore.current().periods;
			this.rebuildContainerWithPeriods(periods);
			this.checkMapsCloseButton();
		} else if (type === Actions.mapZoomSelected){
			this.zoomToArea(options);
		} else if (type === Actions.mapZoomToExtent){
			this.zoomToExtent();
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

		// TODO temporary for Dromas. It should be removed in a version with new areas widget
		else if (type === Actions.mapSelectFromAreas){
			this.handleSelection(options);
		}
	};

	return MapsContainer;
});