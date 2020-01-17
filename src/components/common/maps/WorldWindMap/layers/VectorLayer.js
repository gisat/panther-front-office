import WorldWind from 'webworldwind-esa';
import mapStyles, {DEFAULT_SIZE} from "../../../../../utils/mapStyles";
import _ from 'lodash';

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
	constructor(layer, options) {
		const name = layer.name || '';
		super(name);

		this.opacity = layer.opacity || 1;

		this.pantherProps = {
			features: options.features || [],
			fidColumnName: options.fidColumnName,
			hovered: {...options.hovered},
			selected: {...options.selected},
			key: layer.key,
			layerKey: layer.layerKey,
			onHover: options.onHover,
			onClick: options.onClick,
			style: options.style
		};

		this.addFeatures(this.pantherProps.features);
	};

	/**;
	 * @param features {Array} List of GeoJSON features
	 */
	addFeatures(features) {
		let geojson = {
			"type": "FeatureCollection",
			"features": features
		};

		const parser = new WorldWind.GeoJSONParser(geojson);

		const shapeConfigurationCallback = (geometry, properties) => {
			let style = mapStyles.getStyleObject(properties, this.pantherProps.style);
			return {userProperties: {...properties, style}}
		};

		const renderablesAddCallback = (layer) => {
			layer.renderables.forEach(renderable => {
				let style = renderable.userProperties && renderable.userProperties.style;
				let outlineRgb = mapStyles.hexToRgb(style.outlineColor);
				let fillRgb = mapStyles.hexToRgb(style.fill);

				renderable.userProperties.worldWindDefaultStyle = {
					outlineWidth: style.outlineWidth,
					outlineColor: new WorldWind.Color(outlineRgb.r / 255, outlineRgb.g / 256, outlineRgb.b / 256, style.outlineOpacity),
					interiorColor: new WorldWind.Color(fillRgb.r/255, fillRgb.g/256, fillRgb.b/256, style.fillOpacity)
				};

				this.applyRenderableDefaultStyle(renderable);

				renderable.attributes.outlineWidth = style.outlineWidth;
				renderable.attributes.outlineColor = new WorldWind.Color(outlineRgb.r/255, outlineRgb.g/256, outlineRgb.b/256, style.outlineOpacity);
				renderable.attributes.interiorColor = new WorldWind.Color(fillRgb.r/255, fillRgb.g/256, fillRgb.b/256, style.fillOpacity);
			});
		};

		parser.load(renderablesAddCallback, shapeConfigurationCallback, this);
	}

	/**
	 * @param fids {Array}
	 */
	updateHoveredFeatures(fids) {
		this.renderables.forEach(renderable => {
			const key = renderable.userProperties[this.pantherProps.fidColumnName];
			if (_.includes(fids, key)) {
				this.applyHoveredStyle(renderable);
			} else {
				this.applyRenderableDefaultStyle(renderable);
			}
		});
	}

	applyRenderableDefaultStyle(renderable) {
		renderable.attributes.outlineWidth = renderable.userProperties.worldWindDefaultStyle.outlineWidth;
		renderable.attributes.outlineColor = renderable.userProperties.worldWindDefaultStyle.outlineColor;
		renderable.attributes.interiorColor = renderable.userProperties.worldWindDefaultStyle.interiorColor;
	}

	applyHoveredStyle(renderable) {
		renderable.attributes.outlineWidth = 3;
		renderable.attributes.outlineColor = new WorldWind.Color(1, 0, 0, 1);
	}
}

export default VectorLayer;

