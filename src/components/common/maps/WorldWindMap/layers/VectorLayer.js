import WorldWind from 'webworldwind-esa';
import diagramGeoJSONParser from './utils/DiagramGeoJSONParser'
import {isEqual} from 'lodash';
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

	setStyleFunction(styleFunction) {
		if(typeof styleFunction === 'function') {
			this.styleFunction = styleFunction;
			this.forEachRenderable(() => true);
			this.doRerender();
		}
	}



	/**
	 * 
	 * Invoke set attributions for each renderables
	 */
	_renderablesAddCallback() {
		this.forEachRenderable((renderable) => {
			//collection of functions that will be called after add renderable
			const onAddActions = [
				this._setFilter.bind(this),
			];
			
			return onAddActions.some(a => a(renderable));
		});

	}

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
		parser.load(this._renderablesAddCallback.bind(this), shapeConfigurationCallback, this);
	}

	_setFilter(renderable) {
		if(this.filtered) {
			const filtered = this.filtered ? !this.filtered.areas.includes(renderable.userProperties[this.spatialIdKey]) : true;
			//false if item not in filter areas
			if(filtered !== renderable.filtered) {
				renderable.filtered = filtered;
				return true;
			} else {
				return false;
			}
		} else {
			renderable.filtered = null;
			return true;
		}
	}

	setFilter(filtered) {
		if(!isEqual(this.filtered, filtered)) {
			this.filtered = filtered;
			this.forEachRenderable(this._setFilter.bind(this));
			this.doRerender();
		}
	}
	_setAccent(renderable) {
			if(this.accent) {
				const accented = this.accent ? this.accent.areas.includes(renderable.userProperties[this.spatialIdKey]) : false;
				if(renderable.accented !== accented) {
					renderable.accented = accented;
					return true;
				} else {
					return false;
				}
			} else {
				renderable.accented = null;
				return true;

			}
	}

	setAccent(accent) {
		if(!isEqual(this.accent, accent)) {
			this.accent = accent;
			this.forEachRenderable(this._setAccent.bind(this));
		}
	}
	_setHover(renderable) {
		const hovered = this.hovered ? this.hovered.includes(renderable.userProperties[this.spatialIdKey]) : false;
		if(renderable.hovered !== hovered) {
			renderable.hovered = hovered;
			return true
		} else {
			return false;
		}
	}

	setHover(hovered) {
		if(!isEqual(this.hovered, hovered)) {
			this.hovered = hovered;
			this.forEachRenderable(this._setHover.bind(this));
			this.doRerender();
		}
	}

	computeAttribution(renderable) {
		if(this.styleFunction) {
			let attribution = this.styleFunction(renderable, this); //return 
			renderable.attributes = attribution;
		}
	}

	/**
	 * 
	 * @param {function} modificator Function that has renderable as parameter. If return true attributions will be recalculated.
	 */
	forEachRenderable(modificator) {
		if(typeof modificator === 'function') {
			const styleFunctionExists = typeof this.styleFunction === 'function';
			const renderables = this.renderables;
			const renderablesCount = this.renderables.length;
			for (let i = 0; i < renderablesCount; i++) {
				const renderable = renderables[i];
				
				const shouldRerender = modificator(renderable);

				if(shouldRerender && styleFunctionExists) {
					this.computeAttribution(renderable);
				}
			}
		}
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

	doRerender() {
		if(typeof this._rerenderMap === 'function') {
			this._rerenderMap();
		}
	}
}

export default ExtendedRenderableLayer;

