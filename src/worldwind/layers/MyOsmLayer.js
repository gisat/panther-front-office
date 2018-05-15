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
 * @param options.source {string} source URL
 * @param options.attribution {string}
 * @augments WorldWind.OpenStreetMapImageLayer
 * @constructor
 */
class MyOsmLayer extends OsmLayer {
    constructor(options) {
        super(options);

        if (!options.source) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MyOsmLayer", "constructor", "missingSource"));
        }

        // this.tileCache = Cache;

        this._source = options.source;
        this._attribution = options.attribution;

        this.cachePath = options.source;
        this.detailControl = 0.8;

        let self = this;
        this.urlBuilder = {
            urlForTile: function (tile, imageFormat) {
                return self._source +
                    (tile.level.levelNumber + 1) + "/" + tile.column + "/" + tile.row + ".png";
            }
        };
    };

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

