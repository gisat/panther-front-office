import WorldWind from 'webworldwind-esa';

const {Location, Sector, MercatorTiledImageLayer} = WorldWind;

/**
 * Constructs an Open Street Map layer.
 * @alias OpenStreetMapImageLayer
 * @constructor
 * @augments MercatorTiledImageLayer
 * @classdesc Provides a layer that shows Open Street Map imagery.
 *
 * @param {String} displayName This layer's display name. "Open Street Map" if this parameter is
 * null or undefined.
 */
class OsmLayer extends MercatorTiledImageLayer {
    constructor(displayName) {
        displayName = displayName || "Open Street Map";

        super(new Sector(-85.05, 85.05, -180, 180), new Location(85.05, 180), 19, "image/png", displayName,
            256, 256);

        this.displayName = displayName;
        this.pickEnabled = false;

        // Create a canvas we can use when unprojecting retrieved images.
        this.destCanvas = document.createElement("canvas");
        this.destContext = this.destCanvas.getContext("2d");

        this.urlBuilder = {
            urlForTile: function (tile, imageFormat) {
                //var url = "https://a.tile.openstreetmap.org/" +
                return "https://otile1.mqcdn.com/tiles/1.0.0/osm/" +
                    (tile.level.levelNumber + 1) + "/" + tile.column + "/" + tile.row + ".png";
            }
        };

        this.doRender = this.doRender.bind(this);
    };

    doRender(dc) {
        MercatorTiledImageLayer.prototype.doRender.call(this, dc);
    };

    // Overridden from TiledImageLayer.
    createTopLevelTiles(dc) {
        this.topLevelTiles = [];

        this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 0, 0));
        this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 0, 1));
        this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 1, 0));
        this.topLevelTiles.push(this.createTile(null, this.levels.firstLevel(), 1, 1));
    };

    // Determines the Bing map size for a specified level number.
    mapSizeForLevel(levelNumber) {
        return 256 << (levelNumber + 1);
    };
}

export default OsmLayer;