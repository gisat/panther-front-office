import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';

/**
 * @param options {Object}
 * @param options.store {Object}
 * @param options.store.map {MapStore}
 * @constructor
 */
class SelectInMap {
    constructor(options) {
        if (!options.store) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'SelectInMap', 'constructor', 'Stores must be provided'));
        }
        if (!options.store.map) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'SelectInMap', 'constructor', 'Store map must be provided'));
        }

        this._store = options.store;
    };

    activate() {
        let maps = this._store.map.getAll();
        if (maps) {
            maps.forEach(function (map) {
                map.selectionController.enabled = true;
            })
        }
    };

    deactivate() {
        let maps = this._store.map.getAll();
        if (maps) {
            maps.forEach(function (map) {
                map.selectionController.enabled = false;
            })
        }
    };

}

export default SelectInMap;