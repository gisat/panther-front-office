import jQuery from 'jquery';
import wicket from 'wicket';

import ArgumentError from '../../error/ArgumentError';
import Logger from '../Logger';
import RemoteJQ from '../RemoteJQ';

/**
 * @param options {Object}
 * @constructor
 */
class AnalyticalUnits {
    constructor() {
        this._scope = null;
        this._locations = [];
        this._areaTemplate = null;

        this._units = null;
        this._wkt = new wicket.Wkt();
    };

    /**
     * Returns analytical units according to current configuration
     * @param conf {Object} configuration from global object ThemeYearConfParams
     * @returns {Promise}
     */
    getUnits(conf) {
        let self = this;
        let confUpdated = this.updateConfiguration(conf);
        if (confUpdated) {
            return this.loadUnits().then(this.parseUnits.bind(this));
        } else {
            return new Promise(function (resolve, reject) {
                resolve(self._units);
            })
        }
    };

    /**
     * It updates scope, locations and areaTemplate params
     * @param conf {Object} configuration from global object ThemeYearConfParams
     * @returns {boolean} true if at least one of parameters was updated
     */
    updateConfiguration(conf) {
        let datasetUpdated = this.updateDataset(conf);
        let atUpdated = this.updateAreaTemplate(conf);
        let locationsUpdated = this.updateLocations(conf);
        return datasetUpdated || atUpdated || locationsUpdated;
    };

    /**
     * It updates dataset parameter
     * @param conf {Object}
     * @returns {boolean} True if dataset was updated
     */
    updateDataset(conf) {
        if (conf.hasOwnProperty("dataset") && conf.dataset.length != 0) {
            let scope = Number(conf.dataset);
            if (scope != this._scope) {
                this._scope = scope;
                return true;
            }
        } else {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "AnalyticalUnits", "updateConfiguration", "missingDataset"));
        }
        return false;
    };

    /**
     * It updates area template parameter
     * @param conf {Object}
     * @returns {boolean} True if area template was updated
     */
    updateAreaTemplate(conf) {
        if (conf.hasOwnProperty("auCurrentAt") && conf.auCurrentAt.length != 0) {
            let at = Number(conf.auCurrentAt);
            if (at != this._areaTemplate) {
                this._areaTemplate = at;
                return true;
            }
        } else {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "AnalyticalUnits", "updateConfiguration", "missingAreaTemplate"));
        }
        return false;
    };

    /**
     * It updates locations parameter
     * @param conf {Object}
     * @returns {boolean} True if locations was updated
     */
    updateLocations(conf) {
        if (conf.hasOwnProperty("place") && conf.place.length != 0) {
            let location = Number(conf.place);
            if (location != this._locations[0] || this._locations.length > 1) {
                this._locations = [location];
                return true;
            }
        } else if (conf.hasOwnProperty("allPlaces") && conf.allPlaces.length != 0) {
            let locations = conf.allPlaces;
            if (locations[0] != this._locations[0] || (locations.length > 1 && this._locations.length < 2)) {
                this._locations = locations;
                return true;
            }
        } else {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "AnalyticalUnits", "updateConfiguration", "missingPlace"));
        }
        return false;
    };

    /**
     * Convert geometry of units from wkt to array
     * @param units {Array} original units
     * @returns {Array} converted units
     */
    parseUnits(units) {
        let convertedUnits = [];
        let self = this;
        units.forEach(function (unit) {
            let reader4Geom = jQuery.extend(true, {}, self._wkt);
            let reader4Centroid = jQuery.extend(true, {}, self._wkt);
            let convertedCentroid = reader4Centroid.read(unit.centroid);
            let convertedGeometry = reader4Geom.read(unit.geom);

            unit.geometry = {
                coordinates: convertedGeometry.components,
                type: convertedGeometry.type
            };
            unit.center = {
                coordinates: convertedCentroid.components,
                type: convertedCentroid.type
            };
            delete unit.geom;
            delete unit.centroid;
            convertedUnits.push(unit);
        });
        return convertedUnits;
    };

    /**
     * Load units from server
     * @returns {Promise}
     */
    loadUnits() {
        let self = this;
        return new RemoteJQ({
            url: "rest/au",
            params: {
                scope: this._scope,
                locations: JSON.stringify(this._locations),
                areaTemplate: this._areaTemplate
            }
        }).get().then(function (result) {
            self._units = result.data;
            return self._units;
        });
    };
}

export default AnalyticalUnits;