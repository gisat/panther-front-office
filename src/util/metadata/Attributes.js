import _ from 'underscore';

import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';
import Remote from '../../util/Remote';

/**
 * Class for gathering attributes metadata
 * @constructor
 * @param options {Object}
 * @param options.dispatcher {Object}
 * @param options.store {Object}
 * @param options.store.attributeSets {AttributeSets}
 * @param options.store.attributes {Attributes}
 */

class Attributes {
    constructor(options) {
        if(!options.dispatcher){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'Attributes', 'constructor', 'Dispatcher must be provided'));
        }
        if (!options.store) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'Attributes', 'constructor', 'Stores must be provided'));
        }
        if (!options.store.attributes) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'Attributes', 'constructor', 'Store attribute must be provided'));
        }
        if (!options.store.attributeSets) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'Attributes', 'constructor', 'Store attribute set must be provided'));
        }

        this._attributeSets = null;

        this._dispatcher = options.dispatcher;
        this._store = options.store;
    };

    /**
     * It returns information about all attributes grouped by attribute sets
     * @param options {Object}
     * @param options.config {Object} current ThemeYearConf global object configuration
     * @param options.changes {Object} object detecting the changes in configuration
     * @returns {Promise}
     */
    getData(options) {
        let self = this;
        let params = self.getThemeYearConfParams(options.config);
        if (_.isEmpty(params)) {
            return new Promise(function (resolve, reject) {
                //ThemeYearConfParams.datasetChanged = false;
                resolve(params);
            })
        }
        else if (options.changes.scope || options.changes.theme || options.changes.place || options.changes.location) {
            //ThemeYearConfParams.datasetChanged = false;
            return new Remote({
                method: "POST",
                url: window.Config.url + "api/theme/getThemeYearConf",
                params: self.getThemeYearConfParams(options.config)
            }).then(function (response) {
                let output = JSON.parse(response);
                if (output.data.hasOwnProperty("attrSets")) {
                    self._attributeSets = output.data.attrSets;
                }
                self._dispatcher.notify("attributeSets#updateActive", {attributeSets: self._attributeSets});
                return self.getAttributesFromAllAttributeSets(self._attributeSets);
            });
        }
        else {
            this._dispatcher.notify("attributeSets#updateActive", {attributeSets: this._attributeSets});
            return this.getAttributesFromAllAttributeSets(this._attributeSets);
        }
    };

    /**
     * It returns a Promise of attributes metadata for all attribute sets
     * @param attributeSets {Array} Ids of attribute sets
     * @returns {Promise}
     */
    getAttributesFromAllAttributeSets(attributeSets) {
        let self = this;
        return Promise.all(attributeSets.map(self.getAttributeSet.bind(self)));
    };

    /**
     * Get attribute set data
     *
     * @param attributeSet {number} ID of attribute set
     * @returns {*|Promise}
     */
    getAttributeSet(attributeSet) {
        let self = this;
        return this._store.attributeSets.byId(attributeSet).then(function (attrSet) {
            return attrSet[0];
        }).then(self.getAttributesFromAttributeSet.bind(self));
    };

    /**
     * Return the data of all atributes in give attribute set
     * @param attributeSet {Object}
     * @param attributeSet.attributes {Array} IDs of attributes
     * @returns {Promise}
     */
    getAttributesFromAttributeSet(attributeSet) {
        if (!attributeSet) {
            return;
        }
        let self = this;
        return Promise.all(attributeSet.attributes.map(self.getAttribute.bind(self, attributeSet)));
    };

    /**
     * Get the attribute data
     *
     * @param attributeSet {Object} attribute set
     * @param attributeSet.id {number} attribute set id
     * @param attributeSet.name {string} attribute set name
     * @param attribute {number} id of the attribute
     * @returns {*|Promise}
     */
    getAttribute(attributeSet, attribute) {
        let self = this;
        return this._store.attributes.byId(attribute).then(
            self.getAttributeDataByType.bind(self, attributeSet)
        );
    };

    /**
     * Use the filter according to attribute type and return the attribute data
     *
     * @param attributeSet {Object} attribute set
     * @param attributeSet.id {number} attribute set id
     * @param attributeSet.name {string} attribute set name
     * @param attribute {Object[]} attribute
     * @param attribute.id {number} attribute id
     * @param attribute.name {string} attribute name
     * @param attribute.type {('numeric'|'text'|'boolean')} attribute type
     * @param attribute.standardUnits {string}
     * @param attribute.units {string}
     * @returns {Object|Promise}
     */
    getAttributeDataByType(attributeSet, attribute) {
        let attr = attribute[0];
        let params = {};
        if (attr) {
            params = {
                attribute: attr.id,
                attributeName: attr.name,
                attributeType: attr.type,
                attributeSet: attributeSet.id,
                attributeSetName: attributeSet.name,
                standardUnits: attr.standardUnits,
                units: attr.units,
                color: attr.color,
                active: true
            }
        }
        return params;
    };

    /**
     * It prepares the parameters for getThemeYearConf request
     * @param options.config {Object} current ThemeYearConf global object configuration
     * @returns {{theme: string, years: string, dataset: string, refreshLayers: string, refreshAreas: string}}
     */
    getThemeYearConfParams(options) {
        let theme = options.theme;
        let years = options.years;
        let dataset = options.dataset;

        if (theme.length === 0 || years.length === 0 || dataset.length === 0) {
            console.warn(Logger.logMessage(Logger.LEVEL_WARNING, "Attributes", "getThemeYearConfParams", "missingParameter"));
            return {};
        } else {
            return {
                theme: theme,
                years: years,
                dataset: dataset,
                refreshLayers: 'true',
                refreshAreas: 'true'
            };
        }
    };


}

export default Attributes;