define(['./Remote',
		'jquery'
],function(Remote,

		   $){

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
	 * @param gid {String} Id of analytical unit
	 * @returns {*|Promise}
	 */
	Filter.prototype.featureInfo = function(attributes, gid){
		var params = this.prepareParams();

		return $.get( Config.url + "rest/info/attribute", {
				areaTemplate: params.areaTemplate,
				periods: params.periods,
				places: params.locations,
				gid: gid,
				attributes: attributes
			})
			.then(function(response) {
				return response;
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
					var values;
					if (attribute.about.attributeType == "boolean") {
						var checkboxEl = $("#attr-" + attribute.about.attribute);
						values = checkboxEl.hasClass("checked");
					}
					else if (attribute.about.attributeType == "text") {
						var selectEl = $("#attr-" + attribute.about.attribute);
						if (categories[key].multioptions){
							values = [];
							$("#attr-" + attribute.about.attribute + " > label").each(function(){
								if ($(this).hasClass("ui-state-active")){
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
						var sliderEl = $("#attr-" + attribute.about.attribute);
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

	return Filter;
});