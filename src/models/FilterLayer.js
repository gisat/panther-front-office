
import WorldWind from '@nasaworldwind/worldwind';

import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';
import WmsLayer from '../worldwind/layers/MyWmsLayer';

let Location = WorldWind.Location;
let Sector = WorldWind.Sector;


// TODO: Server endpoint.
/**
 * It represents filtered layer
 * @param options {Object}
 * @param options.style {String} Style representation for the server.
 * @param options.serverUrl {String} Url of the server.
 * @param options.wmsUrl {String} Url of the GeoServer used for the layer itself.
 * @param options.stateStore {StateStore} Store for retrieval of current state.
 * @constructor
 */
let $ = window.$;
class FilterLayer {
    constructor(options) {
        if (!options.style || !options.wmsUrl || !options.serverUrl || !options.stateStore) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'FilterLayer', 'constructor', 'Incorrect parameters'));
        }

        this._style = options.style;

        this._wmsUrl = options.wmsUrl;
        this._baseServerUrl = options.serverUrl;
        this._serverUrl = options.serverUrl + 'rest/geoserver/layer';

        this._stateStore = options.stateStore;

        this._layer = null;
        this._styleId = null;
    };

    /**
     * It saves the current layer and returns layer to display.
     * @returns {Promise}
     */
    save() {
        let self = this;
        let currentState = this._stateStore.current();
        return $.post(this._serverUrl, {
            style: this._style,
            places: currentState.places,
            analyticalUnitLevel: currentState.analyticalUnitLevel
        }).then(function (result) {
            self._layer = result.layer;
            self._styleId = result.styleId;

            return self.wms(result.layer, result.styleId);
        });
    };

    /**
     * It cleans the layer from the server.
     * @returns {*}
     */
    delete() {
        if (!this._layer || !this._styleId) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'FilterLayer', 'delete', "The layer wasn't saved"));
        }

        return $.ajax({
            url: this._serverUrl,
            method: 'DELETE',
            data: {
                styleId: this._styleId,
                layer: this._layer
            }
        });
    };

    /**
     * It returns WMS representation of this layer. Maybe it will be exposed at some time.
     * @param layer {String} String representing queried layers
     * @param styleId {String} Id of the style used for the query
     * @private
     */
    wms(layer, styleId) {
        this._wmsLayer = layer;
        this._styleId = styleId;

        return new WmsLayer({
            service: this._wmsUrl,
            // This is what is missing
            layerNames: layer,
            sector: new Sector(-90, 90, -180, 180),
            levelZeroDelta: new Location(45, 45),
            numLevels: 14,
            format: "image/png",
            size: 256,
            version: "1.1.1",
            styleNames: styleId,
            opacity: 0.7
        });
    };

    serialize = function () {
        return {
            wmsLayer: this._wmsLayer,
            styleId: this._styleId,

            style: this._style,
            wmsUrl: this._wmsUrl,
            serverUrl: this._baseServerUrl,
        }
    };

    static deserialize(serialized, stateStore) {
        let layer = new FilterLayer({
            style: serialized.style,
            serverUrl: serialized.serverUrl,
            stateStore: stateStore,
            wmsUrl: serialized.wmsUrl
        });

        layer._wmsLayer = serialized.wmsLayer;
        layer._styleId = serialized.styleId;

        return layer;
    };
}

export default FilterLayer;