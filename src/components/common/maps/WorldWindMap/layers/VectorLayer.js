import WorldWind from 'webworldwind-esa';
import utils from '@gisatcz/ptr-utils';
import _ from 'lodash';

let DEFAULT_SELECTED_STYLE = {
	outlineWidth: 3,
	outlineColor: "#ff0000",
	outlineOpacity: 1,
	fillOpacity: 0,
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
			let style = utils.mapStyle.getStyleObject(properties, this.pantherProps.style);
			return {userProperties: {...properties, style}}
		};

		const renderablesAddCallback = (layer) => {
			layer.renderables.forEach(renderable => {
				let style = renderable.userProperties && renderable.userProperties.style;
				let outlineRgb = utils.mapStyle.hexToRgb(style.outlineColor);
				let fillRgb = utils.mapStyle.hexToRgb(style.fill);

				renderable.userProperties.worldWindDefaultStyle = {
					outlineWidth: style.outlineWidth,
					outlineColor: new WorldWind.Color(outlineRgb.r / 255, outlineRgb.g / 256, outlineRgb.b / 256, style.outlineOpacity),
					interiorColor: new WorldWind.Color(fillRgb.r/255, fillRgb.g/256, fillRgb.b/256, style.fillOpacity)
				};

				this.applyStyles(renderable);
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
				this.applyStyles(renderable);
			}
		});
	}

	applyStyles(renderable) {
		this.applyRenderableDefaultStyle(renderable);

		let selectionStyle = this.getSelectionStyle(renderable);
		if (selectionStyle) {
			this.applySelectedStyle(renderable,selectionStyle)
		}
	}

	applyRenderableDefaultStyle(renderable) {
		renderable.attributes.outlineWidth = renderable.userProperties.worldWindDefaultStyle.outlineWidth;
		renderable.attributes.outlineColor = renderable.userProperties.worldWindDefaultStyle.outlineColor;
		renderable.attributes.interiorColor = renderable.userProperties.worldWindDefaultStyle.interiorColor;
	}

	applyHoveredStyle(renderable) {
		let style = {
			outlineWidth: 3,
			outlineColor: "#ffaaaa",
			outlineOpacity: 1,
			fillOpacity: 0,
		};

		if (this.pantherProps.hovered && this.pantherProps.hovered.style) {
			style = {...style, ...utils.mapStyle.getStyleObject(null, this.pantherProps.hovered.style, true)};
		}

		this.setRenderableStyle(renderable, style);
	}

	applySelectedStyle(renderable, definition) {
		const style = {...DEFAULT_SELECTED_STYLE, ...utils.mapStyle.getStyleObject(null, definition, true)};
		this.setRenderableStyle(renderable, style);
	}

	setRenderableStyle(renderable, style) {
		let outlineRgb = utils.mapStyle.hexToRgb(style.outlineColor);

		renderable.attributes.outlineWidth = style.outlineWidth;
		renderable.attributes.outlineColor = new WorldWind.Color(outlineRgb.r/255, outlineRgb.g/256, outlineRgb.b/256, style.outlineOpacity);

		if (style.fill) {
			let fillRgb = utils.mapStyle.hexToRgb(style.fill);
			renderable.attributes.interiorColor = new WorldWind.Color(fillRgb.r/255, fillRgb.g/256, fillRgb.b/256, style.fillOpacity);
		}
	}

	getSelectionStyle(renderable) {
		if (this.pantherProps.selected) {
			const featureKey = renderable.userProperties[this.pantherProps.fidColumnName];
			let style = null;

			_.forIn(this.pantherProps.selected, (selection, key) => {
				if (selection.keys && _.includes(selection.keys, featureKey)) {
					style = selection.style || DEFAULT_SELECTED_STYLE;
				}
			});

			return style;
		} else {
			return null;
		}
	}
}

export default VectorLayer;

