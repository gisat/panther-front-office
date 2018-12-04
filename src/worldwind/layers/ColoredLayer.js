import WorldWind from '@nasaworldwind/worldwind';

const Sector = WorldWind.Sector,
    Location = WorldWind.Location,
    TiledImageLayer = WorldWind.TiledImageLayer,
    WWUtil = WorldWind.WWUtil;

class ColoredLayer extends TiledImageLayer {
    constructor(color) {
        super(new Sector(-90, 90, -180, 180), new Location(45, 45), 18, 'image/png', 'Colored ' + color + WWUtil.guid(), 256, 256);

        this._color = color;
    }

    /**
     * The Image for given Tile is generated and drawn on internal Canvas.
     * @inheritDoc
     */
    retrieveTileImage(dc, tile, suppressRedraw){
        if (this.currentRetrievals.indexOf(tile.imagePath) < 0) {
            if (this.absentResourceList.isResourceAbsent(tile.imagePath)) {
                return;
            }

            const imagePath = tile.imagePath,
                cache = dc.gpuResourceCache,
                layer = this;

            const tileWidth = 256;
            const tileHeight = 256;
            const result = document.createElement('canvas');
            result.height = tileHeight;
            result.width = tileWidth;
            const ctx = result.getContext('2d');
            ctx.rect(0, 0, tileWidth, tileHeight);
            ctx.fillStyle = this._color;
            ctx.fill();

            const texture = layer.createTexture(dc, tile, result);
            layer.removeFromCurrentRetrievals(imagePath);

            if (texture) {
                cache.putResource(imagePath, texture, texture.size);

                layer.currentTilesInvalid = true;
                layer.absentResourceList.unmarkResourceAbsent(imagePath);

                if (!suppressRedraw) {
                    // Send an event to request a redraw.
                    const e = document.createEvent('Event');
                    e.initEvent(WorldWind.REDRAW_EVENT_TYPE, true, true);
                    window.dispatchEvent(e);
                }
            }
        }
    }
}

export default ColoredLayer;