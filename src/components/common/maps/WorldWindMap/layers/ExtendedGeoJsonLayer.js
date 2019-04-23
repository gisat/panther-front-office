import WorldWind from 'webworldwind-esa';

const {RenderableLayer} = WorldWind;

/**
 * Class extending WorldWind.WmsLayer.
 * @param displayName {string}
 * @param options {Object}
 * @param options.key {String}
 * @augments WorldWind.RenderableLayer
 * @constructor
 */
class ExtendedRenderableLayer extends RenderableLayer {
	constructor(displayName, options) {
		super(displayName);
		this.key = options.key;
	};
}

export default ExtendedRenderableLayer;

