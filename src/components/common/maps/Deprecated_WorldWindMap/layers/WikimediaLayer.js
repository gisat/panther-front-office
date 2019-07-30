import OsmLayer from './OsmLayer';
import WorldWind from 'webworldwind-esa';

const {ArgumentError, Logger} = WorldWind;

class WikimediaLayer extends OsmLayer {
    constructor(options) {
        super(options);
        this.imageSize = 256;

        if (!options.source && !options.sourceObject) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MyOsmLayer", "constructor", "missingSource"));
        }

        this._source = options.sourceObject ? this.buildSourceUrl(options.sourceObject) : options.source;
        this._attribution = options.attribution;
        this._imageType = options.imageType ? options.imageType : "png";

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
}

export default WikimediaLayer;