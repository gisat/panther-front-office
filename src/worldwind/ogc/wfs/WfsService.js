import WorldWind from '@nasaworldwind/worldwind';

const Logger = WorldWind.Logger;

class WfsService {
    constructor(url, capabilities) {
        this._url = url;

        this._capabilities = capabilities;
    }

    static create(url) {
        return this.ajax(this._url + '', {
            method: 'GET',
            data: {
                service: 'WFS',
                version: '1.1.0',
                request: 'GetCapabilities'
            }
        }).then(response => {
            const capabilities = new WfsCapabilities(response);

            return new WfsService(url, capabilities);
        });
    }

    getCapabilities() {
        return this.ajax(this._url + '', {
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

    getFeature() {

    }

    transaction() {

    }
}

export default WfsService;