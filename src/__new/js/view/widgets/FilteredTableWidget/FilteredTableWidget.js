define(['../Widget'], function(Widget){
	var FilteredTableWidget = function(options) {
		Widget.apply(this, options);
		this.options = options;
		var self = this;

		options.evaluationWidget._filter.filter(options.evaluationWidget._categories)
		Observer.addListener('selectAreas',function(){
			var attributes = [], locations;
			options.evaluationWidget._filter.getFilterParameters(options.evaluationWidget._categories, attributes);

			if (ThemeYearConfParams.place.length > 0){
				locations = [Number(ThemeYearConfParams.place)];
			} else {
				locations = ThemeYearConfParams.allPlaces;
			}
			var periods = JSON.parse(ThemeYearConfParams.years);

			return $.get( Config.url + "rest/filter/attribute/table", {
				areaTemplate: ThemeYearConfParams.auCurrentAt,
				periods: periods,
				places: locations,
				attributes: attributes
			}).then(function(response) {
				self.render(response.table);
			});
		});
	};

	FilteredTableWidget.prototype = Object.create(Widget.prototype);

	FilteredTableWidget.prototype.render = function(table) {
		var tableElement = $('#' + this.options.elementId);

		tableElement.empty();

		tableElement.append('<thead>');
		table.headers.forEach(function(header){
			tableElement.append('<th>'+header+'</th>');
		});
		tableElement.append('</thead>');

		tableElement.append('<tbody>');
		table.values.forEach(function(){
			tableElement.append('<tr>'+header+'</tr>');
		});
		tableElement.append('</tbody>');
	};

	return FilteredTableWidget;
});