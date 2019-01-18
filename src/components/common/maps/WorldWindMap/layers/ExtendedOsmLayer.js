import WorldWind from '@nasaworldwind/worldwind';

const {OpenStreetMapImageLayer} = WorldWind;

/**
 * Class extending WorldWind.OpenStreetMapImageLayer.
 * @augments WorldWind.OpenStreetMapImageLayer
 * @constructor
 */
class ExtendedOsmLayer extends OpenStreetMapImageLayer {
	constructor(options) {
		super(options);

		this.detailControl = options.detailControl ? options.detailControl : 1;
		this.imageType = options.imageType ? options.imageType : "png";
		this.levels.numLevels = options.levels ? options.levels : 18;
		this.url = options.url;

		let self = this;
		this.urlBuilder = {
			urlForTile: function (tile, imageFormat) {
				return `${self.url}/${tile.level.levelNumber + 1}/${tile.column}/${tile.row}.${self.imageType}`;
			}
		};
	};
}

export default ExtendedOsmLayer;

