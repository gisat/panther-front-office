define(['../../error/ArgumentError',
	'../../error/NotFoundError',
	'../../util/Logger',

	'jquery',
	'worldwind'
], function(ArgumentError,
			NotFoundError,
			Logger,

			$
){
	var RenderableLayer = WorldWind.RenderableLayer;

	/**
	 * Class representing layer with analytical units. It extends WorldWind.RenderableLayer.
	 * @param options {Object}
	 * @augments WorldWind.RenderableLayer
	 * @constructor
	 */
	var AnalyticalUnitsLayer = function(options){
		RenderableLayer.call(this, options.name);
	};

	AnalyticalUnitsLayer.prototype = Object.create(RenderableLayer.prototype);

	AnalyticalUnitsLayer.prototype.redraw = function(data){
		this.removeAllRenderables();
		debugger;
		var features = this.prepareFeatures(data);
		this.addRenderables(features);
	};

	AnalyticalUnitsLayer.prototype.prepareFeatures = function(data){
		var features = [];
		var self = this;
		data.forEach(function(record){
			var attributes = new WorldWind.ShapeAttributes(null);
			var boundaries = self.prepareBoundaries(record.geom.coordinates);
			features.push(new WorldWind.SurfacePolygon(boundaries, attributes));
		});
		return features;
	};

	AnalyticalUnitsLayer.prototype.prepareBoundaries = function(coordinates){
		var boundary = [];
		coordinates.forEach(function(coord){
			boundary.push(new WorldWind.Location(coord[1],coord[0]));
		});
		return boundary;
	};

	return AnalyticalUnitsLayer;
});