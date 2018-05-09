import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';
import DataMining from '../../util/dataMining';

let Observer = window.Observer;
let OlMap = window.OlMap;
let OpenLayers = window.OpenLayers;

/**
 * Class for handling with map
 * @param options {Object}
 * @param options.map {Object} Open Layers map
 * @param options.store {Object}
 * @param options.store.state {StateStore}
 * @constructor
 */
class Map {
    constructor(options) {
        if (!options.store) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'Map', 'constructor', 'Stores must be provided'));
        }
        if (!options.store.state) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'Map', 'constructor', 'Store state must be provided'));
        }

        this._map = options.map;
        this._layers = [];

        this._store = options.store;
        this._dataMining = new DataMining({
            store: {
                state: options.store.state
            }
        })
    };

    rebuild() {
        if (!this._map) {
            Observer.notify("getMap");
            this._map = OlMap.map;
            this._map2 = OlMap.map2;
        }
    };

    /**
     * Add layer to map
     * @param data {Array}
     * @param color {String}
     * @param name {String}
     */
    addLayer(data, color, name) {
        let vectorLayer = this.createVectorLayer(color, name);
        vectorLayer = this.addFeaturesToVectorLayer(vectorLayer, data);

        if (!this._layers[color]) {
            this._layers[color] = [];
        }
        this._layers[color].push(vectorLayer);
        this._map.addLayer(vectorLayer);
    };


    /**
     * Create vector layer
     * @param color {String}
     * @param name {String}
     * @returns {*}
     */
    createVectorLayer(color, name) {
        return new OpenLayers.Layer.Vector(name, {
            styleMap: this.setStyle(color)
        });
    };

    /**
     * Add features to vector layer
     * @param vectorLayer {Object}
     * @param data {Array}
     * @returns {*}
     */
    addFeaturesToVectorLayer(vectorLayer, data) {
        let features = [];
        let self = this;
        data.forEach(function (area) {
            let attr = {};
            if (area.hasOwnProperty("uuid")) {
                attr.uuid = area.uuid;
            }
            let style = self.prepareStyle("#FA6900", area.name);
            let feature = self.createVectorFeatruefromWKT(area.geometry, attr, style);
            features.push(feature);
        });
        vectorLayer.addFeatures(features);
        vectorLayer.redraw();
        return vectorLayer;
    };

    /**
     *
     * @param geom {string} WKT geometry format
     * @returns {*}
     */
    createVectorFeatruefromWKT(geom, attributes, style) {
        return new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.fromWKT(geom), attributes, style
        );
    };

    /**
     * Set z index of given layer
     * @param layer {OpenLayers.Layer}
     * @param zIndex {number}
     */
    setLayerZIndex(layer, zIndex) {
        this._map.setLayerZIndex(layer, zIndex);
    };

    /**
     * Add
     * @returns {*}
     */
    setStyle(color) {
        return new OpenLayers.StyleMap(this.prepareStyle(color));
    };

    prepareStyle(color, label) {
        let style = {
            strokeWidth: 4,
            strokeColor: color,
            fillColor: color,
            fillOpacity: 0.3,
            fontColor: "#333",
            fontSize: "16px",
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
            fontStyle: "italic"
        };
        if (label) {
            style.label = label;
            style.labelOutlineColor = "white";
            style.labelOutlineWidth = 3;
        }
        return style;
    };

    /**
     * Remove all previously added layers from map
     */
    removeLayers(color) {
        if (!this._layers[color]) {
            return;
        }

        let self = this;
        this._layers[color].forEach(function (layer) {
            self._map.removeLayer(layer);
            self._layers.pop();
        });
    };

    /**
     * Get feature by id
     * @param id {string} id of the feature
     * @param layer {OpenLayers.Layer.Vector}
     * @returns {OpenLayers.Feature}
     */
    getFeatureById(id, layer) {
        return layer.getFeatureById(id);
    };

    /**
     * Get features by atributte value
     * @param attrName {string} name of the attribute
     * @param attrValue {string} value of the attribute
     * @param layer {OpenLayers.Layer.Vector}
     */
    getFeaturesByAttribute(attrName, attrValue, layer) {
        return layer.getFeaturesByAttribute(attrName, attrValue);
    };
}

export default Map;