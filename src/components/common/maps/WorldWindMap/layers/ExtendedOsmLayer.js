import WorldWind from '@nasaworldwind/worldwind';

const {OpenStreetMapImageLayer} = WorldWind;

/**
 * Class extending WorldWind.OpenStreetMapImageLayer.
 * @param options {Object}
 * @param options.attributions {Array} list of attributions. Each attribution will be rendered on separate line.
 * @param options.detailControl {number}
 * @param options.name {String}
 * @param options.opacity {number}
 * @param options.key {String}
 * @param options.urls {Array} resource URLs
 * @augments WorldWind.OpenStreetMapImageLayer
 * @constructor
 */
class ExtendedOsmLayer extends OpenStreetMapImageLayer {
	constructor(options) {
		super(options);

		this.attributions = options.attributions;
		this.name = options.name;
		this.key = options.key;
		this.opacity = options.opacity ? options.opacity : this.opacity;
		this.detailControl = options.detailControl ? options.detailControl : 1;

		let self = this;
		this.urlBuilder = {
			urlForTile: function (tile) {
				let sourceUrl = self.buildSourceUrl(options.urls);
				return `${sourceUrl}/${tile.level.levelNumber + 1}/${tile.column}/${tile.row}.png`;
			}
		};
	};

	/**
	 * @param urls {string}
	 * @returns {string} Final resource url
	 */
	buildSourceUrl(urls) {
		if (urls.length === 1){
			return urls[0];
		} else {
			let index = Math.floor((Math.random() * urls.length));
			return urls[index];
		}
	}

	doRender(dc) {
		OpenStreetMapImageLayer.prototype.doRender.call(this, dc);
		dc.screenCreditController.clear();
	}
}

export default ExtendedOsmLayer;

