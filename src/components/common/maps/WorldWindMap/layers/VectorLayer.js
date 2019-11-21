import WorldWind from 'webworldwind-esa';
import mapStyles from "../../../../../utils/mapStyles";

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
		this.style = layer.options && layer.options.style && layer.options.style.data && layer.options.style.data.definition;

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
			let style = mapStyles.getStyleObject(properties, this.style);
			return {userProperties: {...properties, style}}
		};

		const renderablesAddCallback = (layer) => {
			layer.renderables.forEach(renderable => {
				let style = renderable.userProperties && renderable.userProperties.style;
				let outlineRgb = mapStyles.hexToRgb(style.outlineColor);
				let fillRgb = mapStyles.hexToRgb(style.fill);

				renderable.attributes.outlineWidth = style.outlineWidth;
				renderable.attributes.outlineColor = new WorldWind.Color(outlineRgb.r/255, outlineRgb.g/256, outlineRgb.b/256, style.outlineOpacity);
				renderable.attributes.interiorColor = new WorldWind.Color(fillRgb.r/255, fillRgb.g/256, fillRgb.b/256, style.fillOpacity);
			});
		};

		parser.load(renderablesAddCallback, shapeConfigurationCallback, this);
	}
}

export default VectorLayer;

