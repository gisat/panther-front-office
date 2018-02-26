define([
	'../actions/Actions',
	'../error/ArgumentError',
	'./Color',
	'../util/Logger',
	'./Remote',

	'jquery',
	'underscore'
], function (Actions,
			 ArgumentError,
			 Color,
			 Logger,
			 Remote,

			 $,
			 _) {

	/**
	 * Class for data filtering
	 * @param options {Object}
	 * @param options.dispatcher (Object) Object for dispatching actions.
	 * @param options.store {Object}
	 * @param options.store.state {StateStore}
	 * @constructor
	 */

	var Filter = function (options) {
        if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'Filter', 'constructor', 'Stores must be provided'));
        }
        if(!options.store.state){
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
	Filter.prototype.filter = function (categories, type) {
		var params = this.prepareParams();
		var attributes = this.getAttributesFromCategories(categories);

		if (OneLevelAreas.hasOneLevel && type == 'filter') {
			var rgbColor = $('.x-color-picker .x-color-picker-selected span').css('background-color');
			var color = new Color(rgbColor).hex();

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
	Filter.prototype.statistics = function (attributes, dist) {
		if (!dist) {
			dist = {
				type: 'normal',
				classes: 10
			};
		}

		var params = this.prepareParams();
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
	Filter.prototype.featureInfo = function (attributes, gid, periods) {
		var state = this._store.state.current();
		var places = state.places;
		if (!places || places[0] === "All places"){
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
	Filter.prototype.prepareParams = function () {
		var locations;
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
	Filter.prototype.getAttributesFromCategories = function (categories) {
		var attributes = [];

		for (var key in categories) {
			if (categories[key].hasOwnProperty('attrData')) {
				if (categories[key].active == true) {
					var attribute = categories[key].attrData;
					var selector = "#input-as-" + attribute.about.attributeSet + "-attr-" + attribute.about.attribute;
					var values;
					if (attribute.about.attributeType == "boolean") {
						var checkboxEl = $(selector);
						values = checkboxEl.hasClass("checked");
					}
					else if (attribute.about.attributeType == "text") {
						var selectEl = $(selector);
						if (categories[key].multioptions) {
							values = [];
							$(selector + " > label").each(function () {
								var label = $(this);
								if (label.hasClass("ui-state-active") && label.hasClass("label-multiselect-option")) {
									values.push($(this).text());
								}
							});
							if (values.length == 0) {
								values.push("");
							}
						}
						else {
							values = [selectEl.val()];
						}
					}
					else if (attribute.about.attributeType == "numeric") {
						var sliderEl = $(selector);
						var min, max;

						if (sliderEl.hasClass("ui-slider")) {
							var val = sliderEl.slider("values");
							min = val[0] - 0.005;
							max = val[1] + 0.005;
						} else {
							min = attribute.values[0] - 0.005;
							max = attribute.values[1] + 0.005;
						}
						values = [min, max];
					}

					var attr = {
						attribute: attribute.about.attribute,
						attributeType: attribute.about.attributeType,
						name: key,
						attributeSet: attribute.about.attributeSet,
						value: values
					};
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
	Filter.prototype.getOnlyNumericAttributes = function (attributes) {
		return _.filter(attributes, function (attribute) {
			return attribute.attributeType == "numeric";
		});
	};

	return Filter;
});