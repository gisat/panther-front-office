import WorldWind from '@nasaworldwind/worldwind';

const {OpenStreetMapImageLayer} = WorldWind;

/**
 * Class extending WorldWind.OpenStreetMapImageLayer.
 * @param options {Object}
 * @param options.detailControl {number}
 * @param options.imageType {string} Type of image which will be used for tiles
 * @param options.numLevels {number} number of tiles levels
 * @param options.opacity {number}
 * @param options.url {string} resource URL
 * @augments WorldWind.OpenStreetMapImageLayer
 * @constructor
 */
class ExtendedOsmLayer extends OpenStreetMapImageLayer {
	constructor(options) {
		super(options);

		this.opacity = options.opacity ? options.opacity : this.opacity;
		this.levels.numLevels = options.levels ? options.levels : this.levels.numLevels;
		this.detailControl = options.detailControl ? options.detailControl : 1;
		this.imageType = options.imageType ? options.imageType : "png";

		let self = this;
		this.urlBuilder = {
			urlForTile: function (tile) {
				let sourceUrl = self.buildSourceUrl(options.url, options.prefixes);
				return `${sourceUrl}/${tile.level.levelNumber + 1}/${tile.column}/${tile.row}.${self.imageType}`;
			}
		};
	};

	/**
	 * @param url {string}
	 * @param prefixes {Array}
	 * @returns {string} Final resource url
	 */
	buildSourceUrl(url, prefixes) {
		if (!prefixes){
			return url;
		} else {
			let index = Math.floor((Math.random() * prefixes.length));
			let prefix = prefixes[index];
			let splittedUrl = url.split('://');
			return `${splittedUrl[0]}://${prefix}.${splittedUrl[1]}`
		}
	}
}

export default ExtendedOsmLayer;

