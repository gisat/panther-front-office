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
let proj4;
class WmsFeatureInfoUrlBuilder {
    constructor(options) {
        proj4 = window.proj4;
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
        let position = this.position;
        if (this.srs !== 'EPSG:4326') {
            position = this.transform(position);
        }

        let bbox = position.longitude + ',' + position.latitude + ',' + (Number(position.longitude) + 0.000001) +
			',' + (Number(position.latitude) + 0.000001);

        let customParameters = '';
        Object.keys(this.customParameters).forEach(function (key) {
            customParameters += '&' + key + '=' + this.customParameters[key];
        }.bind(this));

        return this.serviceAddress + '?SERVICE=WMS&REQUEST=GetFeatureInfo&VERSION=' + this.version + '&TRANSPARENT=TRUE' +
            '&LAYERS=' + this.layers + '&STYLES=&FORMAT=image/png&WIDTH=256&HEIGHT=256&SRS=' + this.srs + '&INFO_FORMAT=' +
            this.infoFormat + '&QUERY_LAYERS=' + this.layers + '&X=0&Y=0&BBOX=' + bbox + customParameters;
    };

    transform (position) {
        let source = new proj4.Proj('EPSG:4326');
        let dest = new proj4.Proj(this.srs);

        let oldPosition = new proj4.Point(position.longitude, position.latitude);
        let newPosition = proj4.transform(source, dest, oldPosition);

        return {
            latitude: newPosition.y,
            longitude: newPosition.x
        }
    };
}

export default WmsFeatureInfoUrlBuilder;