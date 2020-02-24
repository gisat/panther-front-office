import WorldWind from 'webworldwind-esa';
import diagramGeoJSONParser from './utils/DiagramGeoJSONParser'
import VectorLayer from './VectorLayer';
import {MIN_DIAGRAM_RADIUS, MAX_DIAGRAM_RADIUS} from '../styles/cartodiagram';


/**
 * Class extending WorldWind.WmsLayer.
 * @param options {Object}
 * @param options.key {String}
 * @param options.layerName {String}
 * @param options.filterFuncfion {function} Function (renderable) => (true|false) Return if renderable should render.
 * @param options.styleFunction {function} Function (renderable) => (attributes) Return attributes object.
 * @param options.attributeFidColumnName {string} Unique property attribute key.
 * @param options.spatialFidColumnName {string} Unique property spatial key.
 * @param options.normalized {bool}
 * @augments VectorLayer
 * @constructor
 */
class CircleVectorLayer extends VectorLayer {
	constructor(options, url, onLoadEndCallback) {
		super(options);
		this.normalized = options.normalized === false ? false : true;
	};

	/**
	 * 
	 * @param {Object|Array} renderablesData - GeoJSON data
	 */
	setRenderables(renderablesData, defaultStyle, metadata) {

		if (renderablesData) {
			const attributeDataKey = metadata && metadata.attributeDataKey;
			if(attributeDataKey && renderablesData.features.length > 0 && renderablesData.features[0].properties.hasOwnProperty(attributeDataKey)) {
				this.orderFeaturesDescending(renderablesData, attributeDataKey);
			}

			// const parser = new WorldWind.GeoJSONParser(renderablesData);
			const diagramParser = new diagramGeoJSONParser(renderablesData, metadata, 'value', this.normalized, MAX_DIAGRAM_RADIUS, MIN_DIAGRAM_RADIUS, this.attributeStatistics);

			const shapeConfigurationCallback = (geometry, properties) => {
				//add properties to renderable
				return {userProperties: properties}
			}

			//loader for polygons
			// parser.load(this._renderablesAddCallback.bind(this), shapeConfigurationCallback, this);

			//loader for diagrams
			diagramParser.load(this._renderablesAddCallback.bind(this), shapeConfigurationCallback, this);
			this.doRerender();
		}
	}
}

export default CircleVectorLayer;

