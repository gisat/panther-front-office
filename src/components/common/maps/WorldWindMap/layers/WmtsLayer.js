import OsmLayer from './OsmLayer';
import WorldWind from 'webworldwind-esa';
import uriTemplates from 'uri-templates';

class WmtsLayer extends OsmLayer {
    constructor(layer) {
        super("");
        this.imageSize = 256;
        this.detailControl = 1;
        this.levels.numLevels = 18;

        this.cachePath = layer.options.url;
        this.urlBuilder = {...this.urlBuilder, urlForTile: this.urlForTile.bind(this, layer.options.url)};
    };

    /**
     * @param url {string} URL template
     * @param tile {Tile}
     * @param imageFormat {string}
     * @returns {string} Final url for request
     */
    urlForTile(url, tile, imageFormat) {
        let template = uriTemplates(url);
        if (template && template.varNames && template.varNames.length){
            let prefixes = ['a', 'b', 'c']; // TODO optional
            let numberOfUrls = prefixes.length;
            let index = tile.row % numberOfUrls;

            return template.fill({s: (prefixes[index]), z: (tile.level.levelNumber + 1), x: tile.column, y: tile.row});
        } else {
            return `${url}/${tile.level.levelNumber + 1}/${tile.column}/${tile.row}.${WorldWind.WWUtil.suffixForMimeType(imageFormat)}`;
        }
    }
}

export default WmtsLayer;