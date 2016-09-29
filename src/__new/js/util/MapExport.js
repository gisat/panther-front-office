define([
	'../error/ArgumentError',
	'../util/Logger',

	'jquery'
], function (ArgumentError,
			 Logger,

			 $) {
	"use strict";

	var MapExport = function (options) {
		this._location = options.location;
		this._areaTemplate = options.areaTemplate;
		this._year = options.year;
		this._gids = options.gids;
	};

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
