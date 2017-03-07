define(['./Remote',
		'jquery',
		'underscore'
],function(Remote,

		   $,
		   _){

	/**
	 * Class for data filtering
	 * @constructor
	 */

	var Filter = function(options){
	};

	/**
	 * Filter areas according to values of attributes
	 * @param categories {Array} List of filtering parameters (inputs)
	 * @param type {("amount"|"filter")} type of filter to use
	 * @returns {*|Promise}
	 */
	Filter.prototype.filter = function(categories, type) {
		var params = this.prepareParams();
		var attributes = this.getAttributesFromCategories(categories);
		return $.get( Config.url + "rest/filter/attribute/" + type, {
				areaTemplate: params.areaTemplate,
				periods: params.periods,
				places: params.locations,
				attributes: attributes
			})
			.then(function(response) {
				return response
			});
	};

	/**
	 * Filter for gathering info about given attributes
	 * @param attributes {Array} list of attributes
	 * @param dist {Object} distribution for numeric attributes' histograms
	 * @param dist.type {string} type of distribution
	 * @param dist.classes {number} number of classes
	 * @returns {*|Promise}
	 */
	Filter.prototype.statistics = function(attributes, dist){
		if (!dist){
			dist = {
				type: 'normal',
				classes: 10
			};
		}

		var params = this.prepareParams();
		return $.get( Config.url + "rest/filter/attribute/statistics", {
				areaTemplate: params.areaTemplate,
				periods: params.periods,
				places: params.locations,
				attributes: attributes,
				distribution: dist
			})
			.then(function(response) {
				if (response.hasOwnProperty("attributes")){
					return response.attributes;
				} else {
					return [];
				}
			});
	};

	/**
	 * Filter for featur info functionality
	 * @param attributes {Array} list of attributes for filtering
	 * @param gids {Array} List of units' gids
	 * @returns {*|Promise}
	 */
	Filter.prototype.featureInfo = function(attributes, gids){
		var params = this.prepareParams();

		return $.post( Config.url + "rest/info/attribute", {
				areaTemplate: params.areaTemplate,
				periods: params.periods,
				places: params.locations,
				gid: gids,
				attributes: attributes
			})
			.then(function(response) {
				return response;
			}).catch(function(err){
				throw new Error(err);
			});
	};

	/**
	 * It prepares basics parameters for request
	 * @returns {{areaTemplate: string, locations: [], periods: []}}
	 */
	Filter.prototype.prepareParams = function (){
		var locations;
		if (ThemeYearConfParams.place.length > 0){
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
	Filter.prototype.getAttributesFromCategories = function(categories){
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
						if (categories[key].multioptions){
							values = [];
							$(selector + " > label").each(function(){
								var label = $(this);
								if (label.hasClass("ui-state-active") && label.hasClass("label-multiselect-option")){
									values.push($(this).text());
								}
							});
							if (values.length == 0){
								values.push("");
							}
						}
						else {
							values = [selectEl.val()];
						}
					}
					else if (attribute.about.attributeType == "numeric"){
						var sliderEl = $(selector);
						var min, max;

						if (sliderEl.hasClass("ui-slider")){
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
	Filter.prototype.getOnlyNumericAttributes = function(attributes){
		return _.filter(attributes, function(attribute){
			return attribute.attributeType == "numeric";
		});
	};

	return Filter;
});