define([
    '../../error/ArgumentError',
    '../../util/Logger'
], function (ArgumentError,
             Logger,) {

    /**
     * @param options {Object}
     * @param options.store {Object}
     * @param options.store.map {MapStore}
     * @constructor
     */
    var SelectInMap = function (options) {
        if (!options.store) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'SelectInMap', 'constructor', 'Stores must be provided'));
        }
        if (!options.store.map) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'SelectInMap', 'constructor', 'Store map must be provided'));
        }

        this._store = options.store;
    };

    SelectInMap.prototype.activate = function () {
        var maps = this._store.map.getAll();
        if (maps) {
            maps.forEach(function (map) {
                map.selectionController.enabled = true;
            })
        }
    };

    SelectInMap.prototype.deactivate = function () {
        var maps = this._store.map.getAll();
        if (maps) {
            maps.forEach(function (map) {
                map.selectionController.enabled = false;
            })
        }
    };

    return SelectInMap;
});