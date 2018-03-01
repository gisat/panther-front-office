
import WorldWind from '@nasaworldwind/worldwind';

import Actions from '../../../actions/Actions';
import ArgumentError from '../../../error/ArgumentError';
import Logger from '../../../util/Logger';

import Widget from '../Widget';
import WorldWindWidgetPanels from './WorldWindWidgetPanels';

import './WorldWindWidget.css';

let Config = window.Config;
let polyglot = window.polyglot;
let Ext;
let Observer = window.Observer;

/**
 * Class representing widget for 3D map
 * @param options {Object}
 * @param options.mapsContainer {MapsContainer} Container where should be all maps rendered
 * @param options.store {Object}
 * @param options.store.state {StateStore}
 * @param options.store.map {MapStore}
 * @param options.store.wmsLayers {WmsLayers}
 * @param options.topToolBar {TopToolBar}
 * @constructor
 */
let $ = window.$;
class WorldWindWidget extends Widget {
    constructor(options) {
        super(options);

        Ext = window.Ext;

        if (!options.mapsContainer) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidget", "constructor", "missingMapsContainer"));
        }
        if (!options.store) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WorldWindWidget', 'constructor', 'Stores must be provided'));
        }
        if (!options.store.state) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidget", "constructor", "missingStateStore"));
        }
        if (!options.store.map) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidget", "constructor", "missingMapStore"));
        }
        if (!options.store.wmsLayers) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidget", "constructor", "missingWmsLayersStore"));
        }


        this._mapsContainer = options.mapsContainer;
        this._stateStore = options.store.state;
        this._mapStore = options.store.map;
        this._store = options.store;

        if (options.topToolBar) {
            this._topToolBar = options.topToolBar;
        }

        // Inherited from Widget
        this._dispatcher.addListener(this.onEvent.bind(this));

        this.build();

        this._mapsContainer.addMap('default-map');
        this._stateChanges = {};
    };

    /**
     * Build basic view of the widget
     */
    build() {
        this.addSettingsIcon();
        this.addSettingsOnClickListener();

        this._panels = this.buildPanels();

        // config for new/old view
        if (!Config.toggles.useNewViewSelector) {
            this._widgetBodySelector.append('<div id="3d-switch">' + polyglot.t('map3d') + '</div>');
            $("#3d-switch").on("click", this.switchMapFramework.bind(this));
        } else {
            this.addMinimiseButtonListener();
        }
    };

    /**
     * It basicaly adds layers to the map according to selected layers in the widget
     * @param map {WorldWindMap}
     */
    addDataToMap(map) {
        this._panels.addLayersToMap(map);
        if (map._id !== 'default-map') {
            map.rebuild();
            this._panels.rebuild();
        }
    };

    /**
     * Rebuild widget. Rebuild all maps in container and panels.
     */
    rebuild() {
        this._mapsContainer.rebuildMaps();
        this._panels.rebuild();
        this.handleLoading("hide");
    };

    /**
     * Add thematic maps configuration icon the header
     */
    addSettingsIcon() {
        this._widgetSelector.find(".floater-tools-container")
            .append('<div id="thematic-layers-configuration" title="' + polyglot.t("configureThematicMaps") + '" class="floater-tool">' +
                '<i class="fa fa-sliders"></i>' +
                '</div>');
    };

    /**
     * Build panels
     */
    buildPanels() {
        return new WorldWindWidgetPanels({
            id: this._widgetId + "-panels",
            target: this._widgetBodySelector,
            store: {
                state: this._stateStore,
                map: this._mapStore,
                wmsLayers: this._store.wmsLayers
            }
        });
    };

    /**
     * Switch projection from 3D to 2D and vice versa
     */
    switchProjection() {
        this._mapsContainer.switchProjection();
    };

    /**
     * Toggle map into 3D mode
     */
    switchMapFramework() {
        let self = this;
        let body = $("body");

        let state = this._stateStore;
        state.setChanges({
            scope: true,
            location: true,
            dataview: false
        });

        if (body.hasClass("mode-3d")) {
            body.removeClass("mode-3d");
            self._widgetSelector.removeClass("open");
            self.toggleComponents("block");
        } else {
            body.addClass("mode-3d");
            // self._widgetSelector.addClass("open");
            self.toggleComponents("none");
            self.rebuild();
        }
        if (this._topToolBar) {
            this._topToolBar.build();
        }
    };

    /**
     * It shows the 3D Map.
     * @param [options] {Object} Optional. Settings from dataview
     */
    show3DMap(options) {
        let self = this;
        let body = $("body");

        body.addClass("mode-3d");
        self.toggleComponents("none");
        self.rebuild();

        if (this._topToolBar) {
            this._topToolBar.build();
        }

        // set default position of the map
        let position = this.getPosition(options);
        this._mapsContainer.setAllMapsPosition(position);

        // execute if there are settings from dataview
        if (options) {
            this.adjustAppConfiguration(options);
        }
    };

    /**
     * Use dataview options and adjust configuration
     * @param options {Object}
     */
    adjustAppConfiguration(options) {
        if (options.worldWindState) {
            this._mapsContainer.setAllMapsRange(options.worldWindState.range);
        }
        if (options.widgets) {
            this._topToolBar.handleDataview(options.widgets);
        }
    };

    /**
     * Get  default position in the map according to configuration
     * @param [options] {Object} Optional. Settings from dataview
     * @return position {WorldWind.Position}
     */
    getPosition(options) {
        if (options && options.worldWindState) {
            return options.worldWindState.location;
        } else {
            let places = this._stateStore.current().objects.places;
            let locations;
            if (places.length === 1 && places[0]) {
                locations = places[0].get('bbox').split(',');
            } else {
                places = this._stateStore.current().allPlaces.map(function (place) {
                    return Ext.StoreMgr.lookup('location').getById(place);
                });
                locations = this.getBboxForMultiplePlaces(places);
            }

            if (locations.length !== 4) {
                console.warn('WorldWindWidget#getPosition Incorrect locations: ', locations);
                return;
            }
            let position = new WorldWind.Position((Number(locations[1]) + Number(locations[3])) / 2, (Number(locations[0]) + Number(locations[2])) / 2, 1000000);

            return position;
        }
    };

    /**
     * It combines bboxes of all places to get an extent, which will show all of them.
     * @param places
     * @returns {*}
     */
    getBboxForMultiplePlaces(places) {
        if (places.length === 0) {
            return [];
        }

        let minLongitude = 180;
        let maxLongitude = -180;
        let minLatitude = 90;
        let maxLatitude = -90;

        let locations;
        places.forEach(function (place) {
            locations = place.get('bbox').split(',');
            if (locations[0] < minLongitude) {
                minLongitude = locations[0];
            }

            if (locations[1] < minLatitude) {
                minLatitude = locations[1];
            }

            if (locations[2] > maxLongitude) {
                maxLongitude = locations[2];
            }

            if (locations[3] > maxLatitude) {
                maxLatitude = locations[3];
            }
        });

        return [minLongitude, maxLatitude, maxLongitude, minLatitude];
    };

    /**
     * Show/hide components
     * @param action {string} css display value
     */
    toggleComponents(action) {

        if (!Config.toggles.useTopToolbar) {
            let sidebarTools = $("#sidebar-tools");
            if (action === "none") {
                sidebarTools.addClass("hidden-complete");
                sidebarTools.css("display", "none");
            } else {
                sidebarTools.removeClass("hidden-complete");
                sidebarTools.css("display", "block");
            }
        }
        $(".x-window:not(.thematic-maps-settings, .x-window-ghost, .metadata-window, .window-savevisualization, .window-savedataview, #loginwindow, #window-managevisualization, #window-areatree, #window-colourSelection, #window-legacyAdvancedFilters), #tools-container, #widget-container .placeholder:not(#placeholder-" + this._widgetId + ")")
            .css("display", action);

    };

    /**
     * Add onclick listener to the settings icon
     */
    addSettingsOnClickListener() {
        $("#thematic-layers-configuration").on("click", function () {
            Observer.notify("thematicMapsSettings");
        });
    };

    /**
     * Add listener to the minimise button
     */
    addMinimiseButtonListener() {
        let self = this;
        $(this._widgetSelector).find(".widget-minimise").on("click", function () {
            let id = self._widgetSelector.attr("id");
            self._widgetSelector.removeClass("open");
            $(".item[data-for=" + id + "]").removeClass("open");
        });
    };


    onEvent(type, options) {
        if (type === Actions.mapShow3D) {
            this.show3DMap();
        } else if (type === Actions.mapAdd) {
            this.addDataToMap(options.map);
        } else if (type === Actions.mapSwitchFramework) {
            this.switchMapFramework();
        } else if (type === Actions.mapSwitchProjection) {
            this.switchProjection();
        } else if (type === Actions.mapShow3DFromDataview) {
            this.show3DMap(options);
        }
    };
}

export default WorldWindWidget;