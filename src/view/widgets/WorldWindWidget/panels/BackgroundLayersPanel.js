

import ArgumentError from '../../../../error/ArgumentError';
import Logger from '../../../../util/Logger';

import WorldWindWidgetPanel from './WorldWindWidgetPanel';

let Observer = window.Observer;
let polyglot = window.polyglot;

/**
 * Class representing Background Layers Panel of WorldWindWidget
 * @param options {Object}
 * @param options.store {Object}
 * @param options.store.state {StateStore}
 * @constructor
 */
let $ = window.$;
class BackgroundLayersPanel extends WorldWindWidgetPanel {
    constructor(options) {
        super(options);

        if (!options.store) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'BackgroundLayersPanel', 'constructor', 'Stores must be provided'));
        }
        if (!options.store.state) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'BackgroundLayersPanel', 'constructor', 'Store state must be provided'));
        }

        this._store = options.store;
        this.layerControls = [];
        this.rebuild();

        let self = this;
        Observer.addListener('scopeChange', function () {
            self.rebuild();
        });
    };

    rebuild() {
        let scope = this._store.state.current().scopeFull;
        this.addLayerControls(scope);
        this.addEventsListeners();
        this.toggleLayers();
    };

    /**
     * Add control for background layers
     */
    addLayerControls(scope) {
        let disabledLayers = (scope && scope['disabledLayers']) || {};
        let activeBackgroundMap = (scope && scope['activeBackgroundMap']) || this.getValidBackground(disabledLayers);

        this.toggleLayerWithControl('osm', 'openStreetMap', disabledLayers, activeBackgroundMap);
        this.toggleLayerWithControl('cartoDb', 'cartoDbBasemap', disabledLayers, activeBackgroundMap);
        this.toggleLayerWithControl('bingAerial', 'bingAerial', disabledLayers, activeBackgroundMap);
        this.toggleLayerWithControl('sentinel2', 'sentinel2', disabledLayers, activeBackgroundMap);

        if (scope && scope['extraBackgroundLayers']) {
            let extraLayers = scope['extraBackgroundLayers'];
            for (let layer in extraLayers) {
                if (extraLayers[layer] && layer === 'cuzkOrto') {
                    this.toggleLayerWithControl('cuzkOrto', 'cuzkOrto', disabledLayers, activeBackgroundMap);
                    if (!this._defaultMap.layers.getLayerById('cuzkOrto')) {
                        this._defaultMap.layers.addBackgroundLayer('cuzkOrto', this._id);
                    }
                } else if (extraLayers[layer] && layer === 'lpisOrto') {
                    this.toggleLayerWithControl('lpisOrto', 'lpisOrto', disabledLayers, activeBackgroundMap);
                    if (!this._defaultMap.layers.getLayerById('lpisOrto')) {
                        this._defaultMap.layers.addBackgroundLayer('lpisOrto', this._id);
                    }
                } else if (extraLayers[layer] && layer === 'landsat') {
                    this.toggleLayerWithControl('landsat', 'blueMarble', disabledLayers, activeBackgroundMap);
                    if (!this._defaultMap.layers.getLayerById('landsat')) {
                        this._defaultMap.layers.addBackgroundLayer('landsat', this._id);
                    }
                }
            }
        }
    };

    toggleLayerWithControl(id, name, disabledLayers, activeBackgroundMap) {
        if (this.containsLayerWithId(this.layerControls, id)) {
            // Decide whether to remove
            if (disabledLayers[id]) {
                this.removeLayerWithControl(this.layerControls, id);
            }
        } else {
            // Decide whether to add
            if (!disabledLayers[id]) {
                this.layerControls.push({
                    id: id,
                    control: this.addRadio(this._id + "-" + id, polyglot.t(name), this._panelBodySelector, id, activeBackgroundMap === id)
                });
            }
        }
    };

    removeLayerWithControl(layers, id) {
        layers.forEach(function (layer, index) {
            if (layer.id === id) {
                this._mapStore.getAll().forEach(function (map) {
                    map.layers.removeLayer(map.layers.getLayerById(id), false);
                });
                // Remove the control for the layer.
                $('#' + layer.control._id).remove();
                layers.splice(index, 1);
            }
        }.bind(this));
    };

    getValidBackground(disabledLayers) {
        let activeBackgroundMapPriorities = ['osm', 'cartoDb', 'bingAerial', 'landsat'];
        let result = null;

        activeBackgroundMapPriorities.forEach(function (id) {
            if (!result && !disabledLayers[id]) {
                result = id;
            }
        });
        return result;
    };

    containsLayerWithId(layerControls, id) {
        return layerControls.filter(function (control) {
            return control.id === id;
        }).length > 0;
    };

    /**
     * Remove all layers from specific group from map and all floaters connected with this group
     */
    clearLayers(group) {
        $("." + group + "-floater").remove();

        this._mapStore.getAll().forEach(function (map) {
            map.layers.removeAllLayersFromGroup(group, false);
        });

        if (group === "selectedareasfilled" || group === "areaoutlines") {
            this._panelBodySelector.find(".layer-row[data-id=" + group + "]").removeClass("checked");
        } else {
            this._panelBodySelector.find(".layer-row").removeClass("checked");
        }
    };

    /**
     * Add background layers to a map
     * @param map {WorldWindMap}
     */
    addLayersToMap(map) {
        if (map._id === "default-map") {
            this._defaultMap = map;
        }
        this.layerControls.forEach(control => {
            if(control.control._checked) {
                map.layers.addBackgroundLayer(control.id, this._id);
            }
        });
        this.toggleLayers();
    };

    /**
     * Add listeners to controls
     */
    addEventsListeners() {
        this.addRadioOnClickListener();
    };

    /**
     * Hide all background layers and show only the selected one
     */
    toggleLayers() {
        let self = this;
        setTimeout(function () {
            self.layerControls.forEach(function (item, index) {
                let radio = item.control.getRadiobox();
                let dataId = radio.attr("data-id");
                if (radio.hasClass("checked")) {
                    self._mapStore.getAll().forEach(function (map) {
                        map.layers.showBackgroundLayer(dataId);
                    });
                } else {
                    self._mapStore.getAll().forEach(function (map) {
                        map.layers.hideBackgroundLayer(dataId);
                    });
                }
            });
        }, 50);
    };
}

export default BackgroundLayersPanel;