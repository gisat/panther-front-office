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
	 * @param attributes {Array} IDs of active attributes
	 * @param areasData {Object}
	 * @returns {*|Promise} Filtered areas
	 */
	Filter.prototype.filterAreasByAttributes = function(attributes, areasData){

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
					as: attribute.about.as
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