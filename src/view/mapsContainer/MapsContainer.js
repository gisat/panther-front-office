import S from 'string';

import tinysort from 'tinysort';
import _ from 'underscore';

import Actions from '../../actions/Actions';
import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';

import Controls from '../worldWind/controls/Controls';
import Filter from '../../util/Filter';
import WorldWindMap from '../worldWind/WorldWindMap';

import './MapsContainer.css'

/**
 * Class representing container containing maps
 * @param options {Object}
 * @param options.id {string} id of the container
 * @param options.dispatcher {Object} Object for handling events in the application.
 * @param options.target {Object} JQuery selector of target element
 * @param options.store {Object}
 * @param options.store.map {MapStore}
 * @param options.store.scopes {Scopes}
 * @param options.store.state {StateStore}
 * @param options.store.periods {Scopes}
 * @param options.store.locations {Locations}
 * @param options.store.wmsLayers {WmsLayers}
 * @constructor
 */
const MAX_MAPS = 12;
let $ = window.$;
class MapsContainer {
    constructor(options) {
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

        let self = this;
		$(window).resize(function() {
			self.rebuildContainerLayout();
		});

        this._dispatcher.addListener(this.onEvent.bind(this));
        options.store.periods.addListener(this.onEvent.bind(this));
    };

	/**
	 * Add listener to close button of each map except the default one
	 */
	addCloseButtonOnClickListener() {
		let self = this;
		this._containerSelector.on("click", ".close-map-button", function () {
			let mapId = $(this).attr("id");
			if (!mapId){
				 mapId = $(this).parents(".world-wind-map-box").find(".world-wind-map").attr("id");
			}
			let mapPeriod = self._mapStore.getMapById(mapId).period;
			let periods = _.reject(self._stateStore.current().periods, function (period) {
				return period === mapPeriod;
			});
			self._dispatcher.notify("periods#change", periods);
		});
	};

    /**
     * Add map controls
     * @param map {WorldWindMap}
     */
    addControls(map){
        // if there are controls for default map already, attach world window of this map to them
        if (this._mapControls){
            this._mapControls.addWorldWindow(map._wwd);
        } else {
            this._mapControls = this.buildMapControls(map._wwd);
        }
    }

	/**
	 * Add map to container
	 * @param id {string|null} Id of the map
	 * @param periodId {number} Id of the period connected with map
	 * @param options {Object}
	 * @param [options.scenarioKey] {number}
	 * @param [options.scenarioData] {Object}
	 * @param [options.isDefaultScenarioSituation] {bool}
	 */
	addMap(id, periodId, options) {
		var state = this._stateStore.current();

		if ((state.isMapIndependentOfPeriod || state.isMapDependentOnScenario) && state.periods){
			periodId = state.periods[0];
		}

		var worldWindMap = this.buildWorldWindMap(id, periodId, this._mapsToContainerAdded++, options);
		this._dispatcher.notify('map#add', {map: worldWindMap});
		this.addControls(worldWindMap);

		if ((state.isMapIndependentOfPeriod || id === 'default-map') && !state.isMapDependentOnScenario){
			this.handleMapSelection(worldWindMap);
		}
		this.rebuildContainerLayout();
	};

	/**
	 * Add on click listener to all map boxes
	 */
	addMapBoxOnClickListener(){
		var self = this;
		this._containerSelector.on("click", ".world-wind-map-box", function(e){
			if (e.target.className !== "close-map-button" && e.target.className !== "close-map-icon"){
				var state = self._stateStore.current();
				if (state.isMapIndependentOfPeriod  && !state.isMapDependentOnScenario){
					var mapId = $(this).find('.world-wind-map').attr('id');
					var map = self._mapStore.getMapById(mapId);
					self.handleMapSelection(map);
				}
			}
		});
	}

	/**
	 * Rebuild the container when sidebar-reports panel changes it's state
	 */
	addSidebarReportsStateListener() {
		$("#sidebar-reports").on("click", this.rebuildContainerLayout.bind(this));
	};

    /**
     * Build container
     */
    build() {
        this._containerSelector = $("#" + this._id);

        this.addMapBoxOnClickListener();
        this.addCloseButtonOnClickListener();
        this.addSidebarReportsStateListener();
    };

	/**
	 * Build controls and setup interaction
	 * @param wwd {WorldWindow}
	 */
	buildMapControls(wwd) {
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
	 * @param options {Object}
	 * @param [options.scenarioKey] {number}
	 * @param [options.scenarioData] {Object}
	 * @param [options.isDefaultScenarioSituation] {bool}
	 * @returns {WorldWindMap}
	 */
	buildWorldWindMap(id, periodId, orderFromStart, options) {
		return new WorldWindMap({
			dispatcher: window.Stores,
			id: id,
			period: periodId,
			orderFromStart: orderFromStart,
			mapsContainer: this._containerSelector.find(".map-fields"),
			options: options,
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
	changeGeometryInAoiLayer(geometry){
		let maps = this._mapStore.getAll();
		maps.forEach(function(map){
			map.changeGeometryInAoiLayer(geometry);
		});
	}


	/**
	 * Check close button for all maps. If there is only one map present, remove check button. Otherwise add close button to all maps.
	 */
	checkMapsCloseButton() {
		let maps = this._mapStore.getAll();

		if (maps.length === 1){
			maps[0].mapWindowTools.removeCloseButton();
		} else {
			maps.forEach(function(map){
				map.mapWindowTools.addCloseButton();
			});
		}
	}

	addCloseButtonToAllMaps(){
		let maps = this._mapStore.getAll();
		if (maps.length !== 1){
			maps.forEach(function(map){
				map.mapWindowTools.addCloseButton();
			});
		}
	}

	removeCloseButtonToAllMaps(){
		let maps = this._mapStore.getAll();
		if (maps.length !== 1){
			maps.forEach(function(map){
				map.mapWindowTools.removeCloseButton();
			});
		}
	}

	handleMapDefaultsFromDataview(defaults){
		let state = this._stateStore.current();
		if (!state.isMapIndependentOfPeriod && defaults.wmsLayers){
			this._dispatcher.notify("wmsLayer#add", {
				layerKey: defaults.wmsLayers
			});
		}
		if (defaults.layerTemplates){

			// TODO PUCS It is still needed?
			// defaults.layerTemplates.map((layerTemplate) => {
			// 	if (layerTemplate.templateId === 75291 || layerTemplate.templateId === 75292){
			// 		layerTemplate.styles = null;
			// 	}
			// });

			this._dispatcher.notify("infoLayer#add", {
				layerTemplates: defaults.layerTemplates
			});
		}
		if (defaults.activeBackgroundLayerKey){
			this._dispatcher.notify("backgroundLayersPanel#setActiveBackgroundLayer", {
				key: defaults.activeBackgroundLayerKey
			});
		}
		if ((defaults.hasOwnProperty("analyticalUnitsVisible") && defaults.analyticalUnitsVisible) || !defaults.hasOwnProperty("analyticalUnitsVisible")){
			this._dispatcher.notify("auLayersPanel#setAnalyticalUnitsVisible");
		}
	}

	/**
	 * Deal with maps according to dataview settings
	 * @param mapsMetadata {Array} list of maps
	 * @param selectedMap {number} id of selected map
	 */
	handleMapsFromDataview(mapsMetadata, selectedMap){
		let state = this._stateStore.current();
		let self = this;
		if (state.isMapIndependentOfPeriod && !state.isMapDependentOnScenario){
			mapsMetadata.forEach(function(map){
				if (map.key !== 'default-map'){
					self.addMap(map.key, map.period);
				}
				if (map.layerPeriods){
					for (let layer in map.layerPeriods){
						self._dispatcher.notify("layerPeriods#add", {
							mapKey: map.key,
							layerKey: layer,
							period: map.layerPeriods[layer]
						});
					}
				}
				if (map.wmsLayers){
					map.wmsLayers.forEach(function(layer){
						self._dispatcher.notify("wmsLayer#add", {
							mapKey: map.key,
							layerKey: layer
						});
					});
				}
				if (map.placeGeometryChangeReview){
					var showBefore = false;
					var showAfter = false;
					if (map.placeGeometryChangeReview.showGeometryAfter){
						showAfter = true;
					}
					if (map.placeGeometryChangeReview.showGeometryBefore){
						showBefore = true;
					}
					self._dispatcher.notify("placeGeometryChangeReview#showGeometry", {
						mapKey: map.key,
						showBefore: showBefore,
						showAfter: showAfter
					});
				}
				if (map.placeGeometryLPISCheck){
					var geometry = false;
					if (map.placeGeometryLPISCheck.geometry){
						geometry = true;
					}
					
					self._dispatcher.notify("placeGeometryLPISCheck#showGeometry", {
						mapKey: map.key,
						geometry: geometry,
					});
				}

				if (state.scopeFull && state.scopeFull.configuration && state.scopeFull.configuration.lpisCheckReview) {
					self._dispatcher.notify("lpisCheckReview#addLpisLayer");
				}
			});

			if (selectedMap){
				this.handleMapSelection(null, selectedMap);
			}
		}
	}

	/**
	 * If current map is provided, select it.
	 * If selectedId is porvided, select map with this id
	 * Otherwise find out, if any map is selected. If not, select the first one.
	 * @param [currentMap] {WorldWindMap} optional parameter
	 * @param [selectedId] {string} id of map which will be selected
	 */
	handleMapSelection(currentMap, selectedId){
		let allMaps = this._mapStore.getAll();
		if (currentMap){
			allMaps.forEach(function(map){
				map.unselect();
			});
			currentMap.select();
			this._dispatcher.notify('map#selected', {
				id: currentMap._id
			});
		} else if (selectedId) {
			let self = this;
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
			let selected = false;
			allMaps.forEach(function(map){
				if (map._selected){
					selected = true;
				}
			});
			if (!selected){
				let firstMap = allMaps[0];
				firstMap.select();
				this._dispatcher.notify('map#selected', {
					id: firstMap._id
				});
			}
		}
	}

	handleTools(toolsPinned) {
		if (toolsPinned) {
			this._toolsPinned = true;
			this._containerSelector.addClass("tools-active");
		} else {
			this._toolsPinned = false;
			this._containerSelector.removeClass("tools-active");
		}
	};

	/**
	 * Rebuild grid according to a number of active maps
	 */
	rebuildContainerLayout() {
		this._mapsInContainerCount = this._mapStore.getAll().length;
		if (this._mapsInContainerCount >= MAX_MAPS){
			this._dispatcher.notify('mapsContainer#disableAdding');
		} else {
			this._dispatcher.notify('mapsContainer#enableAdding');
		}

		let width = this._containerSelector.width();
		let height = this._containerSelector.height();
		let isExtended = false;
		let oldDromasLpisChangeReviewsScope = false;

		if (this._containerSelector.hasClass('extended')){
			isExtended = true;
		}
		if (this._containerSelector.hasClass('oldDromasLpisChangeReviewsScope')){
			oldDromasLpisChangeReviewsScope = true;
		}

		this._containerSelector.attr('class', 'maps-container');

		let cls = '';

		let x = 0;
		let y = 0;
		if (this._mapsInContainerCount === 1){
			x = 1;
			y = 1;
		} else if (this._mapsInContainerCount === 2){
			x = 2;
			y = 1;
		} else if (this._mapsInContainerCount > 2 && this._mapsInContainerCount <= 4){
			x = 2;
			y = 2;
		} else if (this._mapsInContainerCount > 4 && this._mapsInContainerCount <= 6){
			x = 3;
			y = 2;
		} else if (this._mapsInContainerCount > 6 && this._mapsInContainerCount <= 9){
			x = 3;
			y = 3;
		} else if (this._mapsInContainerCount > 9 && this._mapsInContainerCount <= 12){
			x = 4;
			y = 3;
		} else if (this._mapsInContainerCount > 12 && this._mapsInContainerCount <= 16){
			x = 4;
			y = 4;
		}

		let columns = x;
		let rows = y;
		if (height > width){
			columns = y;
			rows = x;
		}
		cls += 'w' + columns + ' ' + 'h' + rows;
		window.Stores.notify('components#mapsGridChanged', {
			columns: columns,
			rows: rows
		});

		if (this._toolsPinned){
			cls += " tools-active"
		}
		if (isExtended){
			cls += " extended";
			if (oldDromasLpisChangeReviewsScope){
				cls += " oldDromasLpisChangeReviewsScope"
			}
		}
		this._containerSelector.addClass(cls);
		this.sortMaps();
	}

	/**
	 * Rebuild maps container with list of periods. For new periods, add maps. On the other hand, remove maps which
	 * are not connected with any of periods in the list
	 * @param periods {Array} selected periods.
	 */
	rebuildContainerWithPeriods(periods) {
		let allMaps = this._mapStore.getAll();
		let mapsCount = Object.keys(allMaps).length;
		let periodsCount = periods.length;

		let self = this;
		if (mapsCount < periodsCount){
			// go trough periods, check if map exists for period, if not, add map
			periods.forEach(function(period){
				let map = self._mapStore.getMapByPeriod(period);
				if (!map){
					self.addMap(null, period);
				}
			});
		} else if (mapsCount > periodsCount) {
			if (periodsCount === 1){
				let counter = mapsCount;
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
					let period =_.filter(periods, function(per){
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
	 * TODO rebuild each map with relevant data
	 */
	rebuildMaps() {
		let maps = this._mapStore.getAll();
		maps.forEach(function (map) {
			map.rebuild();
		});
		this.rebuildContainerLayout();
	};

	/**
	 * Remove map from container
	 * @param id {string} ID of the map
	 */
	removeMap(id) {
		$("#" + id + "-box").remove();
		this._mapsInContainerCount--;
		this.rebuildContainerLayout();
	};

    /**
     * Remove map from container
     * @param id {string} ID of the map
     */
    removeMapFromContainer(id){
        $("#" + id + "-box").remove();
        this.rebuildContainerLayout();
    }

    /**
     * Set position of all maps in this container
     * @param position {WorldWind.Position}
     */
    setAllMapsPosition(position) {
        let maps = this._mapStore.getAll();
        maps.forEach(function (map) {
            map.goTo(position);
        });
    }

	/**
	 * Set range of all maps in this container
	 * @param range {number}
	 */
	setAllMapsRange(range) {
		let maps = this._mapStore.getAll();
		maps.forEach(function (map) {
			map.setRange(range);
		});
	};

    /**
     * Set a period of all maps. It is used if maps are independent of periods
     * @param periodId {number}
     */
    setPeriodOfAllMaps(periodId) {
        let maps = this._mapStore.getAll();
        maps.forEach(function(map){
            map.setPeriod(periodId);
        });
    }

	getElevationAtLocation(location) {
		let maps = this._mapStore.getAll();
		if(maps.length) {
			return maps[0].getElevationAtLocation(location.latitude, location.longitude);
		}
	}

    /**
     * Set projection of all maps
     * @param targetProjection {string} 2D or 3D
     */
    setProjection(targetProjection) {
        let maps = this._mapStore.getAll();
        for(let key in maps){
            maps[key].setProjection(targetProjection);
        }
    }

    /**
     * Sort maps in container by associated period
     */
    sortMaps(){
        let state = this._stateStore.current();
        if (state.isMapIndependentOfPeriod){
            // TODO sort maps somehow
        } else {
            let containerCls = this._containerSelector.find(".map-fields").attr('class');
            let container = document.getElementsByClassName(containerCls)[0];
            let maps = container.childNodes;
            maps = _.filter(maps, node => {
                return $(node).attr('data-period');
            });
            tinysort(maps, {attr: 'data-period'});
        }
    }

	/**
	 * Switch projection of all maps from 2D to 3D and vice versa
	 */
	switchProjection() {
		let maps = this._mapStore.getAll();
		for (let key in maps) {
			maps[key].switchProjection();
		}
	};

    /**
     * Update navigator of all available maps
     */
    updateAllMapsNavigators(){
        let maps = this._mapStore.getAll();
        maps.forEach(function(map){
            map.setNavigator();
        });
    }

    /**
     * Zoom all maps to area
     * @param bboxes {Array} bboxes of areas
     */
    zoomToArea(bboxes) {
        let maps = this._mapStore.getAll();
        for (let key in maps) {
            maps[key].zoomToArea(bboxes);
        }
    };

    /**
     * Zoom all maps to extent
     */
    zoomToExtent() {
        let maps = this._mapStore.getAll();
        for (let key in maps) {
            maps[key].zoomToExtent();
        }
    };

    /**
     * TODO temporary solution for zoom to selected from Areas widget
     * @param gid {string} gid of selected area
     */
    handleSelection(gid) {
        let self = this;
        new Filter({
            dispatcher: function () {
            }
        }).featureInfo([], gid, this._stateStore.current().periods).then(function (result) {
            if (result && result.length) {
                let extent = result[0].wgsExtent;
                let bbox = {
                    lonMin: extent[0],
                    latMin: extent[1],
                    lonMax: extent[2],
                    latMax: extent[3]
                };
                self.adaptAllMapsToSelection(bbox);
            }
        }).catch(function (err) {
            throw new Error(err);
        });
    };

	adaptAllMapsToSelection(bbox) {
		let maps = this._mapStore.getAll();
		maps.forEach(function (map) {
			map.setPositionRangeFromBbox(bbox);
		});
	};

    /**
     * @param type {string} type of event
     * @param options {Object|string}
     */
    onEvent(type, options){
    	let state, periods, isMapIndependentOfPeriod, isMapDependentOnScenario = null;
    	if (type === Actions.mapRemoved || type === Actions.periodsRebuild || type === Actions.periodsDefault || type === "AOI_GEOMETRY_SET"){
			state = this._stateStore.current();
			periods = state.periods;
			isMapIndependentOfPeriod = state.isMapIndependentOfPeriod;
			isMapDependentOnScenario = state.isMapDependentOnScenario;
		}

		if (type === Actions.mapRemoved){
            this.removeMapFromContainer(options.id);
            this.checkMapsCloseButton();
            if (isMapIndependentOfPeriod  && !isMapDependentOnScenario){
                this.handleMapSelection();
            }
        } else if (type === Actions.periodsRebuild){
            this.rebuildContainerWithPeriods(periods);
            this.checkMapsCloseButton();
        } else if (type === Actions.periodsDefault){
            this.setPeriodOfAllMaps(periods[0]);
            this.checkMapsCloseButton();
        } else if (type === Actions.mapZoomSelected|| type === Actions.mapZoomToLocations){
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
        } else if (type === Actions.scenarioAddDefaultSituationMap){
			this.addMap(null, null, {isDefaultScenarioSituation: true});
			this.checkMapsCloseButton();
		}

        // notifications from React
        else if (type === "AOI_GEOMETRY_SET"){
            if (!(!state.previousAoi && state.changes.dataview) || (state.withoutAoi && state.changes.dataview)){
                this.zoomToArea(options.extent);
            }
            this.changeGeometryInAoiLayer(options.geometry);
        } else if (type === 'ADD_MAP_BY_SCENARIO'){
			this.addMap(null, null, options);
			this.checkMapsCloseButton();
		} else if (type === 'MAP_CLOSE_BUTTON_ADD'){
        	this.addCloseButtonToAllMaps();
		} else if (type === 'MAP_CLOSE_BUTTON_REMOVE'){
			this.removeCloseButtonToAllMaps();
		} else if (type === "ZOOM_MAPS_BY_CASE_GEOMETRY"){
			this._stateStore.addLoadingOperation("scenariosCaseChange");
			let self = this;
			setTimeout(function(){
				if (options && options.bbox){
					self.zoomToArea(options.bbox);
				} else {
					self.zoomToExtent();
				}
				self._stateStore.removeLoadingOperation("scenariosCaseChange", true);
			},50);
		}

        // TODO temporary for Dromas. It should be removed in a version with new areas widget
        else if (type === Actions.mapSelectFromAreas){
            this.handleSelection(options);
        }
    }
}

export default MapsContainer;