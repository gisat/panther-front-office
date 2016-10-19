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

	Filter.prototype.filter = function(categories, type) {
		var locations;
		if (ThemeYearConfParams.place.length > 0){
			locations = [Number(ThemeYearConfParams.place)];
		} else {
			locations = ThemeYearConfParams.allPlaces;
		}
		var periods = JSON.parse(ThemeYearConfParams.years);

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
							values = selectEl.val();
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

						if (values != "all-options"){
							attributes.push(attr);
						}
				}
			}
		}
		return $.get( Config.url + "rest/filter/attribute/" + type, {
				areaTemplate: ThemeYearConfParams.auCurrentAt,
				periods: periods,
				places: locations,
				attributes: attributes
			})
			.then(function(response) {
				return response
			});
	};

	Filter.prototype.statistics = function(attributes){
		var locations;
		if (ThemeYearConfParams.place.length > 0){
			locations = [Number(ThemeYearConfParams.place)];
		} else {
			locations = ThemeYearConfParams.allPlaces;
		}
		var periods = JSON.parse(ThemeYearConfParams.years);

		var dist = {
			type: 'normal',
			classes: 20
		};

		return $.get( Config.url + "rest/filter/attribute/statistics", {
				areaTemplate: ThemeYearConfParams.auCurrentAt,
				periods: periods,
				places: locations,
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

	return Filter;
});