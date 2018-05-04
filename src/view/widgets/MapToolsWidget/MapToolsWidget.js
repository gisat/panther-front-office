import Actions from '../../../actions/Actions';
import ArgumentError from '../../../error/ArgumentError';
import Logger from '../../../util/Logger';

import Button from '../../components/Button/Button';
import LayerInfoTool from '../../tools/FeatureInfoTool/LayerInfoTool';
import SelectInMap from '../../tools/SelectInMap';
import MapToolTrigger from './MapToolTrigger';
import Widget from '../Widget';
import Zooming from '../../tools/Zooming';

import './MapToolsWidget.css';

let polyglot = window.polyglot;

/**
 * Class representing a widget of map tools for World Wind
 * @param options {Object}
 * @param options.dispatcher {Object} Object for handling events in the application.
 * @param options.featureInfo {FeatureInfoTool}
 * @param options.store {Object}
 * @param options.store.map {MapStore}
 * @param options.store.state {StateStore}
 * @constructor
 */
class MapToolsWidget extends Widget {
    constructor(options) {
        super(options);

        if (!options.store) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MapToolsWidget', 'constructor', 'Stores must be provided'));
        }
        if (!options.store.map) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MapToolsWidget', 'constructor', 'Store map must be provided'));
        }
        if (!options.store.state) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MapToolsWidget', 'constructor', 'Store state must be provided'));
        }

        this._store = options.store;

        this._dispatcher = options.dispatcher;
        this._featureInfo = options.featureInfo;

        this._triggers = [];
        this._buttons = [];

        this.build();
        this._dispatcher.addListener(this.onEvent.bind(this));
    };

    /**
     * Build basic view of the widget
     */
    build() {
        this._widgetBodySelector.append('' +
            '<div class="map-tools-container" id="map-tools-selections">' +
            '<h4>' + polyglot.t("selections") + '</h4>' +
            '<div class="map-tools-container-body"></div>' +
            '</div>' +
            '<div class="map-tools-container" id="map-tools-info">' +
            '<h4>' + polyglot.t("featureInfo") + '</h4>' +
            '<div class="map-tools-container-body"></div>' +
            '</div>' +
            '<div class="map-tools-container" id="map-tools-zooming">' +
            '<h4>' + polyglot.t("zoom") + '</h4>' +
            '<div class="map-tools-container-body"></div>' +
            '</div>');
        this._infoContainerSelector = this._widgetBodySelector.find("#map-tools-info").find(".map-tools-container-body");
        this._selectionsContainerSelector = this._widgetBodySelector.find("#map-tools-selections").find(".map-tools-container-body");
        this._zoomingContainerSelector = this._widgetBodySelector.find("#map-tools-zooming").find(".map-tools-container-body");

        // Select areas functionality
        this._selectInMap = this.buildSelectInMap();
        this._triggers.push(this.buildSelectInMapTrigger());
        this._buttons.push(this.buildClearSelectedButton());

        // Area info functionality
        if (this._featureInfo){
            this._triggers.push(this.buildFeatureInfoTrigger());
        }
        // Layer info functionality
        this._layerInfo = this.buildLayerInfo();
        this._triggers.push(this.buildLayerInfoTrigger());

        // Zooming functionality
        this._zooming = new Zooming({
            dispatcher: this._dispatcher,
            store: {
                state: this._store.state
            }
        });
        this._buttons.push(this.buildZoomSelectedButton());
        this._buttons.push(this.buildZoomToExtentButton());

        this.handleLoading("hide");
    };

    /**
     * Rebuild all tools in widget
     */
    rebuild() {
        this._triggers.forEach(function (trigger) {
            trigger.rebuild();
        });
    };

    /**
     * @returns {SelectInMap}
     */
    buildSelectInMap() {
        return new SelectInMap({
            dispatcher: this._dispatcher,
            store: {
                map: this._store.map
            }
        });
    };

    /**
     * Build tool for info about layers
     * @returns {LayerInfoTool}
     */
    buildLayerInfo() {
        return new LayerInfoTool({
            id: 'layer-info',
            dispatcher: this._dispatcher,
            store: {
                map: this._store.map,
                state: this._store.state
            }
        })
    };

    /**
     * Build select in map tool trigger
     * @returns {MapToolTrigger}
     */
    buildSelectInMapTrigger() {
        return new MapToolTrigger({
            id: 'select-in-map-trigger',
            label: polyglot.t("selectInMap"),
            hasFaIcon: true,
            iconClass: 'fa-hand-o-up',
            dispatcher: this._dispatcher,
            target: this._selectionsContainerSelector,
            onDeactivate: this._selectInMap.deactivate.bind(this._selectInMap),
            onActivate: this._selectInMap.activate.bind(this._selectInMap)
        });
    };

    /**
     * Build feature info tool trigger
     * @returns {MapToolTrigger}
     */
    buildFeatureInfoTrigger() {
        return new MapToolTrigger({
            id: 'feature-info-trigger',
            label: polyglot.t("areaInfo"),
            hasSvgIcon: true,
            iconPath: '__new/icons/feature-info.svg',
            dispatcher: this._dispatcher,
            target: this._infoContainerSelector,
            onDeactivate: this._featureInfo.deactivateFor3D.bind(this._featureInfo),
            onActivate: this._featureInfo.activateFor3D.bind(this._featureInfo)
        });
    };

    /**
     * Build layer info tool trigger
     * @returns {MapToolTrigger}
     */
    buildLayerInfoTrigger() {
        return new MapToolTrigger({
            id: 'layer-info-trigger',
            label: polyglot.t("layerInfo"),
            hasSvgIcon: true,
            iconPath: '__new/icons/layers-info-a.svg',
            dispatcher: this._dispatcher,
            target: this._infoContainerSelector,
            onDeactivate: this._layerInfo.deactivate.bind(this._layerInfo),
            onActivate: this._layerInfo.activate.bind(this._layerInfo)
        });
    };

    /**
     * Build button for selection clearing
     * @returns {Button}
     */
    buildClearSelectedButton(){
        return new Button({
            id: "clear-selected-button",
            containerSelector: this._selectionsContainerSelector,
            title: polyglot.t('clearSelection'),
            text: polyglot.t('clearSelection'),
            textCentered: true,
            textSmall: true,
            icon: {
                type: "fa",
                class: "eraser"
            },
            onClick: this._dispatcher.notify.bind(this._dispatcher, 'selection#clearAll')
        });
    }

    /**
     * Build button for zooming to selected areas
     * @returns {Button}
     */
    buildZoomSelectedButton() {
        return new Button({
            id: "zoom-selected-button",
            containerSelector: this._zoomingContainerSelector,
            title: polyglot.t('zoomSelected'),
            text: polyglot.t('zoomSelected'),
            textCentered: true,
            textSmall: true,
            icon: {
                type: "fa",
                class: "search-plus"
            },
            onClick: this._zooming.zoomSelected.bind(this._zooming)
        });
    };

    /**
     * Build button for zooming to extent
     * @returns {Button}
     */
    buildZoomToExtentButton() {
        return new Button({
            id: "zoom-to-extent-button",
            containerSelector: this._zoomingContainerSelector,
            title: polyglot.t('zoomToExtent'),
            text: polyglot.t('zoomToExtent'),
            textCentered: true,
            textSmall: true,
            icon: {
                type: "fa",
                class: "arrows-alt"
            },
            onClick: this._zooming.zoomToExtent.bind(this._zooming)
        });
    };

    /**
     * @param type {string} type of event
     * @param options {Object}
     */
    onEvent(type, options) {
        if (type === Actions.widgetChangedState && options.floater) {
            let id = options.floater.attr("id");
            if (id === "floater-map-tools-widget") {
                this.rebuild();
            }
        } else if (type === Actions.widgetPinMapTools) {
            this._widgetPinSelector.trigger("click");
        }
    };
}

export default MapToolsWidget;