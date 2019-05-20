import WorldWind from 'webworldwind-esa';
import diagramGeoJSONParser from './utils/DiagramGeoJSONParser'
const {RenderableLayer} = WorldWind;

/**
 * Class extending WorldWind.WmsLayer.
 * @param options {Object}
 * @param options.key {String}
 * @param options.layerName {String}
 * @param options.filterFuncfion {function} Function (renderable) => (true|false) Return if renderable should render.
 * @param options.styleFunction {function} Function (renderable) => (attributes) Return attributes object.
 * @param options.attributeFidColumnName {string} Unique property attribute key.
 * @param options.spatialFidColumnName {string} Unique property spatial key.
 * @augments WorldWind.RenderableLayer
 * @constructor
 */
class ExtendedRenderableLayer extends RenderableLayer {
	constructor(options, url, onLoadEndCallback) {
		const name = options.layerName || '';
		super(name);
		this.attributeIdKey = options.attributeIdKey;
		this.spatialIdKey = options.spatialIdKey;
		this.key = options.key;
		this.filterFunction = options.filterFunction || null;
		this.styleFunction = options.styleFunction || {};
		this.attributeStatistics = {};
		this.metadata = {};
		this.filter = null;
		this.accent = null;
		this._rerenderMap = null;
	};


	orderFeaturesDescending(data, attributeDataKey) {
		return data.features.sort((a, b) => b.properties[attributeDataKey] - a.properties[attributeDataKey])
	}

	setRerender(rerenderer) {
		if(typeof rerenderer === 'function') {
			this._rerenderMap = rerenderer;
		}
	}

	/**
	 * 
	 * @param {Object|Array} renderablesData - GeoJSON data
	 */
	
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
		const shapeConfigurationCallback = (geometry, properties) => {
			//add properties to renderable
			return {userProperties: properties}
		};
		parser.load(this.doRerender, shapeConfigurationCallback, this);
	}

	setFilter(filter) {
		//name. areas
		this.filter = filter;
		this.doRerender();
	}

	setAccent(accent) {
		//name. areas
		this.accent = accent;
		this.doRerender();
	}

	setHover(areas) {
		this.highlighted = areas;
		this.doRerender();
	}
	
	/**
	 * 
	 * @param {Object} statistics - Statistics for attribute data
	 */
	setAttributeStatistics(statistics) {
		this.attributeStatistics = statistics;
		this.doRerender();
	}

	/**
	 * 
	 * @param {Object} metadata - Metadata for attribute data
	 */
	setMetadata(metadata) {
		this.metadata = metadata;
		this.doRerender();
	}

	doRender(dc) {
		//renderable changed?
		// if(changedStyle || changedFilter || changedAttributes) {

		let renderables = this.renderables;
		let filterFunctionExists = typeof this.filterFunction === 'function';
		let styleFunctionExists = typeof this.styleFunction === 'function';
		for (let i = 0; i < renderables.length; i++) {
			let renderable = renderables[i];
			// filter feature
			if(this.filter) {
				const filtered = this.filter.areas.includes(renderable.userProperties[this.spatialIdKey]);
				//true if item not in  filter areas
				renderable.filtered = !filtered;
			} else {
				renderable.filtered = null;
			}

			// accent feature
			if(this.accent) {
				const accented = this.accent.areas.includes(renderable.userProperties[this.spatialIdKey]);
				//true if item in accent areas
				renderable.accented = accented;
			} else {
				renderable.accented = null;
			}

			//higlight feature
			if(this.highlighted) {
				const highlighted = this.highlighted.includes(renderable.userProperties[this.spatialIdKey]);
				renderable.hovered = highlighted;
			} else {
				renderable.hovered = false;
			}

			if(filterFunctionExists) {
				let enabled = this.filterFunction(renderable) === true; //return 
				renderable.enabled = enabled;
			}

			//style fearure
			if(styleFunctionExists) {
				//renderable changed?
				let attribution = this.styleFunction(renderable, this); //return 
				renderable.attributes = attribution;
			}
		}
		// }
		RenderableLayer.prototype.doRender.call(this, dc);
	}

	doRerender() {
		if(typeof this._rerenderMap === 'function') {
			this._rerenderMap();
		}
	}
}

export default ExtendedRenderableLayer;

