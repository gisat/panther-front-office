
import _ from 'underscore';

import Actions from '../../../../actions/Actions';
import ArgumentError from '../../../../error/ArgumentError';
import Logger from '../../../../util/Logger';

import ThematicLayersPanel from './ThematicLayersPanel';

let Stores = window.Stores;
let polyglot = window.polyglot;

/**
 * Class representing AU Layers Panel of WorldWindWidget
 * @param options {Object}
 * @constructor
 */
let $ = window.$;
class AuLayersPanel extends ThematicLayersPanel {
    constructor(options) {
        super(options);

        if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'AuLayersPanel', 'constructor', 'Stores must be provided'));
        }
        if(!options.store.state){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'AuLayersPanel', 'constructor', 'Store state must be provided'));
        }

        this._layers = {
            outlines: {},
            selected: {}
        };
        this._layersControls = [];
        this._stateStore = options.store.state;
    };

    addListeners() {
        Stores.addListener(this.onEvent.bind(this));
    };

    /**
     * Clear whole selection
     */
    clearAllSelections(action, notification) {
        $("#selectedareasfilled-panel-row").remove();
        this.clearLayers("selectedareasfilled");
        Stores.selectedOutlines = null;
        let control = _.find(this._layersControls, function (control) {
            return control._id === "selectedareasfilled"
        });
        if(control) {
            control._toolBox.hide();
        }
    }

    /**
     * Clear active selection
     */
    clearActiveSelection() {
        this.redrawLayer(this._layers.selected, "selectedareasfilled", Stores.selectedOutlines);

    };

    /**
     * Check the list of active layers and switch them on
     */
    switchOnLayersFrom2D() {
        if (Stores.outlines) {
            this.switchOnOutlines();
        }
        if (Stores.selectedOutlines) {
            this.switchOnSelected();
        }
    };

    switchOnActiveLayers(groupId, layer){
        if (layer && layer.layerData && layer.layerData.id === groupId){
            var checkbox = $(".checkbox-row[data-id=" + layer.layerData.id +"]");
            checkbox.addClass("checked");
            this._mapStore.getAll().forEach(function(map){
                map.layers.showLayer(layer.layerData.id, 0);
            });
        }
    }

    switchOnOutlines() {
        this.redrawLayer(this._layers.outlines, "areaoutlines", Stores.outlines);
        this.switchOnActiveLayers("areaoutlines");
    };

    switchOnSelected() {
        this.redrawSelectedLayer(this._layers.selected, "selectedareasfilled", Stores.selectedOutlines);
        this.switchOnActiveLayers("selectedareasfilled");
    };

    /**
     * Rebuild AU layers panel.
     */
    rebuild() {
        this.clear(this._id);
        this._layersControls = [];

        if (Stores.selectedOutlines) {
            this.rebuildControl(polyglot.t("selectedAreasFilled"), this._layers.selected, "selectedareasfilled");
            this.switchOnSelected();
        }

        if (Stores.outlines) {
            this.rebuildControl(polyglot.t("areaOutlines"), this._layers.outlines, "areaoutlines");
            this._layers.outlines.additionalData = Stores.outlines.data;
            this.switchOnOutlines();
        }
    };

    /**
     * Rebuild layer control
     * @param name {string} name of the layer
     * @param layer {Object} layer data
     * @param id {string} id of the group
     */
    rebuildControl(name, layer, id) {
        let selected = {
            id: id,
            name: name,
            opacity: 70
        };

        layer.layerData = selected;
        layer.control = this.addLayerControl(selected.id, selected.name, this._panelBodySelector, false);
        this._layersControls.push(layer.control);
    };

    /**
     * Redraw layer
     * @param layer {Object} layer data
     * @param id {string} id of the group
     * @param store {Object} store with data from 2D
     */
    redrawLayer(layer, id, store) {
        this.clearLayers(id);
        if (!_.isEmpty(layer)) {
            layer.layerData.layer = store.layerNames;
            layer.layerData.sldId = store.sldId;
            layer.layerData.data = store.data;

            this._mapStore.getAll().forEach(function (map) {
                map.layers.addAULayer(layer.layerData, id, false);
            });

            let toolBox = layer.control.getToolBox();
            toolBox.clear();
            toolBox.addOpacity(layer.layerData, this._mapStore.getAll());
        }
    };

    /**
     * Redraw selected layer
     * @param layer {Object} layer data
     * @param id {string} id of the group
     * @param store {Object} store with data from 2D
     */
    redrawSelectedLayer(layer, id, store) {
        this.clearLayers(id);
        if (!_.isEmpty(layer)) {
            layer.layerData.layer = store.layerNames;
            layer.layerData.sldId = store.sldId;

            this._mapStore.getAll().forEach(function (map) {
                map.layers.addChoroplethLayer(layer.layerData, id, false);
            });

            let toolBox = layer.control.getToolBox();
            toolBox.clear();
            toolBox.addOpacity(layer.layerData, this._mapStore.getAll());
        }
    };

    /**
     * @param type {string}
     */
    onEvent(type) {
        var scope = this._stateStore.current().scopeFull;
        var isAvailable = true;
        if (scope && scope.layersWidgetHiddenPanels){
            var auPanel = _.find(scope.layersWidgetHiddenPanels, function(panel){return panel === 'analytical-units'});
            if (auPanel){
                isAvailable = false;
            }
        }
        if (type === "updateOutlines" && isAvailable){
            this.rebuild();
        } else if (type === Actions.selectionEverythingCleared){
            this.clearAllSelections();
        } else if (type === Actions.selectionActiveCleared){
            this.clearActiveSelection()
        }
    };
}

export default AuLayersPanel;