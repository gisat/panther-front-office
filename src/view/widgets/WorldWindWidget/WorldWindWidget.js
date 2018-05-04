import Actions from '../../../actions/Actions';
import ArgumentError from '../../../error/ArgumentError';
import Logger from '../../../util/Logger';

import Widget from '../Widget';
import WorldWindWidgetPanels from './WorldWindWidgetPanels';

import './WorldWindWidget.css';

let polyglot = window.polyglot;
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
let widgets;
class WorldWindWidget extends Widget {
    constructor(options) {
        super(options);

        widgets = window.widgets;

        if (!options.mapsContainer){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidget", "constructor", "missingMapsContainer"));
        }
        if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WorldWindWidget', 'constructor', 'Stores must be provided'));
        }
        if (!options.store.state){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidget", "constructor", "missingStateStore"));
        }
        if (!options.store.map){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidget", "constructor", "missingMapStore"));
        }
        if (!options.store.wmsLayers){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidget", "constructor", "missingWmsLayersStore"));
        }
        if (!options.dispatcher){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WorldWindWidget', 'constructor', 'Dispatcher must be provided'));
        }


        this._mapsContainer = options.mapsContainer;
        this._stateStore = options.store.state;
        this._mapStore = options.store.map;
        this._store = options.store;
        this._dispatcher = options.dispatcher;

        if (options.topToolBar){
            this._topToolBar = options.topToolBar;
        }

        this._dispatcher.addListener(this.onEvent.bind(this));

        this.build();
    };

    /**
     * Build basic view of the widget
     */
    build() {
        this.addSettingsIcon();
        this.addSettingsOnClickListener();

        this._panels = this.buildPanels();

        this.addMinimiseButtonListener();
        // set position in context of other widgets
        this._widgetSelector.css({
            height: widgets.layerpanel.height + 40,
            top: widgets.layerpanel.ptrWindow.y,
            left: widgets.layerpanel.ptrWindow.x
        });
    };

    /**
     * It basicaly adds layers to the map according to selected layers in the widget
     * @param map {WorldWindMap}
     */
    addDataToMap(map) {
        this._panels.addLayersToMap(map);
        if (map._id !== 'default-map'){
            // map.rebuild();
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
            },
            dispatcher: this._dispatcher
        });
    }

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
        if(type === Actions.mapAdded){
            this.addDataToMap(options.map);
        } else if (type === Actions.worldWindWidgetRebuild){
            this._stateStore.resetChanges();
            this.rebuild();
        }
    };
}

export default WorldWindWidget;