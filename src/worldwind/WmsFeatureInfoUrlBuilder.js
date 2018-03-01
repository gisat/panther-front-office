import _ from 'underscore';

import ArgumentError from '../error/ArgumentError';

/**
 *
 * @param options {Object}
 * @param options.serviceAddress {String} Address of the server to retrieve the information from.
 * @param options.layers {String} Layers denominated by ,
 * @param options.position {Position} Position of the click. This allows us to get the information
 * @param options.infoFormat {String} Optional. The format in which the information will be returned. The default value
 *  is text/html
 * @param options.customParameters {Object} Optional. Keys and values will be added as URL params.
 * @param options.srs {String} Optional. Default choice is EPSG:4326
 * @param options.version {String} Optional. Default version is 1.1.1
 * @constructor
 */
class WmsFeatureInfoUrlBuilder {
    constructor(options) {
        if (!options.serviceAddress) {
            throw new ArgumentError("WmsFeatureInfoUrlBuilder#constructor Service Address wasn't provided");
        }
        if (!options.layers) {
            throw new ArgumentError("WmsFeatureInfoUrlBuilder#constructor Layers wasn't provided");
        }
        if (!options.position) {
            throw new ArgumentError("WmsFeatureInfoUrlBuilder#constructor Position wasn't provided");
        }

        this.serviceAddress = options.serviceAddress;
        this.layers = options.layers;
        this.position = options.position;
        this.infoFormat = options.infoFormat || "application/json";
        this.customParameters = options.customParameters || {};
        this.srs = options.srs || options.crs || "EPSG:4326";
        this.version = options.version || '1.1.1';
    };

    /**
     * It returns valid URL for retrieval of the information.
     * @return {String} Valid URL.
     */
    url() {
        let bbox = this.position.latitude + ',' + this.position.longitude + ',' + (Number(this.position.latitude) + 0.000001) +
            ',' + (Number(this.position.longitude) + 0.000001);

        // todo hotfix for sentinel hub, where the bbox has switched longitude and latitude
        if (!_.isEmpty(this.customParameters)) {
            bbox = this.position.longitude + ',' + this.position.latitude + ',' + (Number(this.position.longitude) + 0.000001) +
                ',' + (Number(this.position.latitude) + 0.000001);
        }

        let customParameters = '';
        Object.keys(this.customParameters).forEach(function (key) {
            customParameters += '&' + key + '=' + this.customParameters[key];
        }.bind(this));

        return this.serviceAddress + '?SERVICE=WMS&REQUEST=GetFeatureInfo&VERSION=' + this.version + '&TRANSPARENT=TRUE' +
            '&LAYERS=' + this.layers + '&STYLES=&FORMAT=image/png&WIDTH=256&HEIGHT=256&SRS=' + this.srs + '&INFO_FORMAT=' +
            this.infoFormat + '&QUERY_LAYERS=' + this.layers + '&X=0&Y=0&BBOX=' + bbox + customParameters;
    };
}

export default WmsFeatureInfoUrlBuilder;