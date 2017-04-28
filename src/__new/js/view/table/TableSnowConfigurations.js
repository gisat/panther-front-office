define([
	'./Table',
	'jquery',

	'css!./TableSnowConfigurations'
], function(
	Table,
	$
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
		var content = '<tr data-url="' + data.url + '">';
		content += '<td>' + data.area + '</td>';
		content += '<td>' + data.dateFrom + ' -<br/>' + data.dateTo + '</td>';

		// add sensors cell
		var sensors = '';
		for (var satellite in data.sensors){
			sensors += '<i>' + satellite + '</i> (';
			sensors += data.sensors[satellite].join(', ');
			sensors += ')<br/>';
		}
		content += '<td>' + sensors + '</td>';

		// add composites cell
		content += '<td> Daily composites </br>';
		if (data.composites.length){
			content += data.composites.join(",") + '-day composites';
		}
		content += '</td>';


		//add action button
		if (saved){
			content += '<td><div class="widget-button show-composites">Show</div></td>';
		} else {
			content += '<td><div class="widget-button save-composites">Save</div></td>';
		}

		content += '</tr>';

		this._table.append(content);
	};

	return TableSnowConfigurations;
});
