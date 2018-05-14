import LayerTool from '../LayerTool';
import stringUtils from '../../../../../util/stringUtils';

import './Legend.css';

let Config = window.Config;

/**
 * Class representing layer legend
 * @param options {Object}
 * @augments LayerTool
 * @constructor
 */
class Legend extends LayerTool {
    constructor(options) {
        super(options);

        this.build();
    };

    /**
     * Build a legend
     */
    build() {
        this._icon = this.buildIcon("Legend", "legend-icon", "legend");
        this._floater = this.buildFloater("Legend", "legend-floater");

        this._iconSelector = this._icon.getElement();
        this._floaterSelector = this._floater.getElement();

        this.addContent();
        this.addEventsListener();
    };

    /**
     * Add content to a legend floater
     */
    addContent() {
        let style = "";
        if (this._layerMetadata.stylePaths) {
            style = this._layerMetadata.stylePaths;
        }

        let params = {
            'LAYER': this._layerMetadata.path,
            'REQUEST': 'GetLegendGraphic',
            'FORMAT': 'image/png',
            'WIDTH': 50,
            'STYLE': style
        };
        if (this._layerMetadata.hasOwnProperty('sldId')) {
            params['SLD_ID'] = this._layerMetadata.sldId;
        }

        let imgSrc = Config.url + "api/proxy/wms?" + stringUtils.makeUriComponent(params);
        this._floater.addContent('<img src="' + imgSrc + '">');
    };
}

export default Legend;