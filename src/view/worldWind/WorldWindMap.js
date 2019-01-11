import _ from 'lodash';
import S from 'string';

import WorldWind from '@nasaworldwind/worldwind';

import Actions from '../../actions/Actions';
import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';

import DataMining from '../../util/dataMining';
import Layers from './layers/Layers';
import MapWindowTools from './MapWindowTools/MapWindowTools';
import MultiPolygon from './geometries/MultiPolygon';
import MyGoToAnimator from '../../worldwind/MyGoToAnimator';
import SelectionController from '../../worldwind/SelectionController';
import VisibleLayersStore from '../../stores/internal/VisibleLayersStore';
import Uuid from '../../util/Uuid';
import WmsFeatureInfo from '../../worldwind/WmsFeatureInfo';

import './WorldWindMap.css';

let polyglot = window.polyglot;

/**
 * Class World Wind Map
 * @param options {Object}
 * @param options.id {String|null} Id distinguishing the map from the other ones.
 * @param options.mapsContainer {Object} JQuery selector of target element
 * @param options.orderFromStart {number} Order of a map from MapsContainer instance initialization
 * @param options.period {Number|null} Period associated with this map.
 * @param options.dispatcher {Object} Object for handling events in the application.
 * @param [options.options] {Object}
 * @param options.store {Object}
 * @param options.store.state {StateStore}
 * @param options.store.scopes {Scopes}
 * @param options.store.map {MapStore}
 * @param options.store.periods {Scopes}
 * @param options.store.locations {Locations}
 * @constructor
 */
let $ = window.$;
class WorldWindMap {
    constructor(options) {
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

		if (options.options){
			let m = options.options;
			if (m.scenarioKey){
				this.scenarioKey = m.scenarioKey;
			}
			if (m.scenarioData){
				this._name = m.scenarioData.name;
			}
			if (m.isDefaultScenarioSituation){
				this.isDefaultScenarioSituation = m.isDefaultScenarioSituation;
				this._name = polyglot.t('defaultState');
			}
		}

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
         * @type {VisibleLayersStore}
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

    get id() {
        return this._id
    }

    get period() {
        return this._period
    }

    set period(period) {
        this._period = period;
    }

    get selectedLayers() {
        return this._selectedLayers;
    }

    get name() {
        return this._name;
    }
    set name(name) {
        this._name = name;
    }

	/**
	 * Add on click recognizer
	 * @param callback {function} on click callback
	 * @param property {string} property for to find via getFeatureInfo
	 */
	addClickRecognizer(callback, property) {
		if (!this._clickRecognizer) {
			this._clickRecognizer = new WorldWind.ClickRecognizer(this._wwd.canvas, this.onMapClick.bind(this, callback, property));
		}
		this._clickRecognizer.enabled = true;
	};

	/**
	 * Add close button to this map
	 */
	addCloseButton() {
		let closeButton = this._mapBoxSelector.find(".close-map-button");
		if (closeButton.length === 0) {
			let html = '<div title="Remove map" class="close-map-button" data-id="' + this._id + '"><i class="close-map-icon">&#x2715;</i></div>';
			this._mapBoxSelector.find(".map-window-tools").append(html);
		}
	};

	/**
	 * Add listener for drag and drop files
	 */
	addDropListener(){
		$('body').off('drop').on('drop', function(e){
			e.preventDefault();
			if(e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files.length > 0) {
				let files = e.originalEvent.dataTransfer.files;
				this.addFiles(files);
			}

			if(!e.originalEvent.dataTransfer.files || e.originalEvent.dataTransfer.files.length === 0) {
				let url = e.originalEvent.dataTransfer.getData("URL");
				this.addUrl(url);
			}
		}.bind(this));
	}

	addFiles(files) {
		let reader = new FileReader();
		let self = this;

		for(let i=0;i<files.length;i++) {
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
	}

	addGeoJson(url) {
		let renderableLayer = new WorldWind.RenderableLayer("GeoJSON");
		this._wwd.addLayer(renderableLayer);
		let geoJson = new WorldWind.GeoJSONParser(url);
		geoJson.load(null, null, renderableLayer);
		this._wwd.redraw();
	}

	addGeometryToPlaceLayer(geometry){
		if (!this._placeLayer){
			this._placeLayer = new WorldWind.RenderableLayer('place-layer');
			this._placeLayer.metadata = {
				group: "place-layer"
			};
			this._wwd.addLayer(this._placeLayer);
		}
		let renderables = new MultiPolygon({geometry: geometry.geometry, key: geometry.key, switchedCoordinates: true}).render();
		this._placeLayer.addRenderables(renderables);
		this._wwd.redraw();
	}


	addGeoTiff(url) {
		let geotiffObject = new WorldWind.GeoTiffReader(url);
		let self = this;

		geotiffObject.readAsImage(function (canvas) {
			let surfaceGeoTiff = new WorldWind.SurfaceImage(
				geotiffObject.metadata.bbox,
				new WorldWind.ImageSource(canvas)
			);

			let geotiffLayer = new WorldWind.RenderableLayer("GeoTiff");
			geotiffLayer.addRenderable(surfaceGeoTiff);
			self._wwd.addLayer(geotiffLayer);
			self._wwd.redraw();
		});
	}

	addKML(url) {
		let self = this;
		let kmlFilePromise = new WorldWind.KmlFile(url, []);
		kmlFilePromise.then(function (kmlFile) {
			let renderableLayer = new WorldWind.RenderableLayer("Surface Shapes");
			renderableLayer.addRenderable(kmlFile);

			self._wwd.addLayer(renderableLayer);
			self._wwd.redraw();
		});
	}

	/**
	 * Add layer to map
	 * @param layer {Layer}
	 */
	addLayer(layer) {
		this._wwd.addLayer(layer);
	};

	addMapControlListeners(){
		this._wwd.addEventListener("mousemove", this.updateNavigatorState.bind(this));
		this._wwd.addEventListener("wheel", this.updateNavigatorState.bind(this));
	}

	/**
	 * Add label with info about period to the map and add dataPeriod attribute of the map container (it is used for sorting)
	 */
	addPeriod() {
		if (this._periodLabelSelector) {
			this._periodLabelSelector.remove();
		}
		let self = this;
		this._store.periods.byId(this._period).then(function (periods) {
			if (periods.length === 1) {
				self._mapBoxSelector.find(".map-period-label").remove();
				let periodName = periods[0].name;
				let html = '<div class="map-period-label">' + periodName + '</div>';
				self._mapBoxSelector.attr("data-period", periodName);
				self._mapBoxSelector.find(".map-window-tools").append(html);
				self._periodLabelSelector = self._mapBoxSelector.find(".map-period-label")
			}
		});
	};

	addUrl(url) {
		if(url.endsWith('.geojson') || url.endsWith('.json')) {
			this.addGeoJson(url);
		} else if(url.endsWith('.tif') || url.endsWith('.tiff')) {
			this.addGeoTiff(url);
		} else if(url.endsWith('.kml')) {
			this.addKML(url);
		}
	}

    /**
     * Add callback for snapshots
     */
    snapshot(){
        const wwd = this._wwd;
    	return new Promise((resolve) => {
            const snapshot = (worldWindow, stage) => {
                if(stage === 'afterRedraw') {
                    wwd.redrawCallbacks.shift();

                    resolve(document.getElementById(this._id + '-canvas').toDataURL());
                }
            };

            // Get the snapshot from the current map.
            wwd.redrawCallbacks.push(snapshot);
            wwd.redraw();
		});
    };

    /**
     * It builds Web World Wind
     */
    build() {
        let html = S(`
        <div class="world-wind-map-box" id="{{id}}-box" >
            <div id="{{id}}" class="world-wind-map">
                <canvas id="{{id}}-canvas" class="world-wind-canvas">
                    Your browser does not support HTML5 Canvas.
                </canvas>
            </div>
        </div>
        `).template({
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
    buildGoToAnimator(){
        return new MyGoToAnimator(this._wwd, {
            store: {
                locations: this._store.locations,
                state: this._store.state
            },
            dispatcher: this._dispatcher
        });
    }

	/**
	 * It builds an instance of Layers for this map
	 * @returns {Layers}
	 */
	buildLayers(){
		return new Layers(this._wwd, {
			selectController: this.selectionController,
			name: this._name
		});
	}

    buildMapWindowTools(){
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
    }

    buildSelectionController(){
        return new SelectionController(this._wwd, {
            store: {
                state: this._stateStore
            }
        });
    }

	/**
	 * Build the World Wind Window
	 * @returns {WorldWind.WorldWindow}
	 */
	buildWorldWindow() {
		return new WorldWind.WorldWindow(this._id + "-canvas");
	};

    /**
     * Change geometry in AOI Layer, if layer exists
     * @param geometry {GeoJSON}
     * @param geometry.coordintes {Array}
     * @param geometry.type {string}
     */
    changeGeometryInAoiLayer(geometry){
        if (this._aoiLayer){
            this._aoiLayer.removeAllRenderables();
            let renderables = new MultiPolygon({geometry: geometry, switchedCoordinates: true}).render();

            this._aoiLayer.addRenderables(renderables);
            this._wwd.redraw();
        }
    }

	/**
	 * Disable map on click recognizer
	 */
	disableClickRecognizer() {
		if (this._clickRecognizer) {
			this._clickRecognizer.enabled = false;
		}
	};

	/**
	 * It returns container for rendering of Web World Wind
	 * @returns {Object} JQuery selector
	 */
	getContainer() {
		return this._mapBoxSelector;
	};

	/**
	 * Go to specific position in map
	 * @param position {Position}
	 */
	goTo(position) {
		this._wwd.navigator.lookAtLocation = position;
		this._wwd.redraw();
		this._wwd.redrawIfNeeded(); // TODO: Check with new releases. This isn't part of the public API and therefore might change.
	};

	/**
	 * Handle AOI Layer. If exists
	 */
	handleAoiLayer(layerData){
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
	}

	/**
	 * Handle settings for current scope
	 */
	handleScopeSettings(){
		let state = this._stateStore.current();
		if (state.aoiLayer){
			this.handleAoiLayer(state.aoiLayer);
		}
	}

	/**
	 * Rebuild map
	 */
	rebuild() {
		this._stateStore.removeLoadingOperation("initialLoading");
		let state = this._stateStore.current();
		let changes = state.changes;

		if (changes.scope || changes.location || _.isEmpty(changes)){
			this._stateStore.removeLoadingOperation("appRendering");
		}

		/**
		 * Set location if location or scope has been changed, but dataview
		 */
		if ((changes.scope || changes.location) && !changes.dataview && !window.Config.dataviewId){
			this._stateStore.addLoadingOperation("ScopeLocationChanged");
			this._goToAnimator.setLocation();
		}

		let maps = this._mapStore.getAll();
		if (this._id === "default-map" || maps.length === 1){
			this._stateStore.addLoadingOperation("DefaultMap");
			this.updateNavigatorState();
			let periods = state.periods;
			if (periods.length === 1 || !this._period){
				this._period = periods[0];
				this._dispatcher.notify('periods#initial', periods);
			}
			if (!state.isMapIndependentOfPeriod || state.isMapDependentOnScenario){
				this.unselect();
				this._dispatcher.notify('map#defaultMapUnselected');
			}
			if (!this._aoiLayer){
				this.handleScopeSettings();
			}
		}

		/**
		 * Handle label for first map
		 */
		if (this._id === "default-map" || maps.length === 1){
			if (state.isMapDependentOnScenario){
				this.mapWindowTools.addMapLabelWithName(polyglot.t('defaultState'));
			} else {
				this.mapWindowTools.addMapLabel(this._period);
			}
		}
	};

	/**
	 * Redraw the map
	 */
	redraw() {
		this._wwd.redraw();
	};

	removeAllGeometriesFromPlaceLayer() {
		let self = this;
		if (this._placeLayer && this._placeLayer.renderables){
			this._placeLayer.removeAllRenderables();
			this.redraw();
		}
	}

	/**
	 * Remove close button to this map
	 */
	removeCloseButton() {
		this._mapBoxSelector.find(".close-map-button").remove();
	};

	removeGeometryFromPlaceLayer(geometryKey) {
		let self = this;
		if (this._placeLayer && geometryKey){
			let renderables = _.filter(this._placeLayer.renderables, function (rend){
				return rend.key === geometryKey});
			if (renderables && renderables.length){
				renderables.forEach(function(renderable){
					self._placeLayer.removeRenderable(renderable);
				});
			}
			this.redraw();
		}
	}

	/**
	 * Remove layer from map
	 * @param layer {Layer}
	 */
	removeLayer(layer) {
		this._wwd.removeLayer(layer);
	};

	/**
	 * Select map
	 */
	select(){
		this._selected = true;
		this._mapBoxSelector.addClass('selected');
	}

	/**
	 * Get navigator state from store and set this map navigator's parameters.
	 */
	setNavigator() {
		let navigatorState = this._stateStore.getNavigatorState();

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
	setPeriod(period){
		this._period = period;
	}

	/**
	 * Set projection of current map
	 * @param projection {string} 2D or 3D
	 */
	setProjection(projection){
		if (projection === '2D'){
			this._wwd.globe = new WorldWind.Globe2D();
			this._wwd.globe.projection = new WorldWind.ProjectionMercator();
		} else if (projection === '3D'){
			this._wwd.globe = new WorldWind.Globe(new WorldWind.EarthElevationModel());
		}
		this.redraw();
	}

	/**
	 * Set map range
	 * @param range {number}
	 */
	setRange(range) {
		this._wwd.navigator.range = range;
		this.redraw();
	};

	/**
	 * Return elevation at location
	 * @param latitude
	 * @param longitude
	 * @returns {Number}
	 */
	getElevationAtLocation(latitude, longitude) {
		return this._wwd.globe.elevationAtLocation(latitude, longitude);
	}

    /**
     * Set up Web World Wind
     */
    setupWebWorldWind() {
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
	 * Switch projection from 3D to 2D and vice versa
	 */
	switchProjection() {
		let globe = null;
		let is2D = this._wwd.globe.is2D();
		if (is2D) {
			globe = new WorldWind.Globe(new WorldWind.EarthElevationModel());
		} else {
			globe = new WorldWind.Globe2D();
			globe.projection = new WorldWind.ProjectionMercator();
		}
		this._wwd.globe = globe;
		this.redraw();
	};

	/**
	 * Unselect map
	 */
	unselect(){
		this._selected = false;
		this._mapBoxSelector.removeClass('selected');
	}

    /**
     * Update state of the navigator in MapStore. It is used for contolling of multiple maps at the same time.
     */
    updateNavigatorState() {
    	if (this._updateNavigatorTimeout){
    		clearTimeout(this._updateNavigatorTimeout);
		}
    	var self = this;
    	this._updateNavigatorTimeout = setTimeout(function(){
			self._dispatcher.notify(Actions.mapControl, self._wwd.navigator);
		}, 100);
		this._stateStore.removeLoadingOperation("DefaultMap");
    };

    /**
     * Zoom map to given area
     * @param bboxes {Array} list of bboxes of areas
     */
    zoomToArea(bboxes) {
        this._goToAnimator.zoomToArea(bboxes);
        this.redraw();
    };

    /**
     * Zoom map to extent (place or all places)
     */
    zoomToExtent() {
        this._goToAnimator.setLocation();
        this.redraw();
    };

    /**
     * Execute on map click. Find out a location of click target in lat, lon. And execute getFeatureInfo query for this location.
     * @param callback {function} on click callback
     * @param property {string} property for to find via getFeatureInfo
     * @param event {Object}
     */
    onMapClick(callback, property, event) {
        let self = this;
        let gid = null;
        let coordinates = null;
        let auLayer = this.layers.getAuLayer()[0];
        let auBaseLayers = this._dataMining.getAuBaseLayers(this._period);

        let x = event._clientX;
        let y = event._clientY;
        let position = this.getPositionFromCanvasCoordinates(x, y);
        if (position) {
            coordinates = {
                lat: position.latitude,
                lon: position.longitude
            };
        }

        if (auLayer.metadata.active && coordinates) {
            auLayer.getFeatureInfo(property, coordinates, auBaseLayers.join(",")).then(function (feature) {
                if (feature && feature.properties) {
                    gid = feature.properties[property];
                }
                callback(gid, self._period, {x: x, y: y});
            });
        } else {
            callback(gid);
        }
    };

    getLayersInfo(callback, event) {
        let x = event.x,
            y = event.y;
        let position = this.getPositionFromCanvasCoordinates(x,y);

        let tablePromises = event.worldWindow.layers.map(function(layer){
            if(!layer || !layer.metadata || !layer.metadata.group ||
                layer.metadata.group === 'areaoutlines' ||
                layer.metadata.group === 'background-layers' ||
                layer.metadata.group === 'place-layer') {
                return;
            }

            let layerNames = layer.urlBuilder.layerNames;
            let crs = layer.urlBuilder.crs;
            let name = layerNames;
            let customParams = null;
            if (layer.metadata && layer.metadata.name){
                name = layer.metadata.name;
            }
            if (layer.urlBuilder.customParams){
                customParams = layer.urlBuilder.customParams;
            }

            return new WmsFeatureInfo({
                customParameters: customParams,
                serviceAddress: window.Config.geoServerUrl,
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
    getPositionFromCanvasCoordinates(x, y) {
        let currentPoint = this._wwd.pickTerrain(this._wwd.canvasCoordinates(x, y));
        if (!currentPoint.objects.length) {
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
    setPositionRangeFromBbox(bbox) {
        let position = {
            longitude: (bbox.lonMax + bbox.lonMin) / 2,
            latitude: (bbox.latMax + bbox.latMin) / 2
        };
        this.goTo(position);
        this.setRange(5000);
        // TODO solve range in this way
        // this._wwd.deepPicking = true;
        // let locations = this._wwd.pickTerrain({0:1, 1:1});
        // let locations2 = this._wwd.pickTerrain({0:(this._wwd.viewport.width - 1), 1:(this._wwd.viewport.height-1)});
    };

    /**
     * @param type {string} type of event
     * @param options {Object}
     */
    onEvent(type, options) {
        if (type === Actions.mapControl) {
            this._stateStore.removeLoadingOperation("DefaultMap");
        }
    };
}

export default WorldWindMap;