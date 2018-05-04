import _ from 'underscore';
import jQuery from 'jquery';

import ArgumentError from '../../../../error/ArgumentError';
import Logger from '../../../../util/Logger';

import WorldWindWidgetPanel from './WorldWindWidgetPanel';

/**
 * Class representing Wms Layers Panel of WorldWindWidget
 * @param options {Object}
 * @param options.store {Object}
 * @param options.store.map {MapStore}
 * @param options.store.state {StateStore}
 * @param options.store.wmsLayers {WmsLayers}
 * @constructor
 */
class WmsLayersPanel extends WorldWindWidgetPanel {
    constructor(options) {
        super(options);

        if (!options.store) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WmsLayersPanel', 'constructor', 'Stores must be provided'));
        }
        if (!options.store.map) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WmsLayersPanel', 'constructor', 'Store map must be provided'));
        }
        if (!options.store.state) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WmsLayersPanel', 'constructor', 'Store state must be provided'));
        }
        if (!options.store.wmsLayers) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WmsLayersPanel', 'constructor', 'Store wmsLayers must be provided'));
        }

        this._groupId = "wms-layers";
        this._group2dId = "wmsLayer";
        this._idPrefix = "wmsLayer";
        this._layersControls = [];
        this._store = options.store;
        this._stateStore = options.store.state;
        this._mapStore = options.store.map;
    };

    /**
     * Add onclick listener to every checkbox
     * Temporarily in this class TODO move method to parent
     */
    addCheckboxOnClickListener() {
        this._panelBodySelector.on("click", ".checkbox-row", this.switchLayer.bind(this));
    };

    /**
     * Rebuild panel
     */
    rebuild() {
        this._allMaps = this._store.map.getAll();
        this.getLayersForCurrentConfiguration().then(this.addPanelContent.bind(this)).catch(function (error) {
            console.error('WmsLayerPanel#rebuild Error: ', error);
        });
    };

    /**
     * Add content to panel
     * @param layers {Array} collection of layers grouped by name
     */
    addPanelContent(layers) {
        let self = this;
        this.clear(this._id);
        this._previousLayersControls = jQuery.extend(true, [], this._layersControls);
        this._layersControls = [];
        if (layers && layers.length > 0) {
            let currentScope = this._store.state.current().scopeFull;
            layers.forEach(function (layer, index) {
                if (currentScope && currentScope.layerOptions && currentScope.layerOptions.ordering === 'topBottomPanel') {
                    // Add the index of the layer relevant to its position in the panel.
                    layer.layers.forEach(function (layer) {
                        layer.order = index;
                    });
                }
                self.buildLayerControlRow(self._panelBodySelector, layer.id, layer.name, layer.layers, null);
            });
            this.displayPanel("block");
        } else {
            console.warn("WmsLayersPanel#rebuild: No WMS layers for current configuration.");
            this.displayPanel("none");
        }
    };

    /**
     * Get WMS layers for each place.
     */
    getLayersForCurrentConfiguration() {
        let wmsStore = this._store.wmsLayers;
        let configuration = this._store.state.current();
        let locations = configuration.allPlaces;
        if (configuration.place.length > 0) {
            locations = [Number(configuration.place)];
        }
        let promises = [];
        locations.forEach(function (location) {
            promises.push(wmsStore.filter({locations: location}));
        });
        let self = this;
        return Promise.all(promises).then(function (results) {
            if (results.length > 0) {
                let layers = _.flatten(results);
                let groupedLayers = self.groupLayersByName(layers);
                return self.getLayersRelevantForPeriods(groupedLayers, configuration.periods);
            }
        });
    };

    /**
     * Check, if periods associated with a layer (grouped) meets at least one period from currently selected periods
     * @param groupedLayers {Array} Collection of grouped layers
     * @param currentPeriods {Array} List of currently selected periods
     * @returns {Array} List of all relevant grouped layers for currenly selected periods
     */
    getLayersRelevantForPeriods(groupedLayers, currentPeriods) {
        let relevantLayers = [];
        groupedLayers.forEach(function (layer) {
            if (_.intersection(layer.periods, currentPeriods).length > 0) {
                relevantLayers.push(layer);
            }
        });
        return relevantLayers;
    };

    /**
     * Group layers by their names
     * @param layers {Array} list of all layers for current configuration
     * @returns {Array} list of grouped layers
     */
    groupLayersByName(layers) {
        let self = this;
        let groupedLayers = [];
        layers.forEach(function (layer) {
            layer.idFor2d = self._group2dId + "-" + layer.id;
            let existingLayer = _.find(groupedLayers, function (l) {
                return l.name === layer.name
            });
            if (existingLayer) {
                existingLayer.periods = existingLayer.periods.concat(layer.periods);
                existingLayer.layers.push(layer);
            } else {
                groupedLayers.push({
                    id: "wms-template-" + layer.id,
                    name: layer.name,
                    periods: layer.periods,
                    layers: [layer]
                });
            }
        });
        return groupedLayers;
    };

    /**
     * Go through a list of active layers. If at least one layer associated with given control is among active wmsLayers,
     * the control should be active.
     * @param id {string} id of control
     * @param layers {Array} Layers associated with this control
     * @returns {boolean} true, if control should be active
     */
    isControlActive(id, layers){
        layers = layers || [];
        let state = this._stateStore.current().mapDefaults;
        let active = false;
        layers.forEach(function(layer){
            if (state && state.wmsLayers){
                let existingLayer = _.find(state.wmsLayers, function(id){return id === layer.id});
                if (existingLayer){
                    active = true;
                }
            }
        });
        return active;
    }
}

export default WmsLayersPanel;