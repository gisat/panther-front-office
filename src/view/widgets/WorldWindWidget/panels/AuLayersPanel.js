
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
            selected: {},
            selectedAreas: {}
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
    clearAllSelections() {
        $("#selectedareasfilled-panel-row").remove();
		$("#selectedareas-panel-row").remove();

		let control = _.find(this._layersControls, function (control) {
			return control._id === "selectedareasfilled"
		});
		if(control) {
			control._toolBox.hide();
		}

		control = _.find(this._layersControls, function (control) {
			return control._id === "selectedareas"
		});
		if(control) {
			control._toolBox.hide();
		}

        this.clearLayers("selectedareas");
        this.clearLayers("selectedareasfilled");

        Stores.selectedOutlines = null;
		Stores.selectedAreas = null;
    }

    /**
     * Clear active selection
     */
    clearActiveSelection() {
    	if (Stores.selectedOutlines){
			this.rebuildSelectedAreas(this._layers.selected, "selectedareasfilled", Stores.selectedOutlines, true);
		}
		if (Stores.selectedAreas){
			this.rebuildSelectedAreas(this._layers.selectedAreas, "selectedareas", Stores.selectedAreas, true);
		}
    };

    /**
     * Rebuild AU layers panel.
     */
    rebuild() {
        this.clear(this._id);
        this._layersControls = [];

        if (Stores.selectedOutlines) {
            this.rebuildControl(polyglot.t("selectedAreasFilled"), this._layers.selected, "selectedareasfilled", false);
			this.rebuildSelectedAreas(this._layers.selected, "selectedareasfilled", Stores.selectedOutlines, false);
        }

		if (Stores.selectedAreas) {
			this.rebuildControl(polyglot.t("selectedAreas"), this._layers.selectedAreas, "selectedareas", true);
			this.rebuildSelectedAreas(this._layers.selectedAreas, "selectedareas", Stores.selectedAreas, true);
		}

        if (Stores.outlines) {
			let active = this.isLayerActive("areaoutlines");
			this.rebuildControl(polyglot.t("areaOutlines"), this._layers.outlines, "areaoutlines", active);
			this.rebuildOutlines(this._layers.outlines, "areaoutlines", Stores.outlines, active);
        }
    };

	/**
	 * @param layer {Object}
	 * @param id {string} Id of group of layers
	 * @param data {Object}
	 * @param active {boolean} true, if layer should be visible
	 */
    rebuildOutlines(layer, id, data, active){
		layer.layerData.layer = data.layerNames;
		layer.layerData.sldId = data.sldId;
		layer.layerData.data = data.data;

		this._mapStore.getAll().forEach(function (map) {
			map.layers.removeAllLayersFromGroup(id);
			map.layers.addAULayer(layer.layerData, id, active);
		});

		let toolBox = layer.control.getToolBox();
		toolBox.clear();
		toolBox.addOpacity(layer.layerData, this._mapStore.getAll());
    }

	/**
	 * @param layer {Object}
	 * @param id {string} Id of group of layers
	 * @param data {Object}
	 * @param active {boolean} true, if layer should be visible
	 */
	rebuildSelectedAreas(layer, id, data, active){
		layer.layerData.layer = data.layerNames;
		layer.layerData.sldId = data.sldId;
		layer.layerData.data = data.data;

		this._mapStore.getAll().forEach(function (map) {
			map.layers.removeAllLayersFromGroup(id);
			map.layers.addChoroplethLayer(layer.layerData, id, active);
		});

		let toolBox = layer.control.getToolBox();
		toolBox.clear();
		toolBox.addOpacity(layer.layerData, this._mapStore.getAll());
	}

    /**
     * Rebuild layer control
     * @param name {string} name of the layer
     * @param layer {Object} layer data
     * @param id {string} id of the group
     * @param visibility {boolean}
     */
    rebuildControl(name, layer, id, visibility) {
        let selected = {
            id: id,
            name: name,
            opacity: 70
        };
        layer.layerData = selected;
        layer.control = this.addLayerControl(selected.id, selected.name, this._panelBodySelector, visibility ? visibility : false);
        this._layersControls.push(layer.control);
    };

	/**
     * Check, if layer is active
	 * @param layerId {string}
	 * @returns {boolean}
	 */
	isLayerActive(layerId){
		let state = this._stateStore.current().mapDefaults;
		if (state && state.analyticalUnitsVisible && layerId === 'areaoutlines'){
		    return state.analyticalUnitsVisible;
		} else {
			return false;
		}
    }

    setOutlinesActive(){
		let control = _.find(this._layersControls, function (control) {
			return control._id === "areaoutlines"
		});
		if (control && control._checkbox && !control._checkbox._checked){
			control._checkbox._checkboxSelector.trigger("click");
		} else {
			window.Stores.notify("analyticalUnits#show");
		}
	}

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
            this.clearActiveSelection();
        } else if (type === "auLayersPanel#setAnalyticalUnitsVisible" && isAvailable){
			this.setOutlinesActive();
		}
    };
}

export default AuLayersPanel;