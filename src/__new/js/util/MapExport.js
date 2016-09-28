define([
	'../error/ArgumentError',
	'../util/Logger',
	'./Remote',

	'jquery'
], function (ArgumentError,
			 Logger,
			 Remote,

			 $) {
	"use strict";

	var MapExport = function () {
	};

	MapExport.prototype.export = function(params){
		console.log(params);
		return new Remote({
			method: "GET",
			url: window.Config.url + "export/shapefile",
			params: params
		}).then(function(response){
			console.log(response)
		})
	};

	return MapExport;
});
