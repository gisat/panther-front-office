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
	 * @param areasData.place {number} ID of place
	 * @param areasData.level {number} ID of level
	 * @param areasData.gids {Array} IDs of areas for filtering
	 * @returns {*|Promise} Filtered areas
	 */
	Filter.prototype.filterAreasByAttributes = function(attributes, areasData){
		var place = areasData.place;
		var level = areasData.level;
		var areas = areasData.gids;
		var placeF = {};
		var levelF = {};
		levelF[level] = areas;
		placeF[place] = levelF;
		var areasReady = JSON.stringify(placeF);

		var dataset = ThemeYearConfParams.dataset;
		var years = ThemeYearConfParams.years;

		var attrs = [];
		var filters = [];
		attributes.forEach(function(attribute){
			var sliderEl = $("#attr-" + attribute._id);
			var min, max;

			if (sliderEl.hasClass("ui-slider")){
				var values = sliderEl.slider("values");
				min = values[0];
				max = values[1];
			} else {
				min = attribute.minValue;
				max = attribute.maxValue;
			}

			var filter = {
				attr: attribute._id,
				as: attribute.attrSet,
				minOrig: attribute.minValue,
				maxOrig: attribute.maxValue,
				min: min,
				max: max
			};
			var attr = {
				attr: attribute._id,
				as: attribute.attrSet
			};
			filters.push(filter);
			attrs.push(attr);
		});

		return new Remote({
			method: "POST",
			url: window.Config.url + "api/filter/filter",
			params: {
				dataset: dataset,
				years: years,
				filters: JSON.stringify(filters),
				attrs: JSON.stringify(attrs),
				areas: areasReady,
				requireData: 1
			}
		}).then(function(response){
			return JSON.parse(response);
		});
	};

	return Filter;
});