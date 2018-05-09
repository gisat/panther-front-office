import LayerTool from '../LayerTool';
import SliderBox from '../../../../widgets/inputs/sliderbox/SliderBox';

import './Opacity.css';

let polyglot = window.polyglot;

/**
 * Class representing layer opacity control
 * @param options {Object}
 * @param options.opacityValue {number} value from 0 to 100
 * @augments LayerTool
 * @constructor
 */
class Opacity extends LayerTool {
    constructor(options) {
        super(options);

        this._opacityValue = 100;
        if (this._layerMetadata.opacity) {
            this._opacityValue = this._layerMetadata.opacity;
        }
        this.build();
    };

    /**
     * Build an opactiy control
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
     * Change opacity of the layer on slide
     */
    onSlideListener() {
        let sliderId = this._slider.getSliderId();
        let self = this;

        this._floaterBodySelector.on("slide", "#" + sliderId, function (e, ui) {
            self.setOpacity(ui.value / 100);
        });

        this._floaterBodySelector.on("slidechange", "#" + sliderId, function (e, ui) {
            // todo find out in which case this is used
            if (self._layer.hasOwnProperty("renderables")) {
                self._layer.changeOpacity(ui.value / 100);
            }
            self.setOpacity(ui.value / 100);
        });
    };

    /**
     * Set opacity for this layer in all maps
     * @param opacity
     */
    setOpacity(opacity) {
        this._opacityValue = opacity * 100;

        let self = this;
        this._maps.forEach(function (map) {
            map.layers._layers.forEach(function (layer) {
                if (layer.metadata && layer.metadata.id === self._layerMetadata.id) {
                    layer.opacity = opacity;
                }
            });
            map.redraw();
        });

    };
}

export default Opacity;