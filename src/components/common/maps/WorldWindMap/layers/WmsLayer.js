import WorldWind from 'webworldwind-esa';
import _ from "lodash";

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
class WmsLayer extends WorldWind.WmsLayer {
	constructor(layer) {
		const {key, options, opacity} = layer;
		const {imageFormat, layers, name, styles, version, ...params} = options.params;

		const worldWindOptions = {
			key: key,
			format: imageFormat || "image/png",
			layerNames: layers,
			levelZeroDelta: new WorldWind.Location(45, 45),
			name: name,
			numLevels: 18,
			opacity: opacity || 1,
			params: _.isEmpty(params) ? null : params,
			sector: new WorldWind.Sector(-90, 90, -180, 180),
			service: options.url,
			size: 256,
			styleNames: styles,
			version: version || "1.3.0",
		};

		super(worldWindOptions);

		this.key = key;
		this.attributions = options.attributions;
		this.layerNames = layers;
		this.service = options.url;
		this.styleNames = styles || "";
		this.customParams = params;
		this.numLevels = worldWindOptions.numLevels;

		this.cachePath = `${this.service}/${this.layerNames}`;
		if (this.styleNames) {
			this.cachePath += `/${this.styleNames}`;
		}
		if (this.customParams && this.customParams.time) {
			this.cachePath += `/${this.customParams.time}`;
		}

		this.opacity = worldWindOptions.opacity;

		// TODO extend url builder to accept custom params
	};

	doRender(dc) {
		WorldWind.WmsLayer.prototype.doRender.call(this, dc);
		dc.screenCreditController.clear();
	}
}

export default WmsLayer;

