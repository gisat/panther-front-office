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
	 * @param options.places {Array} ids of places
	 * @param options.areaTemplate {number} id of area template
	 * @param options.periods {Array} ids of periods
	 * @param options.gids {Array} ids of selected areas
	 * @constructor
	 */
	var MapExport = function (options) {
		this._places = options.places;
		this._areaTemplate = options.areaTemplate;
		this._periods = options.periods;
		this._gids = options.gids;
	};

	/**
	 * Export current selection
	 * @param type {('geojson'|'csv')} format of the export output
	 */
	MapExport.prototype.export = function(type){
		var url = window.Config.url + "export/" + type;
		var form = '<form id="download-form" action="' + url + '" method="get">' +
			'<input name="places" value="' + this._places + '">' +
			'<input name="areaTemplate" value="' + this._areaTemplate + '">' +
			'<input name="periods" value="' + this._periods + '">' +
			'<input name="gids" value="' + this._gids + '">' +
			'</form>';
		$('body').append(form);
		document.getElementById("download-form").submit();
		$('#download-form').remove();
	};

	return MapExport;
});
