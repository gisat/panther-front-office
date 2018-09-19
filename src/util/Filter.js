
import _ from 'underscore';
import lodash from 'lodash';

import Actions from '../actions/Actions';
import ArgumentError from '../error/ArgumentError';
import Color from './Color';
import Logger from './Logger';

let OneLevelAreas = window.OneLevelAreas;
let Config = window.Config;
let Select = window.Select;
let ThemeYearConfParams = window.ThemeYearConfParams;

/**
 * Class for data filtering
 * @param options {Object}
 * @param options.dispatcher (Object) Object for dispatching actions.
 * @param options.store {Object}
 * @param options.store.state {StateStore}
 * @constructor
 */

let $ = window.$;
class Filter {
    constructor(options) {
        if (!options.store) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'Filter', 'constructor', 'Stores must be provided'));
        }
        if (!options.store.state) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'Filter', 'constructor', 'Store state must be provided'));
        }

        this._dispatcher = options.dispatcher;
        this._store = options.store;
    };

    /**
     * Filter areas according to values of attributes
     * @param categories {Array} List of filtering parameters (inputs)
     * @param type {("amount"|"filter")} type of filter to use
     * @returns {*|Promise}
     */
    filter(categories, type) {
        let params = this.prepareParams();
        let attributes = this.getAttributesFromCategories(categories);
        this._updateReduxState(attributes);

        if (OneLevelAreas.hasOneLevel && type === 'filter') {
            let rgbColor = $('.x-color-picker .x-color-picker-selected span').css('background-color');
            let color = new Color(rgbColor).hex();

            this._dispatcher.notify(Actions.filterAdd, {
                color: color,
                attributes: attributes
            });

            return Promise.resolve([]);
        } else {
            return $.post(Config.url + "rest/filter/attribute/" + type, {
                areaTemplate: params.areaTemplate,
                periods: params.periods,
                places: params.locations,
                attributes: attributes
            });
        }
    };

    /**
     * Filter for gathering info about given attributes
     * @param attributes {Array} list of attributes
     * @param dist {Object} distribution for numeric attributes' histograms
     * @param dist.type {string} type of distribution
     * @param dist.classes {number} number of classes
     * @returns {*|Promise}
     */
    statistics(attributes, dist) {
        if (!dist) {
            dist = {
                type: 'normal',
                classes: 10
            };
        }

        let params = this.prepareParams();
        return $.post(Config.url + "rest/filter/attribute/statistics", {
            areaTemplate: params.areaTemplate,
            periods: params.periods,
            places: params.locations,
            attributes: attributes,
            distribution: dist
        })
            .then(function (response) {
                if (response.hasOwnProperty("attributes")) {
                    return response.attributes;
                } else {
                    return [];
                }
            });
    };

    /**
     * Filter for feature info functionality
     * @param attributes {Array} list of attributes for filtering
     * @param gid {number|string} Unit gid
     * @param periods {Array} List of periods
     * @returns {*|Promise}
     */
    featureInfo(attributes, gid, periods) {
        let state = this._store.state.current();
        let places = state.places;
        if (!places || places[0] === "All places") {
            places = state.allPlaces;
        }

        return $.post(Config.url + "rest/info/attribute", {
            areaTemplate: state.currentAuAreaTemplate,
            periods: periods,
            places: places,
            gid: gid,
            attributes: attributes
        })
            .then(function (response) {
                return response;
            }).catch(function (err) {
                throw new Error(err);
            });
    };

    /**
     * It prepares basics parameters for request
     * @returns {{areaTemplate: string, locations: [], periods: []}}
     */
    prepareParams() {
        let locations;
        if (ThemeYearConfParams.place.length > 0) {
            locations = [Number(ThemeYearConfParams.place)];
        } else {
            locations = ThemeYearConfParams.allPlaces;
        }
        return {
            areaTemplate: ThemeYearConfParams.auCurrentAt,
            locations: locations,
            periods: JSON.parse(ThemeYearConfParams.years)
        }
    };

    /**
     * Prepare list of attributes for filtering from given categories
     * @param categories {Array} List of filtering parameters (inputs)
     * @returns {Array} List of attributes
     */
    getAttributesFromCategories(categories) {
        let attributes = [];

        for (let key in categories) {
            if (categories[key].hasOwnProperty('attrData')) {
                if (categories[key].active === true) {
                    let attribute = categories[key].attrData;
                    let selector = "#input-as-" + attribute.about.attributeSet + "-attr-" + attribute.about.attribute;
                    let values;
                    let multioptions = false;
                    if (attribute.about.attributeType === "boolean") {
                        let checkboxEl = $(selector);
                        values = checkboxEl.hasClass("checked");
                    }
                    else if (attribute.about.attributeType === "text") {
                        let selectEl = $(selector);
                        if (categories[key].multioptions) {
                            values = [];
                            multioptions = true;
                            $(selector + " > label").each(function () {
                                let label = $(this);
                                if (label.hasClass("ui-state-active") && label.hasClass("label-multiselect-option")) {
                                    values.push($(this).text());
                                }
                            });
                            if (values.length === 0) {
                                values.push("");
                            }
                        }
                        else {
                            values = [selectEl.val()];
                        }
                    }
                    else if (attribute.about.attributeType === "numeric") {
                        let sliderEl = $(selector);
                        let min, max;

                        if (sliderEl.hasClass("ui-slider")) {
                            let val = sliderEl.slider("values");
                            min = val[0] - 0.005;
                            max = val[1] + 0.005;
                        } else {
                            min = attribute.values[0] - 0.005;
                            max = attribute.values[1] + 0.005;
                        }
                        values = [min, max];
                    }

                    let attr = {
                        attribute: attribute.about.attribute,
                        attributeType: attribute.about.attributeType,
                        name: key,
                        attributeSet: attribute.about.attributeSet,
                        value: values
                    };
                    if (multioptions){
                        attr.multioptions = true;
                    }
                    attributes.push(attr);
                }
            }
        }

        return attributes;
    };

    /**
     * Return only numeric attributes from a list
     * @param attributes {Array} list of all atributes
     * @returns {Array} numeric attributes
     */
    getOnlyNumericAttributes(attributes) {
        return _.filter(attributes, function (attribute) {
            return attribute.attributeType === "numeric";
        });
    };


	_updateReduxState(attributes){
		let attributeFilter = attributes.map((attribute) => {
			let type = attribute.attributeType;
			let filter = {
				attribute: attribute.attribute,
				attributeSet: attribute.attributeSet,
				attributeType: type
			};
			if (type === 'numeric'){
				filter.intervals = attribute.value;
			} else if (type === 'text'){
				filter.values = attribute.value;
				if (attribute.multioptions){
				    filter.multioptions = true;
                }
			}
			return filter;
        });
		window.Stores.notify("SELECTIONS_FILTER_UPDATE_BY_COLOUR", {
		    colour: Select.actualColor,
            attributeFilter: attributeFilter
        });
	}
}

export default Filter;