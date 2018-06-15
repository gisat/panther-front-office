import WfsCapabilities from './WfsCapabilities';
import WfsGetFeature from './WfsGetFeature';

class WfsService {
    constructor(url) {
        this._url = url;

        this._capabilities = null;
    }

    get capabilities() {
        return this._capabilities;
    }
    set capabilities(capabilities) {
        this._capabilities = capabilities;
    }

    static create(url) {
        const service = new WfsService(url);
        return service.getCapabilities().then(capabilities => {
            service.capabilities = capabilities;

            return service;
        });
    }

    /**
     * It returns GetCapabilities document for this service.
     * @returns {*}
     */
    getCapabilities() {
        return this.ajax(this._url, {
            method: 'GET',
            data: {
                service: 'WFS',
                version: '1.1.0',
                request: 'GetCapabilities'
            }
        }).then(response => {
            return new WfsCapabilities(response);
        });
    }

    /**
     * It returns GetFeature parsed response.
     * @param layer
     * @param bbox {BoundingBox}
     * @returns {WfsGetFeature}
     */
    getFeature(layer, bbox) {
        return this.ajax(this._url, {
            method: 'GET',
            data: {
                service: 'WFS',
                version: '1.1.0',
                request: 'GetFeature',
                typeNames: layer,
                bbox: `${bbox.minLatitude},${bbox.minLongitude},${bbox.maxLatitude},${bbox.maxLongitude}`
            }
        }).then(response => {
            return new WfsGetFeature(response);
        });
    }

    transaction() {

    }

    ajax(url, options) {
        return $.ajax(url, options);
    }
}

export default WfsService;