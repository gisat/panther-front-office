import WorldWind from '@nasaworldwind/worldwind';

let RenderableLayer = WorldWind.RenderableLayer;

/**
 * Class extending WorldWind.RenderableLayer.
 * @param options {Object}
 * @param options.name {string} Name of the layer
 * @augments WorldWind.RenderableLayer
 * @constructor
 */
class MyRenderableLayer extends RenderableLayer {
    constructor(options) {
        super(options.name);
        this.metadata = options.metadata;
    }


    /**
     * Show renderables in layer
     */
    enableRenderables() {
        this.renderables.forEach(function (renderable) {
            renderable.enabled = true;
        });
    };

    /**
     * Hide renderables from layers
     */
    disableRenderables() {
        this.renderables.forEach(function (renderable) {
            renderable.enabled = false;
        });
    };

    /**
     * Change the opacity of the renderables
     * @param opacity {number} alpha channel from 0 to 1
     */
    changeOpacity(opacity) {
        this._opacity = opacity;
        this.redraw(this._data);
    };
}

export default MyRenderableLayer;