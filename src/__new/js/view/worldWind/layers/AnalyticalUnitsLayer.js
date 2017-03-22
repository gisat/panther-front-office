define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'./MyRenderableLayer',

	'jquery',
	'worldwind'
], function(ArgumentError,
			NotFoundError,
			Logger,

			MyRenderableLayer,

			$
){
	/**
	 * Class representing layer with analytical units. It extends MyRenderableLayer.
	 * @param options {Object}
	 * @augments MyRenderableLayer
	 * @constructor
	 */
	var AnalyticalUnitsLayer = function(options){
		MyRenderableLayer.apply(this, arguments);

		this._opacity = 0.8;
	};

	AnalyticalUnitsLayer.prototype = Object.create(MyRenderableLayer.prototype);

	/**
	 * Redraw layer with analytical units
	 * @param data {Array} list of units
	 */
	AnalyticalUnitsLayer.prototype.redraw = function(data){
		this._data = data;

		this.removeAllRenderables();
		var features = this.prepareFeatures(data);
		this.addRenderables(features);
	};

	/**
	 * Prepare features for Web World Wind
	 * @param data {Array} Adjusted data from endpoint. List of units.
	 * @returns {Array} List of units for drawing.
	 */
	AnalyticalUnitsLayer.prototype.prepareFeatures = function(data){
		var features = [];
		var self = this;
		data.forEach(function(record){
			var attributes = new WorldWind.ShapeAttributes(null);
			attributes.outlineColor = new WorldWind.Color(1, 0, 0, self._opacity);
			attributes.interiorColor = new WorldWind.Color(1, 1, 1, self._opacity);
			var boundaries = self.getBoundaries(record.geometry);
			boundaries.forEach(function(polygonBoundary){
				var feature = new WorldWind.SurfacePolygon(polygonBoundary, attributes);
				feature.altitudeMode = WorldWind.ABSOLUTE;
				features.push(feature);
			});
		});
		return features;
	};

	/**
	 * Get boundaries according to boundary type
	 * @param geometry {Object}
	 * @param geometry.type {string} type of geometry (polygon or multipolygon)
	 * @param geometry.coordinates {Array}
	 * @returns {Array} Polygons boundaries
	 */
	AnalyticalUnitsLayer.prototype.getBoundaries = function(geometry){
		if (geometry.type == "polygon"){
			return [this.getPolygonBoundaries(geometry.coordinates)];
		}
		else if (geometry.type == "multipolygon"){
			return this.getMultiPolygonBoundaries(geometry.coordinates);
		}
	};

	/**
	 * Return multiple polygons boundaries
	 * @param geometry {Array} List of polygons' boundaries components
	 * @returns {Array} Polygons boundaries
	 */
	AnalyticalUnitsLayer.prototype.getMultiPolygonBoundaries = function(geometry){
		var polygons = [];
		var self = this;
		geometry.forEach(function(polygon){
			var _polygon = self.getPolygonBoundaries(polygon);
			polygons.push(_polygon);
		});
		return polygons;
	};

	/**
	 * Return polygon boundaries
	 * @param geometry {Array} List of polygon's boundaries components
	 * @returns {Array} Polygon boundaries
	 */
	AnalyticalUnitsLayer.prototype.getPolygonBoundaries = function(geometry){
		var boundaries = [];
		var self = this;
		geometry.forEach(function(boundary){
			var _boundary = [];
			boundary.forEach(function(coordinates){
				_boundary.push(self.getPosition(coordinates));
			});
			boundaries.push(_boundary);
		});
		return boundaries;
	};

	/**
	 * Return World Wind Position from coordinates in lat, lon
	 * @param coordinates {Object}
	 * @param coordinates.x {number} latitude
	 * @param coordinates.y {Object} longitude
	 * @returns {WorldWind.Position}
	 */
	AnalyticalUnitsLayer.prototype.getPosition = function(coordinates){
		return new WorldWind.Location(coordinates.y, coordinates.x); // third parameter is altitude
	};

	return AnalyticalUnitsLayer;
});