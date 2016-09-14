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
	 * Pre-filter areas according to values of boolean and string attributes
	 * @param categories {Object} One category per attribute
	 * @param areasData
	 * @returns {*|Promise} Filtered areas
	 */
	Filter.prototype.preFilter = function(categories, areasData){
		var areas = JSON.stringify(areasData);
		var dataset = ThemeYearConfParams.dataset;
		var years = ThemeYearConfParams.years;

		var attrs = [];
		var filters = [];
		for (var key in categories){
			if (categories[key].hasOwnProperty('attrData')){
				if (categories[key].active == true){
					var attribute = categories[key].attrData;

					var currentValues;
					if (attribute.about.attrType == "boolean"){
						var checkboxEl = $("#attr-" + attribute.about.attr);
						currentValues = {
							value: checkboxEl.hasClass("checked")
						};
					}

					var filter = {
						attr: attribute.about.attr,
						as: attribute.about.as,
						attrType: attribute.about.attrType,
						values: currentValues
					};
					var attr = {
						attr: attribute.about.attr,
						as: attribute.about.as,
						attrType: attribute.about.attrType
					};
					filters.push(filter);
					attrs.push(attr);
				}
			}
		}

		return new Remote({
			method: "POST",
			url: window.Config.url + "api/filter/multifilter",
			params: {
				dataset: dataset,
				years: years,
				filters: JSON.stringify(filters),
				attrs: JSON.stringify(attrs),
				areas: areas
			}
		}).then(function(response){
			return JSON.parse(response);
		});
	};

	/**
	 * Filter areas according to values of numeric attributes
	 * @param attributes {Array} IDs of all attributes
	 * @param areasData {Object}
	 * @returns {*|Promise} Filtered areas, metadata and distribution of values
	 */
	Filter.prototype.numericFilter = function(attributes, areasData){
		var areas = JSON.stringify(areasData);
		var dataset = ThemeYearConfParams.dataset;
		var years = ThemeYearConfParams.years;

		var attrs = [];
		var filters = [];
		attributes.forEach(function(attribute){
			if (attribute.about.attrType == "numeric"){
				var sliderEl = $("#attr-" + attribute.about.attr);
				var min, max;
				if (sliderEl.hasClass("ui-slider")){
					var values = sliderEl.slider("values");
					min = values[0];
					max = values[1];
					if (min == max){
						min = min - 0.005;
						max = max + 0.005;
					}
				} else {
					min = attribute.metadata.min;
					max = attribute.metadata.max;
				}

				var filter = {
					attr: attribute.about.attr,
					as: attribute.about.as,
					minOrig: attribute.metadata.min,
					maxOrig: attribute.metadata.max,
					min: min,
					max: max
				};
				var attr = {
					attr: attribute.about.attr,
					as: attribute.about.as,
					attrType: attribute.about.attrType
				};
				filters.push(filter);
				attrs.push(attr);
			}
		});

		return new Remote({
			method: "POST",
			url: window.Config.url + "api/filter/filter",
			params: {
				dataset: dataset,
				years: years,
				filters: JSON.stringify(filters),
				attrs: JSON.stringify(attrs),
				areas: areas,
				requireData: 1
			}
		}).then(function(response){
			return JSON.parse(response);
		});
	};

	return Filter;
});