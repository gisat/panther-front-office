import WorldWind from 'webworldwind-esa';

const {RenderableLayer} = WorldWind;

/**
 * Class extending WorldWind.WmsLayer.
 * @param options {Object}
 * @param options.key {String}
 * @param options.name {String}
 * @augments WorldWind.RenderableLayer
 * @constructor
 */
class ExtendedRenderableLayer extends RenderableLayer {
	constructor(options) {
		const name = options.name || '';
		super(name);
		this.key = options.key;
	};
}

export default ExtendedRenderableLayer;

