import WorldWind from 'webworldwind-esa';
import diagramGeoJSONParser from './utils/DiagramGeoJSONParser'
import VectorLayer from './VectorLayer'

/**
 * Class extending WorldWind.WmsLayer.
 * @param options {Object}
 * @param options.key {String}
 * @param options.layerName {String}
 * @param options.filterFuncfion {function} Function (renderable) => (true|false) Return if renderable should render.
 * @param options.styleFunction {function} Function (renderable) => (attributes) Return attributes object.
 * @param options.attributeFidColumnName {string} Unique property attribute key.
 * @param options.spatialFidColumnName {string} Unique property spatial key.
 * @augments VectorLayer
 * @constructor
 */
class CartodiagramVectorLayer extends VectorLayer {
	constructor(options, url, onLoadEndCallback) {
		super(options);
	};

	/**
	 * 
	 * @param {Object|Array} renderablesData - GeoJSON data
	 */
	setRenderables(renderablesData, defaultStyle, metadata) {

		const attributeDataKey = metadata && metadata.attributeDataKey;
		if(attributeDataKey && renderablesData.features.length > 0 && renderablesData.features[0].properties.hasOwnProperty(attributeDataKey)) {
			this.orderFeaturesDescending(renderablesData, attributeDataKey);
		}

		const parser = new WorldWind.GeoJSONParser(renderablesData);
		const diagramParser = new diagramGeoJSONParser(renderablesData, metadata, 'volume', true, 80000, this.attributeStatistics);

		const shapeConfigurationCallback = (geometry, properties) => {
			//add properties to renderable
			return {userProperties: properties}
		}

		//loader for polygons
		parser.load(this.doRerender, shapeConfigurationCallback, this);
		
		//loader for diagrams
		diagramParser.load(this.doRerender, shapeConfigurationCallback, this);

	}
}

export default CartodiagramVectorLayer;

