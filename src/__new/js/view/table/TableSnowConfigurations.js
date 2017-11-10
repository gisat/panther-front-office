define([
	'./Table',
	'jquery',
	'string',
	'text!../widgets/SnowWidget/icons/composites.svg',
	'text!../widgets/SnowWidget/icons/satellite.svg',
	'text!../widgets/SnowWidget/icons/calendar.isvg',
	'text!../widgets/SnowWidget/icons/placemark.isvg',

	'css!./TableSnowConfigurations'
], function(
	Table,
	$,
	S,
	compositesIcon,
	satelliteIcon,
	calendarIcon,
	placemarkIcon
){

	/**
	 * @constructor
	 */
	var TableSnowConfigurations = function() {
		Table.apply(this, arguments);
	};

	TableSnowConfigurations.prototype = Object.create(Table.prototype);

	/**
	 * Add record to the table
	 * @param data {Object}
	 * @param saved {boolean} true for saved records, false for current configuration record
	 */
	TableSnowConfigurations.prototype.addRecord = function(data, saved){
		var compIcon = S(compositesIcon).template().toString();
		var satIcon = S(satelliteIcon).template().toString();
		var calIcon = S(calendarIcon).template().toString();
		var areaIcon = S(placemarkIcon).template().toString();
		var content = '<tr data-url="' + data.url + '" data-id="' + data.uuid + '">';

		if (!saved){
			content += '<td><input class="snow-input snow-cfg-name" type="text" placeholder="Type name..."/></td>';
		} else {
			content += '<td class="snow-cfg-name-date"><div title="' + data.name + '" class="snow-name">' + data.name + '</div><div class="snow-timestamp">' + data.timeStamp + '</div></td>';
		}

		// add location and period cell
		content += '<td class="snow-icon snow-area"><div class="snow-icon-container">' + areaIcon +  '</div><div>' + data.area + '</div></td>';
		content += '<td class="snow-icon snow-date"><div class="snow-icon-container">' + calIcon +  '</div><div>' + data.dateFrom + ' -<br/>' + data.dateTo + '</div></td>';

		// add sensors cell
		var sensors = '';
		for (var satellite in data.sensors){
			sensors += satellite + ' (';
			sensors += data.sensors[satellite].join(', ');
			sensors += ')<br/>';
		}
		content += '<td class="snow-icon snow-sensors"><div class="snow-icon-container">' + satIcon +  '</div><div>' + sensors + '</div></td>';

		// add composites cell
		content += '<td class="snow-icon snow-composites"><div class="snow-icon-container icon-composites">' + compIcon +  '</div><div>Daily composites </br>';
		if (data.composites.length){
			content += '' + data.composites.join(",") + '-day composites';
		}
		content += '</div></td>';


		//add action button
		if (saved){
			content += '<td class="button-cell button-cell-delete"><div title="Delete" class="widget-button delete-composites"><i class="fa fa-trash-o" aria-hidden="true"></i></div></td>';
			content += '<td class="button-cell"><div class="widget-button show-composites">Show<i class="fa fa-arrow-right" aria-hidden="true"></i></div></td>';
		} else {
			content += '<td class="button-cell"><div class="widget-button save-composites"><i class="fa fa-floppy-o" aria-hidden="true"></i>Save</div></td>';
		}

		content += '</tr>';

		this._table.append(content);
	};

	return TableSnowConfigurations;
});
