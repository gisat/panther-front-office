import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';

let Config = window.Config;

/**
 *
 * @param options
 * @param options.store
 * @param options.store.state {StateStore}
 * @constructor
 */
class DataMining {
    constructor(options) {
        if (!options.store) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'DataMining', 'constructor', 'Stores must be provided'));
        }
        if (!options.store.state) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'DataMining', 'constructor', 'Store state must be provided'));
        }

        this._store = options.store;
    };

    /**
     * TODO fix for All places and refactor
     * Get a list of base layers resources for current analytical units
     * @params currentPeriod {number}
     * @returns {Array} List of base layers
     */
    getAuBaseLayers(currentPeriod) {
        let appState = this._store.state.current();

        let locations = appState.places;
        if (!locations || locations[0] === "All places") {
            locations = appState.allPlaces;
        }

        let period = currentPeriod;
        if (!period) {
            period = appState.periods[0];
        }

        let areaTemplate = appState.currentAuAreaTemplate;
        let auRefMap = appState.auRefMap;

        let layers = [];
        for (let place in auRefMap) {
            locations.forEach(function (location) {
                if (auRefMap.hasOwnProperty(place) && place == location) {
                    for (let aTpl in auRefMap[place]) {
                        if (auRefMap[place].hasOwnProperty(aTpl) && aTpl == areaTemplate) {
                            for (let currentYear in auRefMap[place][aTpl]) {
                                if (auRefMap[place][aTpl].hasOwnProperty(currentYear) && currentYear == period) {
                                    let unit = auRefMap[place][aTpl][currentYear];
                                    if (unit.hasOwnProperty("_id")) {
                                        layers.push(Config.geoserver2Workspace + ':layer_' + unit._id);
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
        return layers;
    };
}

export default DataMining;