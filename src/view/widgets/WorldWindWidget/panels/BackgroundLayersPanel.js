

import ArgumentError from '../../../../error/ArgumentError';
import Logger from '../../../../util/Logger';

import WorldWindWidgetPanel from './WorldWindWidgetPanel';
import Actions from "../../../../actions/Actions";

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

        this._dispatcher.addListener(this.onEvent.bind(this));
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

		this.toggleLayerWithControl('cartoDb', 'cartoDbBasemap', disabledLayers, activeBackgroundMap);
        this.toggleLayerWithControl('osm', 'openStreetMap', disabledLayers, activeBackgroundMap);
		this.toggleLayerWithControl('wikimedia', 'Wikimedia', disabledLayers, activeBackgroundMap);
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
                    let mapLayer = map.layers.getLayerById(id);
                    if (mapLayer){
						map.layers.removeLayer(mapLayer, false);
                    }
                });
                // Remove the control for the layer.
                $('#' + layer.control._id).remove();
                layers.splice(index, 1);
            }
        }.bind(this));
    };

    getValidBackground(disabledLayers) {
        let activeBackgroundMapPriorities = ['cartoDb', 'wikimedia', 'osm', 'bingAerial', 'landsat'];
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
        let activeBackgroundLayer = null;
        setTimeout(function () {
            self._mapStore.getAll().map(map => {
               self.layerControls.map(layerControl => {
				   let radio = layerControl.control.getRadiobox();
				   let dataId = radio.attr("data-id");
				   if (radio.hasClass("checked")) {
					   let layer = map.layers.getLayerById(dataId);
					   if (!layer){
						   map.layers.addBackgroundLayer(dataId, self._id);
					   }
					   map.layers.showBackgroundLayer(dataId);
					   activeBackgroundLayer = dataId;
                   } else {
					   map.layers.hideBackgroundLayer(dataId);
                   }
               });
               map._wwd.redraw();
               self._dispatcher.notify('backgroundLayer#setActive', {key: activeBackgroundLayer});
            });
        }, 50);
    };

    setActiveBackgroundLayer(layerId){
        this.layerControls.map(control => {
			let radio = control.control.getRadiobox();
			let dataId = radio.attr("data-id");
			if (layerId === dataId){
			    radio.addClass("checked");
            } else {
			    radio.removeClass("checked");
            }
        });
        this.toggleLayers();
    }

	/**
	 * @param type {string} type of event
	 * @param options {Object|string}
	 */
	onEvent(type, options){
		if (type === Actions.backgroundLayersPanelSetActive){
            this.setActiveBackgroundLayer(options.key);
		}
	}
}

export default BackgroundLayersPanel;