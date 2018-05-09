import Actions from '../../actions/Actions';
import ArgumentError from '../../error/ArgumentError';
import Config from '../../Config';
import Logger from '../../util/Logger';
import FilteredSld from '../../util/FilteredSld';
import FilterLayer from '../../models/FilterLayer';

/**
 * It actually handles filtering using multiple colors. It has some of the parts of the selection. The filter just
 * defines selection. The selection has two parts. First part for the selection is showing it on the map.
 * Second part is showing it in the chart.
 * Every selection is based upon color.
 * For the charts part you ned to keep information about areas you want to select.
 * For the map it is just a layer associated with a color.
 * @param options {Object}
 * @param options.dispatcher {Object} Allows adding listeners
 * @param options.store {Object}
 * @param options.store.state {StateStore} Store containing state. Necessary for querying the server for base layers.
 * @constructor
 */
class SelectionStore {
    constructor(options) {
        if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'SelectionStore', 'constructor', 'Stores must be provided'));
        }

        if(!options.store.state){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'SelectionStore', 'constructor', 'Store state must be provided'));
        }

        /**
         * For each color you need to keep the information about the selected gids of the areas alongside the map.
         * The map layer will differ for select single and filters, but it is still part of the standard selection process.
         * First step is just working with the layers. The rest is handled elsewhere.
         * @type {{}}
         * @private
         */
        this._selected = {};

        this._wmsUrl = Config.geoServerUrl;
        this._serverUrl = Config.serverUrl;

        this._stateStore = options.store.state;

        this._dispatcher = options.dispatcher;

        options.dispatcher.addListener(this.onEvent.bind(this));
    };

    /**
     * It adds filter to the store.
     * @param options.attributes {Object}
     * @param options.color {String} Color of the selection. Based on this information the layer is either added or replaces
     *    existing layer.
     */
    addFilter(options) {
        var color = options.color,
            self = this,
            layer;
        var promise = Promise.resolve(null);
        if(this._selected[color]) {
            promise = this.removeFilter(options);
        }
        return promise.then(function(){
            // Generate sld. This will differ on whether it is filtered or standard.
            return new FilteredSld(options.attributes, color).toString();
        }).then(function(style){
            // Update layers on the server
            layer = new FilterLayer({
                style: style,
                serverUrl: self._serverUrl,
                wmsUrl: self._wmsUrl,
                stateStore: self._stateStore
            });

            return layer.save();
        }).then(function(wmsLayer){
            self._selected[options.color] = {
                layer: layer
            };

            // Add layer among visible.
            self._dispatcher.notify(Actions.mapAddVisibleLayer, {
                layer: wmsLayer
            });
        }).catch(function(error) {
            Logger.logMessage(Logger.LEVEL_SEVERE, 'SelectionStore', 'add', 'Error when creating layer for selection: ' + error);
        });
    };

    /**
     * It removes layer from the map and server.
     * @param options {Object}
     * @param options.color {String} Color of the selection.
     */
    removeFilter(options) {
        if(!this._selected[options.color]) {
            Logger.logMessage(Logger.LEVEL_WARN, 'SelectionStore', 'remove', "Tried to remove selection for color which wasn't already shown");
            return Promise.resolve(null);
        }

        var self = this;
        self._dispatcher.notify(Actions.mapRemoveVisibleLayer, {
            layerId: self._selected[options.color].layer.id
        });
        delete self._selected[options.color];

        return Promise.resolve(null);
    };

    onEvent(type, options) {
        if(type === Actions.filterAdd) {
            this.addFilter(options);
        } else if(type === Actions.filterRemove) {
            this.removeFilter(options);
        }
    };

    serialize() {
        var keys = Object.keys(this._selected);
        var self = this;
        return keys.map(function(key){
            return {
                color: key,
                layer: self._selected[key].layer.serialize()
            }
        });
    };

    deserialize(selected) {
        var self = this;
        selected.forEach(function(selected){
            var layer = FilterLayer.deserialize(selected.layer, self._stateStore);
            self._selected[selected.color] = {
                layer: layer
            };

            self._dispatcher.notify(Actions.mapAddVisibleLayer, {
                layer: layer.wms(layer._wmsLayer, layer._styleId)
            });
        });
    };

}

export default SelectionStore;