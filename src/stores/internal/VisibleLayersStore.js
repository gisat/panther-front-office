import Actions from '../../actions/Actions';

/**
 * This store is associated with every map. It contains all the layers that are currently visible on the map.
 * @param options {Object}
 * @param options.dispatcher {Object} Dispatcher for all events in the application.
 * @param options.map {WorldWindMap} Map associated with this store.
 * @constructor
 */
class VisibleLayersStore {
    constructor(options) {
        options.dispatcher.addListener(this.onEvent.bind(this));

        this._map = options.map;

        this._layers = {};
    };

    /**
     * It adds visible layer to the map.
     * @param options {Object}
     * @param options.layer {WmsLayer} WMSLayer to be added.
     */
    add(options) {
        this._layers[options.layer.id] = options.layer;

        this._map.addLayer(options.layer);
        this._map.redraw();
    };

    /**
     * It can remove selection for certain color, or for all colors.
     * @param options {Object} Object containing options for the layer.
     * @param options.layerId {String} If of the layer
     */
    remove(options) {
        this._map.removeLayer(this._layers[options.layerId]);
        this._map.redraw();

        delete this._layers[options.layerId];
    };

    onEvent(type, options) {
        if (type === Actions.mapAddVisibleLayer) {
            this.add(options);
        } else if (type === Actions.mapRemoveVisibleLayer) {
            this.remove(options)
        }
    };

}

export default VisibleLayersStore;