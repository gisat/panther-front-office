define(['../../error/ArgumentError',
	'../../error/NotFoundError',
	'../../util/Logger',

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
	 * Class representing layer with map diagrams. It extends MyRenderableLayer.
	 * @param options {Object}
	 * @augments MyRenderableLayer
	 * @constructor
	 */
	var MapDiagramsLayer = function(options){
		MyRenderableLayer.apply(this, arguments);
	};

	MapDiagramsLayer.prototype = Object.create(MyRenderableLayer.prototype);

	/**
	 * Redraw layer
	 * @param attributes {Array} list of attributes and their statistics
	 * @param units {Array} list of analytical units with attributes values
	 */
	MapDiagramsLayer.prototype.redraw = function(attributes, units){
		this.removeAllRenderables();

		var self = this;
		var diagramWidth = this.getDiagramWidth(attributes.length);
		units.forEach(function(unit){
			unit.attributes.forEach(function(attribute, index){
				var diagramHeight = self.getDiagramHeight(attribute.value, attributes[index].max, attributes[index].min) * 1000;
				self.addDiagram(index, unit.center.coordinates[0], diagramWidth, diagramHeight, attributes[index].color);
			});
		});
	};

	MapDiagramsLayer.prototype.addDiagram = function(i, location, width, height, color){
		console.log(i, location, width, height, color);
		var lat = location.y;
		var lon = location.x;
		var rgb = this.hexToRgb(color);

		var boundaries = [];
		boundaries[0] = []; // outer boundary
		boundaries[0].push(new WorldWind.Position(lat, lon + (i*width), height));
		boundaries[0].push(new WorldWind.Position(lat + width, lon + (i*width), height));
		boundaries[0].push(new WorldWind.Position(lat + width, lon + width*(i+1), height));
		boundaries[0].push(new WorldWind.Position(lat, lon + width*(i+1), height));

		var polygon = new WorldWind.Polygon(boundaries, null);
		polygon.altitudeMode = WorldWind.ABSOLUTE;
		polygon.extrude = true;

		var polygonAttributes = new WorldWind.ShapeAttributes(null);
		polygonAttributes.drawInterior = true;
		polygonAttributes.drawOutline = true;
		polygonAttributes.outlineColor = new WorldWind.Color(0.1,0.1,0.1,1);
		polygonAttributes.interiorColor = new WorldWind.Color(rgb.r/255,rgb.g/255,rgb.b/255,1);
		polygonAttributes.drawVerticals = polygon.extrude;
		polygon.attributes = polygonAttributes;
		this.addRenderable(polygon);
	};

	/**
	 * Count hight of the diagram based on range
	 * TODO move this method outside the loop
	 * @param value {number} value of attribute for given unit
	 * @param maxValue {number} max value of attribute
	 * @param minValue {number} min value of attribute
	 * @returns {number} height ratio (from 1 to 100)
	 */
	MapDiagramsLayer.prototype.getDiagramHeight = function(value, maxValue, minValue){
		var diff = Math.abs(maxValue - minValue);
		var diffRatio = maxValue/diff;
		if (diffRatio < 100){
			return 100*(value - minValue)/(maxValue - minValue) + 1;
		} else {
			return 100;
		}
	};

	/**
	 * Count width of the diagram based on number of attributes
	 * TODO reflect size of the unit in ratio
	 * @param count {number} number of attributes
	 * @returns {number} width of diagram in degrees
	 */
	MapDiagramsLayer.prototype.getDiagramWidth = function(count){
		var coeff = 0.3;
		return coeff/Math.round((count/3) + 1);
	};

	MapDiagramsLayer.prototype.hexToRgb = function(hex) {
		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	};

	return MapDiagramsLayer;
});