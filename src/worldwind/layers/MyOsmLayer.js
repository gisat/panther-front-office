import WorldWind from '@nasaworldwind/worldwind';

import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';
import Cache from "../Cache";

let OsmLayer = WorldWind.OpenStreetMapImageLayer;
let MercatorLayer = WorldWind.MercatorTiledImageLayer;
let Color = WorldWind.Color;

/**
 * Class extending WorldWind.WmsLayer.
 * @param options {Object}
 * @param options.source {string} Source URL
 * @param options.sourceObject {Object}
 * @param options.imageType {string} Type of image which will be used for tiles
 * @param options.attribution {string}
 * @augments WorldWind.OpenStreetMapImageLayer
 * @constructor
 */
class MyOsmLayer extends OsmLayer {
    constructor(options) {
        super(options);

        if (!options.source && !options.sourceObject) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MyOsmLayer", "constructor", "missingSource"));
        }

        this._source = options.sourceObject ? this.buildSourceUrl(options.sourceObject) : options.source;
        this._attribution = options.attribution;
        this._imageType = options.imageType ? options.imageType : "png";

		// this.tileCache = Cache;
		this.cachePath = this._source;
		this.detailControl = options.detailControl ? options.detailControl : 1;
		this.levels.numLevels = 18;

        let self = this;
        this.urlBuilder = {
            urlForTile: function (tile, imageFormat) {
                return self._source +
                    (tile.level.levelNumber + 1) + "/" + tile.column + "/" + tile.row + "." + self._imageType;
            }
        };
    };

	/**
     * Build source URL
	 * @param source {Object}
	 * @returns {string} URL of source
	 */
	buildSourceUrl(source){
        let prefix = this.buildPrefix(source.prefixes);
        let protocol = source.protocol ? source.protocol + "://" : "http://";
        let host = source.host + "/";
        let path = source.path ? source.path + "/" : "";

        return protocol + prefix + host + path;
    }

    buildPrefix(prefixes){
		let prefix = "";
		if (prefixes){
			let index = Math.floor((Math.random() * prefixes.length));
			prefix = prefixes[index] + ".";
		}
		return prefix;
    }

    doRender(dc) {
        if (!this._credit){
            MercatorLayer.prototype.doRender.call(this, dc);
            if (this.inCurrentFrame) {
                this._credit = dc.screenCreditController.addStringCredit(this._attribution, Color.MEDIUM_GRAY);
            }
        }
    }
}

export default MyOsmLayer;

