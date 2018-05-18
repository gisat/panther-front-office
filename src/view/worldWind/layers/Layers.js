import _ from 'underscore';

import WorldWind from '@nasaworldwind/worldwind';

import ArgumentError from '../../../error/ArgumentError';
import Logger from '../../../util/Logger';
import MyOsmLayer from '../../../worldwind/layers/MyOsmLayer';
import MyOsmCartoLayer from '../../../worldwind/layers/MyOsmCartoLayer';
import MyWmsLayer from '../../../worldwind/layers/MyWmsLayer';
import MercatorLayer from '../../../worldwind/layers/MercatorLayer';

let Config = window.Config;

/**
 * This class is intended for operations with layers
 * @param wwd {WorldWindow}
 * @param options {Object}
 * @param options.selectController {SelectionController}
 * @param options.name {String}
 * @constructor
 */
class Layers {
    constructor(wwd, options) {
        if (!wwd) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Layers", "constructor", "missingWorldWind"));
        }
        this._wwd = wwd;
        this._layers = [];

        /**
         * It handles selection in the map based on the user interactions.
         * @type {SelectionController}
         */
        if (options){
			this.controller = options.selectController;
			this.name = options.name;
        }

        this.addBaseLayer();
    };


    addBaseLayer() {
        this._wwd.addLayer(new MyOsmLayer({
            attribution: "\u00A9 Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL",
            source: "http://a.basemaps.cartocdn.com/light_nolabels/"
        }));
    };

    /**
     * Add layer to the list of layers
     * @param layer {WorldWind.Layer}
     */
    addLayer(layer) {
        this._layers.push(layer);
        if (layer.hasOwnProperty("metadata") && layer.metadata.active) {
            this.addLayerToMap(layer);
        }
    };

    /**
     * Add layer to the map
     * @param layer {WorldWind.Layer}
     * @param order {number} order of the layer among other layers
     */
    addLayerToMap(layer, order) {
        let position = this.findLayerZposition(order, layer);
        console.log(`Layers#addLayerToMap Layer: `, layer, ` Order: `, order, ` Name: `, this.name, ` Position: `, position);
        this._wwd.insertLayer(position, layer);
        console.log(`Layers#addLayerToMap `,this._wwd.layers);
        this._wwd.redraw();
    };

    /**
     * TODO: Figure how do you handle the layers from other areas and panels. At the moment, the ordered layers will be on the bottom.
     * @param order {Number} order in 2D
     * @param currentLayer {WorldWind.Layer} layer being inserted
     * @returns {Number} position in world wind layers
     */
    findLayerZposition(order, currentLayer) {
        let layers = this._wwd.layers;
        let position = null;

        layers.forEach(function(layer, index){
            if(!layer.metadata || !layer.metadata.group) {
                position = index;
            }
        });
        // Find the first which has metadata.group
        // If there is no specific place to put the layer add it as last.
        if (currentLayer.metadata.order !== null && currentLayer.metadata.order < layers.length && !(currentLayer.metadata.group === "areaoutlines") && !(currentLayer.metadata.group === "selectedareasfilled")){
            position = position += currentLayer.metadata.order;
        } else {
            position = layers.length;
        }

        // push layer just under AU layer
        if (!currentLayer.metadata || !currentLayer.metadata.group || !((currentLayer.metadata.group === "areaoutlines") || (currentLayer.metadata.group === "selectedareasfilled"))){
            if (position > 0){
                layers.forEach(function(layer){
                    if (layer.metadata && (layer.metadata.group === "areaoutlines" || layer.metadata.group === "selectedareasfilled")){
                        position--;
                    }
                });
            }
        }

        return position;
    };

    /**
     * Get all layers from a group
     * @param group {string} name of the group
     * @returns {Array} list of layers
     */
    getLayersByGroup(group) {
        return _.filter(this._layers, function (layer) {
            return layer.metadata.group === group;
        });
    };

    /**
     * Get a layer by given id
     * @param id {string} id of the layer
     * @returns {WorldWind.Layer}
     */
    getLayerById(id) {
        return _.filter(this._layers, function (layer) {
            return layer.metadata.id === id;
        })[0];
    };

    /**
     * Remove layer from the list of layers
     * @param layer {WorldWind.Layer}
     */
    removeLayer(layer, redraw) {
        this._layers = _.filter(this._layers, function (item) {
            return item.metadata.id !== layer.metadata.id;
        });
        this.removeLayerFromMap(layer, redraw);
    };

    /**
     * Get AU layer, if it is present on map
     * @returns {WorldWind.Layer}
     */
    getAuLayer() {
        return _.filter(this._layers, function (item) {
            return item.metadata.id === "areaoutlines";
        });
    };

    /**
     * Remove layer from map
     * @param layer {WorldWind.Layer}
     */
    removeLayerFromMap(layer, redraw) {
        this._wwd.removeLayer(layer);
        if (redraw !== false) {
            this._wwd.redraw();
        }
    };

    /**
     * Remove all layers from given group
     * @param group {string} name of the group
     */
    removeAllLayersFromGroup(group, redraw) {
        let layers = this.getLayersByGroup(group);
        let self = this;
        layers.forEach(function (layer) {
            self.removeLayer(layer, redraw);
        });
    };

    /**
     * Show the layer in map
     * @param id {string} Id of the layer
     * @param order {number} order of the layer among other layers
     */
    showLayer(id, order) {
        let layer = this.getLayerById(id);
        if (layer){
			layer.metadata.active = true;
			layer.metadata.order = order;
			this.addLayerToMap(layer, order);
        }
    };

    /**
     * Hide the layer from map
     * @param id {string} Id of the layer
     */
    hideLayer(id) {
        let layer = this.getLayerById(id);
        if (layer){
			layer.metadata.active = false;
			this.removeLayerFromMap(layer);
        }
    };

    /**
     * Show background layer
     * @param id {string}
     */
    showBackgroundLayer(id) {
        let layer = this.getLayerById(id);
		if (layer){
			layer.enabled = true;
		}
    };

    /**
     * Hide background layer
     * @param id {string}
     */
    hideBackgroundLayer(id) {
        let layer = this.getLayerById(id);
        if(layer) {
            layer.enabled = false;
        }
    };

    /**
     * Create base layer according to id and add it to the map.
     * @param id {string}
     * @param group {string} name of the group
     */
    addBackgroundLayer(id, group) {
        let layer;
        switch (id) {
            case "bingRoads":
                layer = new WorldWind.BingRoadsLayer();
                break;
            case "bingAerial":
                layer = new WorldWind.BingAerialLayer();
                break;
            case "osm":
                layer = new MyOsmLayer({
                    attribution: "\u00A9 OpenStreetMap contributors",
                    source: "http://a.tile.openstreetmap.org/"
                });
                break;
            case "cartoDb":
                layer = new MyOsmCartoLayer({
                    attribution: "\u00A9 Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL",
                    source: "http://a.basemaps.cartocdn.com/light_all/"
                });
                break;
            case "landsat":
                layer = new WorldWind.BMNGLandsatLayer();
                break;
            case "cuzkOrto":
                layer = new MyWmsLayer({
                    service: "http://geoportal.cuzk.cz/WMS_ORTOFOTO_PUB/WMService.aspx?",
                    layerNames: "GR_ORTFOTORGB",
                    sector: new WorldWind.Sector(-90, 90, -180, 180),
                    levelZeroDelta: new WorldWind.Location(45, 45),
                    numLevels: 14,
                    format: "image/png",
                    opacity: 1,
                    size: 256,
                    version: "1.3.0"
                });
                break;
            case "lpisOrto":
                layer = new MyWmsLayer({
                    service: "http://eagri.cz/public/app/wms/plpis.fcgi?",
                    layerNames: "ILPIS_RASTRY",
                    sector: new WorldWind.Sector(-90, 90, -180, 180),
                    levelZeroDelta: new WorldWind.Location(45, 45),
                    numLevels: 14,
                    format: "image/png",
                    opacity: 1,
                    size: 256,
                    version: "1.3.0"
                });
                break;
            case "sentinel2":
                layer = new MyWmsLayer({
                    service: "https://tiles.maps.eox.at/wms",
                    layerNames: "s2cloudless",
                    sector: new WorldWind.Sector(-90, 90, -180, 180),
                    levelZeroDelta: new WorldWind.Location(45, 45),
                    numLevels: 19,
                    format: "image/png",
                    opacity: 1,
                    size: 256,
                    version: "1.3.0"
                });
                break;
            default:
                break;
        }
        layer.metadata = {
            active: true,
            id: id,
            group: group
        };
        this.addLayer(layer);
    };

    /**
     * Add WMS layer to the list of layers
     * @param layerData {Object} info about layer retrieved from server
     * @param group {string} name of the group
     * @param state {boolean} true, if the layer should be displayed
     */
    addWmsLayer(layerData, group, state) {
        var layer;
        if(layerData.customParams && layerData.customParams.crs === 'EPSG:3857') {
            layer = new MercatorLayer({
                service: layerData.url,
                layerNames: layerData.layerPaths,
                numLevels: 19,
                format: "image/png",
                opacity: 1,
                size: 256,
                version: "1.1.1",
                customParams: layerData.customParams
            }, null);
            layer.urlBuilder.version = "1.1.1";
            layer.metadata = {
                active: state,
                name: layerData.name,
                id: layerData.id,
                group: group,
                order: layerData.order
            };
            this.addLayer(layer);
        } else {
            layer = new MyWmsLayer({
                service: layerData.url,
                layerNames: layerData.layerPaths,
                sector: new WorldWind.Sector(-90, 90, -180, 180),
                levelZeroDelta: new WorldWind.Location(90, 90),
                numLevels: 18,
                format: "image/png",
                opacity: 1,
                size: 256,
                version: "1.1.1",
                customParams: layerData.customParams
            }, null);
            layer.urlBuilder.version = "1.1.1";
            layer.metadata = {
                active: state,
                name: layerData.name,
                id: layerData.id,
                group: group,
                order: layerData.order
            };
            this.addLayer(layer);
        }
    };

    /**
     * Add info layer to the list of layers
     * @param layerData {Object}
     * @param group {string} name of the group
     * @param state {boolean} true, if the layer should be displayed
     */
    addInfoLayer(layerData, group, state) {
        let layer = new MyWmsLayer({
            service: Config.url + "api/proxy/wms",
            layerNames: layerData.layerPaths,
            sector: new WorldWind.Sector(-90, 90, -180, 180),
            levelZeroDelta: new WorldWind.Location(45, 45),
            opacity: layerData.opacity || .7,
            numLevels: 22,
            format: "image/png",
            size: 256,
            styleNames: layerData.stylePaths
        }, null);
        layer.urlBuilder.wmsVersion = "1.3.0";
        layer.metadata = {
            active: state,
            id: layerData.id,
            name: layerData.name ,
            group: group
        };
        this.addLayer(layer);
    };

    /**
     * Add choropleth layer to the list of layers
     * @param layerData {Object} info about layer retrieved from server
     * @param group {string} name of the group
     * @param state {boolean} true, if the layer should be displayed
     */
    addChoroplethLayer(layerData, group, state) {
        let layer = new MyWmsLayer({
            service: Config.url + "api/proxy/wms",
            sector: new WorldWind.Sector(-90, 90, -180, 180),
            layerNames: layerData.layer,
            levelZeroDelta: new WorldWind.Location(45, 45),
            numLevels: 22,
            opacity: layerData.opacity / 100,
            format: "image/png",
            size: 256,
            sldId: layerData.sldId
        }, null);
        layer.urlBuilder.wmsVersion = "1.3.0";
        layer.metadata = {
            active: state,
            id: layerData.id,
            name: layerData.name,
            group: group,
            sldId: layerData.sldId
        };
        this.addLayer(layer);
    };

    /**
     * Add analytical units layer to the list of layers.
     * @param layerData {Object} info about layer retrieved from server
     * @param group {string} name of the group
     * @param state {boolean} true, if the layer should be displayed
     */
    addAULayer(layerData, group, state) {
        let styles = [];
        let layerNames = layerData.data.namedLayers.map(function (layer) {
            styles.push("outlines");
            return layer.name;
        }).join(',');
        let layer = new MyWmsLayer({
            service: Config.geoServerUrl,
            sector: new WorldWind.Sector(-90, 90, -180, 180),
            layerNames: layerNames,
            levelZeroDelta: new WorldWind.Location(45, 45),
            numLevels: 22,
            opacity: layerData.opacity / 100,
            format: "image/png",
            size: 256,
            styleNames: styles.join(','),
            version: "1.1.0"
        }, null);
        layer.urlBuilder.wmsVersion = "1.1.0";
        layer.metadata = {
            active: state,
            id: layerData.id,
            name: layerData.name,
            group: group,
            style: 'outlines'
        };
        this.addLayer(layer);
    };
}

export default Layers;