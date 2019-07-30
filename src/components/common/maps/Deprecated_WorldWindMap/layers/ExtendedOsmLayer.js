import WorldWind from 'webworldwind-esa';
import uriTemplates from 'uri-templates';

const {OpenStreetMapImageLayer, WWUtil} = WorldWind;

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
		this.urlBuilder = {...this.urlBuilder, urlForTile: this.urlForTile.bind(this, options.urls)};
	};

	/**
	 * @param urls {Array} list of URLs. It accepts url templates
	 * @param tile {Tile}
	 * @param imageFormat {string}
	 * @returns {string} Final url for request
	 */
	urlForTile(urls, tile, imageFormat) {
		let url = this.getUrlBasedOnTileRow(urls, tile.row);
		let template = uriTemplates(url);
		if (template && template.varNames && template.varNames.length){
			return template.fill({z: (tile.level.levelNumber + 1), x: tile.column, y: tile.row});
		} else {
			return `${url}/${tile.level.levelNumber + 1}/${tile.column}/${tile.row}.${WWUtil.suffixForMimeType(imageFormat)}`;
		}
	}

	/**
	 * Get url from list based on tile row. It is based on row due to caching.
	 * @param urls {Array}
	 * @param row {number}
	 * @returns {string} Selected url
	 */
	getUrlBasedOnTileRow (urls, row) {
		let numberOfUrls = urls.length;
		let index = row % numberOfUrls;
		return urls[index];
	}

	doRender(dc) {
		OpenStreetMapImageLayer.prototype.doRender.call(this, dc);
		dc.screenCreditController.clear();
	}
}

export default ExtendedOsmLayer;

