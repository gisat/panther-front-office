
import S from 'string';
import _ from 'underscore';

import ArgumentError from '../../../error/ArgumentError';
import Logger from '../../../util/Logger';

import AuLayersPanel from './panels/AuLayersPanel';
import BackgroundLayersPanel from './panels/BackgroundLayersPanel';
import InfoLayersPanel from './panels/InfoLayersPanel';
import ThematicLayersPanel from './panels/ThematicLayersPanel';
import WmsLayersPanel from './panels/WmsLayersPanel';

import './WorldWindWidgetPanels.css';

/**
 * @param options {Object}
 * @param options.id {string} id of element
 * @param options.target {Object} JQuery selector of target element
 * @param options.currentMap
 * @param options.store {Object}
 * @param options.store.state {StateStore}
 * @param options.store.map {MapStore}
 * @param options.store.wmsLayers {WmsLayers}
 * @constructor
 */
let $ = window.$;
class WorldWindWidgetPanels {
    constructor(options) {
        if (!options.id){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidgetPanels", "constructor", "missingId"));
        }
        if (!options.target || options.target.length === 0){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidgetPanels", "constructor", "missingTarget"));
        }
        if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WorldWindWidgetPanels', 'constructor', 'Stores must be provided'));
        }
        if(!options.store.map){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WorldWindWidgetPanels', 'constructor', 'Store map must be provided'));
        }
        if(!options.store.state){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WorldWindWidgetPanels', 'constructor', 'Store state must be provided'));
        }
        if(!options.store.wmsLayers){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WorldWindWidgetPanels', 'constructor', 'Store wms layers must be provided'));
        }
        if (!options.dispatcher){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WorldWindWidgetPanels', 'constructor', 'Dispatcher must be provided'));
        }

        this._store = options.store;
        this._stateStore = options.store.state;
        this._id = options.id;
        this._target = options.target;
        this._dispatcher = options.dispatcher;
        this.build();
    };


    /**
     * Rebuild panels with current configuration
     */
    rebuild() {
        let scope = this._stateStore.current().scopeFull;
        let hiddenPanels = scope.layersWidgetHiddenPanels;
        this.handlePanels(hiddenPanels);
    };

    /**
     * Build section of World Wind Widget
     */
    build() {
        let html = S(`
        <div id="{{panelsId}}" class="widget-panels"></div>
        `).template({
            panelsId: this._id
        }).toString();
        this._target.append(html);
        this._panelsSelector = $("#" + this._id);

        this._auLayersPanel = this.buildAuLayersPanel();
        this._thematicLayersPanel = this.buildThematicLayersPanel();
        this._infoLayersPanel = this.buildInfoLayersPanel();
        this._backgroundLayersPanel = this.buildBackgroundLayersPanel();
        this._wmsLayersPanel = this.buildWmsLayersPanel();

        this.addEventsListeners();
    };

    /**
     * Add background layers to map
     * @param map {WorldWindMap}
     */
    addLayersToMap(map) {
        this._backgroundLayersPanel.addLayersToMap(map);
    };

    /**
     * Build panel with background layers
     */
    buildBackgroundLayersPanel() {
        return new BackgroundLayersPanel({
            id: "background-layers",
            name: window.polyglot.t("backgroundLayers"),
            target: this._panelsSelector,
            isOpen: true,
            store: {
                map: this._store.map,
                state: this._store.state,
                periods: this._store.periods
            },
            dispatcher: this._dispatcher
        });
    };

    /**
     * Build panel with thematic layers
     */
    buildThematicLayersPanel() {
        return new ThematicLayersPanel({
            id: "thematic-layers",
            name: window.polyglot.t("thematicLayers"),
            target: this._panelsSelector,
            isOpen: true,
            store: {
                map: this._store.map,
                state: this._store.state,
                periods: this._store.periods
            }
        });
    };

    /**
     * Build panel with analytical units layers
     */
    buildAuLayersPanel() {
        return new AuLayersPanel({
            id: "au-layers",
            name: window.polyglot.t("analyticalUnitsLayers"),
            target: this._panelsSelector,
            isOpen: true,
            store: {
                map: this._store.map,
                state: this._store.state,
                periods: this._store.periods
            }
        });
    };

    /**
     * Build panel with info layers
     */
    buildInfoLayersPanel() {
        return new InfoLayersPanel({
            id: "info-layers",
            name: window.polyglot.t("infoLayers"),
            target: this._panelsSelector,
            isOpen: true,
            store: {
                map: this._store.map,
                state: this._store.state,
                periods: this._store.periods
            },
			dispatcher: this._dispatcher
        });
    };

    /**
     * Build panel with wms layers
     */
    buildWmsLayersPanel() {
        return new WmsLayersPanel({
            id: "wms-layers",
            name: window.polyglot.t("customWmsLayers"),
            target: this._panelsSelector,
            isOpen: true,
            store: {
                map: this._store.map,
                state: this._store.state,
                wmsLayers: this._store.wmsLayers,
                periods: this._store.periods
            },
            dispatcher: this._dispatcher
        });
    };

    /**
     * @param hiddenPanels {Array} list of panels
     */
    handlePanels(hiddenPanels){
        let infoLayersHidden = _.find(hiddenPanels, function(panel){return panel === "info-layers"});
        if (infoLayersHidden){
            this._infoLayersPanel.hidePanel();
        } else {
            this._infoLayersPanel.rebuild();
        }

        let thematicLayersHidden = _.find(hiddenPanels, function(panel){return panel === "thematic-layers"});
        if (thematicLayersHidden){
            this._thematicLayersPanel.hidePanel();
            $("#thematic-layers-configuration").css("display","none");
        } else {
            this._thematicLayersPanel.rebuild();
        }

        let wmsLayersHidden = _.find(hiddenPanels, function(panel){return panel === "wms-layers"});
        if (wmsLayersHidden){
            this._wmsLayersPanel.hidePanel();
        } else {
            this._wmsLayersPanel.rebuild();
        }

        let auLayersHidden = _.find(hiddenPanels, function(panel){return panel === "analytical-units"});
        if (auLayersHidden){
            this._auLayersPanel.hidePanel();
        } else {
            this._auLayersPanel.rebuild("updateOutlines","updateOutlines");
        }

		let backgroundLayersHidden = _.find(hiddenPanels, function(panel){return panel === "background-layers"});
		if (backgroundLayersHidden){
			this._backgroundLayersPanel.hidePanel();
		} else {
			this._backgroundLayersPanel.toggleLayers();
		}
    }

    /**
     * Add listeners
     */
    addEventsListeners() {
        this.onPanelHeaderClick();
    };

    /**
     * Open/Close panel on panel header click
     * @returns {boolean}
     */
    onPanelHeaderClick() {
        this._panelsSelector.find(".panel-header").click(function () {
            $(this).toggleClass('open');
            $(this).next().slideToggle();
            return false;
        });

        this._panelsSelector.on("click", ".panel-layer-group-header", function () {
            $(this).toggleClass('open');
            $(this).next().slideToggle();
            return false;
        });
    };
}

export default WorldWindWidgetPanels;