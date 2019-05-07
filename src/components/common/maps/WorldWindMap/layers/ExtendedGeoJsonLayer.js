import WorldWind from 'webworldwind-esa';

const {RenderableLayer} = WorldWind;

/**
 * Class extending WorldWind.WmsLayer.
 * @param options {Object}
 * @param options.key {String}
 * @param options.layerName {String}
 * @param options.filterFuncfion {function} Function (renderable) => (true|false) Return if renderable should render.
 * @param options.styleFunction {function} Function (renderable) => (attributes) Return attributes object.
 * @augments WorldWind.RenderableLayer
 * @constructor
 */
class ExtendedRenderableLayer extends RenderableLayer {
	constructor(options, url, onLoadEndCallback) {
		const name = options.layerName || '';
		super(name);
		this.key = options.key;
		this.filterFunction = options.filterFunction || null;
		this.styleFunction = options.styleFunction || {};
		this.attributeStatistics = {};
		this.metadata = {};
	};

	/**
	 * 
	 * @param {Object|Array} renderablesData - GeoJSON data
	 */
	setRenderables(renderablesData) {
		const parser = new WorldWind.GeoJSONParser(renderablesData);
		const shapeConfigurationCallback = (geometry, properties) => {
			//add properties to renderable
			return {userProperties: properties}
		}
		parser.load(null, shapeConfigurationCallback, this);
	}
	
	/**
	 * 
	 * @param {Object} statistics - Statistics for attribute data
	 */
	setAttributeStatistics(statistics) {
		this.attributeStatistics = statistics;
	}

	/**
	 * 
	 * @param {Object} metadata - Metadata for attribute data
	 */
	setMetadata(metadata) {
		this.metadata = metadata;
	}

	doRender(dc) {

		// if(changedStyle || changedFilter || changedAttributes) {
		let renderables = this.renderables;
		let filterFunctionExists = typeof this.filterFunction === 'function';
		let styleFunctionExists = typeof this.styleFunction === 'function';
		for (let i = 0; i<renderables.length; i++) {
			let renderable = renderables[i];
			//filter feature
			// if (changedFilter)
			if(filterFunctionExists) {
				let enabled = this.filterFunction(renderable) === true; //return 
				renderable.enabled = enabled;
			}

			//style fearure
			if(styleFunctionExists) {
				let attribution = this.styleFunction(renderable, this); //return 
				renderable.attributes = attribution;
			}
		}
		// }
		RenderableLayer.prototype.doRender.call(this, dc);
	}
}

export default ExtendedRenderableLayer;

