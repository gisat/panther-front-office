define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',
	'../../../util/Promise',

	'../Widget3D',

	'string',
	'jquery',
	'underscore'
], function (ArgumentError,
			 NotFoundError,
			 Logger,
			 Promise,

			 Widget3D,

			 S,
			 $,
			 _) {
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
		this._diagramsLayer = this._worldWind.getLayerById("mapDiagrams");
		this._worldWind.addLayer(this._diagramsLayer);
	};

	MapDiagramsWidget.prototype = Object.create(Widget3D.prototype);

	/**
	 * Rebuild widget with current configuration
	 * @param data {Object}
	 * @param data.attributes {Array} List of attributes for current configuration
	 * @param data.analyticalUnits {Array} List of analytical units for current configuration
	 * @param options {Object}
	 * @param options.config {Object} current ThemeYearConf global object configuration
	 */
	MapDiagramsWidget.prototype.rebuild = function(data, options){
		var self = this;
		var analyticalUnits = data.analyticalUnits;
		var numAttributes = this._filter.getOnlyNumericAttributes(data.attributes);
		// select attributes to show and then show diagrams

		this.getDataForDiagrams(numAttributes, analyticalUnits).then(function(result){
			if (result.length == 0){
				console.error(Logger.logMessage(Logger.LEVEL_SEVERE, "MapDiagramsWidget", "result", "emptyResult"));
			} else {
				var units = self.prepareUnitsData(analyticalUnits, result[1]);
				self._diagramsLayer.redraw(result[0], units);
			}
		});

		self._worldWind.redraw();
		console.log(self._worldWind);
	};

	/**
	 * Get data for diagrams
	 * @param attributes {Array} List of attributes for current configuration
	 * @param units {Array} List of analytical units for current configuration
	 * @returns {Promise}
	 */
	MapDiagramsWidget.prototype.getDataForDiagrams = function(attributes, units){
		var statistics = this._filter.statistics(attributes, null);
		var dataForDiagrams = this.loadDataForDiagrams(attributes, units);

		return Promise.all([statistics,dataForDiagrams]);
	};

	/**
	 * Load data for diagrams from server
	 * @param attributes {Array} List of attributes for current configuration
	 * @param units {Array} List of analytical units for current configuration
	 * @returns {Promise}
	 */
	MapDiagramsWidget.prototype.loadDataForDiagrams = function(attributes, units){
		var gids = _.pluck(units, 'gid');
		return this._filter.featureInfo(attributes, gids);
	};

	/**
	 * Add geometries to units for diagrams
	 * @param unitsForDiagrams {Array} list of unts with diagram data
	 * @param analyticalUnits {Array} list of units with geometries
	 * @returns {Array}
	 */
	MapDiagramsWidget.prototype.prepareUnitsData = function(analyticalUnits, unitsForDiagrams){
		unitsForDiagrams.forEach(function(unit){
			var au = _.find(analyticalUnits, function(aUnit){
				return (aUnit.gid == unit.gid) && (aUnit.name == unit.name);
			});
			unit.center = au.center;
			unit.geometry = au.geometry;
			delete unit.geom;
		});
		return unitsForDiagrams;
	};

	return MapDiagramsWidget;
});