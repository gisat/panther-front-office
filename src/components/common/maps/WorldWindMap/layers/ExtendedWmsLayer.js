import WorldWind from '@nasaworldwind/worldwind';

const {WmsLayer} = WorldWind;

/**
 * Class extending WorldWind.WmsLayer.
 * @param options {Object}
 * @param options.customParams {Object}
 * @param options.format {string} image formate
 * @param options.layerNames {String}
 * @param options.levelZeroDelta {WorldWind.Location}
 * @param options.numLevels {number}
 * @param options.opacity {number}
 * @param options.sector {WorldWind.Sector}
 * @param options.size {number} size of tile in pixels
 * @param options.styleNames {String}
 * @param options.url {String}
 * @param options.version {String} WMS version
 * @augments WorldWind.OpenStreetMapImageLayer
 * @constructor
 */
class ExtendedWmsLayer extends WmsLayer {
	constructor(options) {
		super(options);
		this.layerNames = options.layerNames;
		this.service = options.url;
		this.styleNames = options.styleNames ? options.styleNames : "";
		this.customParams = options.customParams;
		this.numLevels = options.numLevels ? options.numLevels : this.numLevels;

		this.cachePath = `${this.service}/${this.layerNames}/${this.styleNames}`;

		this.opacity = options.opacity ? options.opacity : 1;
	};
}

export default ExtendedWmsLayer;

