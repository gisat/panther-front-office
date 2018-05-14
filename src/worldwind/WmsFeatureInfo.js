

import WmsFeatureInfoUrlBuilder from './WmsFeatureInfoUrlBuilder';

/**
 * It handles retrieval of information from WMS endpoint about the current layers.
 * @constructor
 * @param options {Object}
 * @param options.serviceAddress {String} URL of the service to ask
 * @param options.position {Position} Position of the request.
 * @param options.layers {String} List of layers deliminated by , to request info about the location.
 * @param options.customParameters {Object} Optional Object containing custom parameters to be appended to the URL.
 * @param options.srs {String} Optional Coordinate system reference.
 * @param options.name {String} name of the layer from metadata
 */
let $ = window.$;
class WmsFeatureInfo {
    constructor(options) {
        this.options = options;
        this.urlBuilder = new WmsFeatureInfoUrlBuilder(options);
    };

    /**
     * Return result of get feature info request with request options
     * @returns {Object}
     */
    get() {
        let self = this;
        return $.get(this.urlBuilder.url()).then(function (result) {
            return {
                featureInfo: result,
                options: self.options
            };
        });
    };
}

export default WmsFeatureInfo;