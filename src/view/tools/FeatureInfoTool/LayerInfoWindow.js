import ArgumentError from '../../../error/ArgumentError';
import Logger from '../../../util/Logger';

import utils from '../../../util/dataMining';
import Collapse from '../../components/Collapse/Collapse';
import FeatureInfoWindow from './FeatureInfoWindow';
import Table from '../../table/Table'

import './LayerInfoWindow.css';

let polyglot = window.polyglot;

/**
 *
 * @param options
 * @param options.store
 * @param options.store.state {StateStore}
 * @constructor
 */
class LayerInfoWindow extends FeatureInfoWindow {
    constructor(options) {
        super(options);

        if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'LayerInfoWindow', 'constructor', 'Stores must be provided'));
        }
        if(!options.store.state){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'LayerInfoWindow', 'constructor', 'Store state must be provided'));
        }

        this._store = options.store;
    }

    /**
     * Rebuild window with current data
     * @param data {Array}
     */
    rebuild(data) {
        if (data.length) {
            let screenPos = data[0].options.screenCoordinates;
            let layersData = this.prepareData(data);
            if (layersData.length) {
                this.setVisibility("show");
                this.setScreenPosition(screenPos.x, screenPos.y, true);
                this.redrawWindow(layersData);
            } else {
                this.setVisibility("hide");
            }
        } else {
            this.setVisibility("hide");
        }
    };

    /**
     * Redraw content of info window
     * @param data {Array} list of layers
     */
    redrawWindow(data) {
        this._infoWindowBodySelector.html("");
        let self = this;
        let counter = 0;
        data.forEach(function (layer, index) {
            if (layer.layers !== "selectedAreasFilled") {
                counter++;
                let id = "layer-info-collapse-" + index;
                let collapse = new Collapse({
                    title: layer.name,
                    id: id,
                    containerSelector: self._infoWindowBodySelector,
                    open: false,
                    customClasses: 'layer-info-collapse'
                });

                // add content to collapse body
                let bodySelector = collapse.getBodySelector();
                let table = self.renderTable(id, bodySelector.attr("id"));
                let layerInfo = self.cleanProjectSpecificData(layer);
                table.appendContent(layerInfo);
            }
        });
        if (counter === 0) {
            this._infoWindowBodySelector.append('<p>' + polyglot.t("layerInfoDetails") + '</p>');
        }
    };

    /**
     * Prepare data for feature info window content. Filter layers without single feature.
     * @param data {Array} original data
     * @returns {Array} prepared data
     */
    prepareData(data) {
        let dataPerLayer = [];
        data.forEach(function (content) {
            let layerData = content.options;
            let featureInfo = content.featureInfo;

            if (typeof featureInfo === 'string') {
                let isJson = utils.isJson(featureInfo);
                if (isJson) {
                    featureInfo = JSON.parse(content.featureInfo);
                    layerData.queryable = true;
                } else {
                    layerData.queryable = false;
                }
            }

            if (featureInfo.features && featureInfo.features.length) {
                let featureProperties = featureInfo.features[0].properties;
                if (featureProperties) {
                    layerData.featureProperties = featureProperties;
                    delete layerData.position;
                    delete layerData.screenCoordinates;
                }
            } else {
                delete layerData.position;
                delete layerData.screenCoordinates;
                if (layerData.queryable) {
                    layerData.featureProperties = polyglot.t("layerFeatureMissed");
                } else {
                    layerData.featureProperties = polyglot.t("notQueryableLayerInfo");
                }
            }
            dataPerLayer.push(layerData);
        });
        return dataPerLayer;
    };

    /**
     * Clean data for project specific layers
     * @param data {Object} info about layer
     * @returns {Object} original or cleaned info about layer
     */
    cleanProjectSpecificData(data) {
        let layerInfo = {};
        if (data.serviceAddress) {
            let properties = data.featureProperties;

            // clean data from sentinel hub
            let isFromSentinelHub = data.serviceAddress.includes("sentinel-hub");
            if (isFromSentinelHub) {
                if (properties) {
                    layerInfo.featureProperties = {};
                    if (properties.id) {
                        layerInfo.featureProperties.id = properties.id;
                    }
                    if (properties.date) {
                        layerInfo.featureProperties.date = properties.date;
                    }
                    if (properties.time) {
                        layerInfo.featureProperties.time = properties.time;
                    }
                    if (properties.cloudCoverPercentage || properties.cloudCoverPercentage === 0) {
                        layerInfo.featureProperties.cloudCoverPercentage = properties.cloudCoverPercentage;
                    }
                    return layerInfo;
                }
            }

            // clean data from eagri (LPIS)
            let isFromEagri = data.serviceAddress.includes("eagri");
            if (isFromEagri) {
                layerInfo.name = data.name;
                return layerInfo;
            }

        }
        return data;
    };

    /**
     * @param id {string} Id of the table
     * @param targetId {string} Id of the target
     * @returns {Table}
     */
    renderTable(id, targetId) {
        return new Table({
            elementId: id + "-table",
            targetId: targetId,
            class: 'basic-table'
        });
    };
}

export default LayerInfoWindow;