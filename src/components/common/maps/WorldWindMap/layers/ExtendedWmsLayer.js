import WorldWind from 'webworldwind-esa';

const {WmsLayer} = WorldWind;

/**
 * Class extending WorldWind.WmsLayer.
 * @param options {Object}
 * @param options.attributions {Array} list of attributions. Each attribution will be rendered on separate line.
 * @param options.params {Object} optional paremeters
 * @param options.format {string} image formate
 * @param options.key {String}
 * @param options.layerNames {String}
 * @param options.levelZeroDelta {WorldWind.Location}
 * @param options.numLevels {number}
 * @param options.opacity {number}
 * @param options.sector {WorldWind.Sector}
 * @param options.size {number} size of tile in pixels
 * @param options.styleNames {String}
 * @param options.url {String}
 * @param options.version {String} WMS version
 * @augments WorldWind.WmsLayer
 * @constructor
 */
class ExtendedWmsLayer extends WmsLayer {
	constructor(options) {
		super(options);

		this.attributions = options.attributions;
		this.key = options.key;
		this.layerNames = options.layerNames;
		this.service = options.url;
		this.styleNames = options.styleNames ? options.styleNames : "";
		this.customParams = options.customParams;
		this.numLevels = options.numLevels ? options.numLevels : this.numLevels;

		this.cachePath = `${this.service}/${this.layerNames}`;
		if (this.styleNames) {
			this.cachePath += `/${this.styleNames}`;
		}
		if (this.customParams && this.customParams.time) {
			this.cachePath += `/${this.customParams.time}`;
		}

		this.opacity = options.opacity ? options.opacity : 1;

		// TODO extend url builder to accept custom params
	};

	doRender(dc) {
		WmsLayer.prototype.doRender.call(this, dc);
		dc.screenCreditController.clear();
	}
}

export default ExtendedWmsLayer;

