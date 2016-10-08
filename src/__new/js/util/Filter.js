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

	Filter.prototype.filter = function(categories) {
		var places = [Number(ThemeYearConfParams.place)];
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
							var selectEl = $("#attr-" + attribute.about.attribute + "-button .ui-selectmenu-text");
							values = selectEl.text();
						}
						else if (attribute.about.attributeType == "numeric"){
							var sliderEl = $("#attr-" + attribute.about.attribute);
							var min, max;

							if (sliderEl.hasClass("ui-slider")){
								var val = sliderEl.slider("values");
								min = val[0];
								max = val[1];
								if (min == max){
									min = min - 0.005;
									max = max + 0.005;
								}
							} else {
								min = attribute.values[0];
								max = attribute.values[1];
							}
							values = [min, max];
						}

						var attr = {
							attribute: attribute.about.attribute,
							attributeSet: attribute.about.attributeSet,
							values: values
						};
						console.log(attr);
						attributes.push(attr);
				}
			}
		}
		return $.get( "http://localhost:4000/rest/filter/attribute/filter", {
				areaTemplate: ThemeYearConfParams.auCurrentAt,
				periods: periods,
				places: places,
				attributes: attributes
			})
			.then(function(response) {
				return response
			});
	};

	return Filter;
});