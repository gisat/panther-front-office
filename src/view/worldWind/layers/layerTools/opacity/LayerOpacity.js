import LayerTool from '../LayerTool';
import SliderBox from '../../../../widgets/inputs/sliderbox/SliderBox';

import './Opacity.css';

let polyglot = window.polyglot;

/**
 * Class representing layer opacity control
 * TODO join this class with Opacity.js
 * @param options {Object}
 * @param options.id {string} Id of the tool
 * @param options.name {string} Name of the tool
 * @param options.class {string}
 * @param options.target {Object} JQuery selector of target element
 * @param options.layers {Array} List of layers associated with this legend
 * @param options.maps {Array} List of all active maps
 * @param options.style {Object} Associated style
 * @augments LayerTool
 * @constructor
 */
class LayerOpacity extends LayerTool {
    constructor(options) {
        super(options);

        this._class = options.class;
        this._target = options.target;
        this._layers = options.layers;
        this._mapStore = options.mapStore;
        this._stateStore = options.stateStore;
        this._name = options.name;
        this._id = options.id;
        this._style = options.style;

        this._opacityValue = 90;
        this.build();
    };

    /**
     * Build an opacity control - icon and floater. Attach listeners.
     */
    build() {
        this._icon = this.buildIcon(polyglot.t("opacity"), "opacity-icon", "opacity");
        this._floater = this.buildFloater(polyglot.t("opacity"), "opacity-floater");

        this._iconSelector = this._icon.getElement();
        this._floaterSelector = this._floater.getElement();
        this._floaterBodySelector = this._floater.getBody();

        this.addContent();
        this.addEventsListener();
        this.onSlideListener();
    };

    /**
     * Add content to floater tool body
     */
    addContent() {
        this._floaterBodySelector.html('');
        this._slider = this.buildSlider();
    };

    /**
     * Build slider
     * @returns {SliderBox}
     */
    buildSlider() {
        return new SliderBox({
            id: this._id + "-slider",
            name: polyglot.t("opacity"),
            target: this._floaterBodySelector,
            isRange: false,
            range: [0, 100],
            values: [this._opacityValue]
        });
    };

    /**
     * Change opacity of all associated layers on slide
     */
    onSlideListener() {
        let sliderId = this._slider.getSliderId();
        let self = this;

        this._floaterBodySelector.on("slide", "#" + sliderId, function (e, ui) {
            self.setOpacity(ui.value / 100);
        });

        this._floaterBodySelector.on("slidechange", "#" + sliderId, function (e, ui) {
            self.setOpacity(ui.value / 100);
        });
    };

    /**
     * Redraw layers with opacity value
     * @param opacity {number} Between 0 a 1
     */
    setOpacity(opacity) {
        let self = this;
        this._opacityValue = opacity * 100;
        this._maps = this._mapStore.getAll();
		let state = this._stateStore.current().scopeFull;
		let isPucs = state && state.configuration && state.configuration.pucsLandUseScenarios && state.configuration.pucsLandUseScenarios.styles;

        this._maps.forEach(function (map) {
            if (self._class === "thematic-layers"){
			    if (map.layers && map.layers._layers){
			        map.layers._layers.forEach(layer => {
			           if (layer.metadata && layer.metadata.id === self._id){
			               layer.opacity = opacity;
                       }
                    });
                }
            } else {
				self._layers.forEach(function (layer) {
					let id = layer.id;
					if (layer.layerTemplateId){
						id = layer.layerTemplateId;

						// hack for PUCS
						if (self._style && self._style.path && !isPucs) {
							id += "-" + self._style.path;
						}
					}
					if (self._class === "wms-layers") {
						id = "wmsLayer-" + id;
					}
					let worldWindLayer = map.layers.getLayerById(id);
					if (worldWindLayer) {
						worldWindLayer.opacity = opacity;
					}
				});
            }
            map.redraw();
        });
    };
}

export default LayerOpacity;