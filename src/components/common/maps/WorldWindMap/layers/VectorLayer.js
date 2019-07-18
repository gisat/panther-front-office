import WorldWind from 'webworldwind-esa';

const STYLE = {
	interiorColor: WorldWind.Color.TRANSPARENT,
	outlineColor: new WorldWind.Color(.35,.35,.35,1),
	outlineWidth: 2
};

/**
 * @param layer {Object}
 * @param layer.key {string}
 * @param layer.name {string}
 * @param layer.opacity {number}
 * @param layer.options {Object}
 * @param layer.options.features {Array}
 * @augments WorldWind.RenderableLayer
 * @constructor
 */
class VectorLayer extends WorldWind.RenderableLayer {
	constructor(layer) {
		const name = layer.name || '';
		super(name);

		this.opacity = layer.opacity || 1;

		this.addFeatures(layer.options.features || []);
	};

	/**
	 * @param features {Array} List of GeoJSON features
	 */
	addFeatures(features) {
		let geojson = {
			"type": "FeatureCollection",
			"features": features
		};

		const parser = new WorldWind.GeoJSONParser(geojson);

		const shapeConfigurationCallback = (geometry, properties) => {
			let geometryType = null;
			if (geometry.isPointType() || geometry.isMultiPointType()) {
				geometryType = 'POINT';
			} else if (geometry.isLineStringType() || geometry.isMultiLineStringType()) {
				geometryType = 'LINE';
			} else if (geometry.isPolygonType() || geometry.isMultiPolygonType()) {
				geometryType = 'POLYGON';
			}

			return {userProperties: {...properties, _geometryType: geometryType}}
		};

		const renderablesAddCallback = (layer) => {
			layer.renderables.forEach(renderable => {
				renderable.attributes.outlineWidth = STYLE.outlineWidth;
				renderable.attributes.outlineColor = STYLE.outlineColor;
				renderable.attributes.interiorColor = STYLE.interiorColor;
			});
		};

		parser.load(renderablesAddCallback, shapeConfigurationCallback, this);
	}
}

export default VectorLayer;

