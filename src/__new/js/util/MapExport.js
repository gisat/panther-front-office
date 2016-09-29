define([
	'../error/ArgumentError',
	'../util/Logger',

	'jquery'
], function (ArgumentError,
			 Logger,

			 $) {
	"use strict";

	/**
	 * Class for exporting of map as a shapefile or csv file
	 * @param options {Object} options necessarz for request
	 * @param options.location {number} id of place
	 * @param options.areaTemplate {number} id of area template
	 * @param options.year {number} id of year
	 * @param options.gids {Array} ids of selected areas
	 * @constructor
	 */
	var MapExport = function (options) {
		this._location = options.location;
		this._areaTemplate = options.areaTemplate;
		this._year = options.year;
		this._gids = options.gids;
	};

	/**
	 * Export current selection
	 * @param type {('shapefile'|'csv')} format of the export output
	 */
	MapExport.prototype.export = function(type){
		var url = window.Config.url + "export/" + type;
		var form = '<form id="download-form" action="' + url + '" method="get">' +
			'<input name="location" value="' + this._location + '">' +
			'<input name="areaTemplate" value="' + this._areaTemplate + '">' +
			'<input name="year" value="' + this._year + '">' +
			'<input name="gids" value="' + this._gids + '">' +
			'</form>';
		$('body').append(form);
		document.getElementById("download-form").submit();
		$('#download-form').remove();
	};

	return MapExport;
});
