define([
	'../../../actions/Actions',
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',
	'underscore'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,
			_
){
	/**
	 *
	 * @param options {Object}
	 * @param options.geometry {JSON}
	 * @param options.geometry.coordinates {Array}
	 * @param options.switchedCoordinates {boolean}
	 * @constructor
	 */
	var MultiPolygon = function(options) {
		if (!options.geometry){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MultiPolygon", "constructor", "Geometry must be provided"));
		}

		this._coordinates = options.geometry.coordinates;
		this._switchedCoordinates = options.switchedCoordinates;
	};

	/**
	 * @param boundaries {Array} outer and inner boundaries
	 * @returns {WorldWind.SurfacePolygon}
	 */
	MultiPolygon.prototype.getPolygon = function(boundaries){
		var bounds = [];
		var self = this;
		boundaries.forEach(function(boundary){
			var coords = [];
			boundary.forEach(function(coordinates){
				coords.push(self.getPosition(coordinates));
			});
			bounds.push(coords);
		});

		return new WorldWind.SurfacePolygon(bounds,null);
	};

	/**
	 * @param coordinates {Array}
	 * @returns {WorldWind.Location}
	 */
	MultiPolygon.prototype.getPosition = function(coordinates){
		var latitude = coordinates[0];
		var longitude = coordinates[1];

		if (this._switchedCoordinates){
			latitude = coordinates[1];
			longitude = coordinates[0];
		}
		return new WorldWind.Location(latitude,longitude);
	};

	/**
	 * Get list of renderables for multipolygon
	 * @returns {Array} renderables
	 */
	MultiPolygon.prototype.render = function(){
		var renderables = [];
		var self = this;
		this._coordinates.forEach(function(polygon){
			renderables.push(self.getPolygon(polygon));
		});
		return renderables;
	};

	return MultiPolygon;
});