define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../Widget3D',

	'string',
	'jquery'
], function (ArgumentError,
			 NotFoundError,
			 Logger,

			 Widget3D,

			 S,
			 $) {
	"use strict";

	/**
	 * Class representing widget for map diagrams creating
	 * @augments Widget3D
	 * @constructor
	 */
	var MapDiagramsWidget = function (options) {
		Widget3D.apply(this, arguments);

		if (!options.filter){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MapDiagramsWidget", "constructor", "missingFilter"));
		}
		this._filter = options.filter;
	};

	MapDiagramsWidget.prototype = Object.create(Widget3D.prototype);

	/**
	 * Rebuild widget with current configuration
	 * @param attributes {Array} List of attributes for current configuration
	 * @param options {Object}
	 * @param options.config {Object} current ThemeYearConf global object configuration
	 */
	MapDiagramsWidget.prototype.rebuild = function(attributes, options){
		console.log(options);
		// filter numeric attributes
		// select attributes to show
		// get statistics about this attributes
		// size of diagrams from:
		//   - number of attributes
		//   - difference between max and min value normalized to default scale
		// get analytical units
		// get values for analytical units and it's attributes
		this._filter.statistics(attributes, null).then(function(result){
			console.log(result);
		});
	};

	return MapDiagramsWidget;
});