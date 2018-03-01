import _ from 'underscore';

import ArgumentError from '../../error/ArgumentError';
import Logger from '../../util/Logger';
import RemoteJQ from '../../util/RemoteJQ';

let Select = window.Select;

/**
 * Class representing Zoom Selected functionality on Map Tools Widget
 * @param options {Object}
 * @param options.dispatcher {Object} Object for handling events in the application.
 * @param options.store {Object}
 * @param options.store.state {StateStore}
 * @constructor
 */
class Zooming {
    constructor(options) {
        if (!options.store) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'ZoomSelected', 'constructor', 'Stores must be provided'));
        }
        if (!options.store.state) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'ZoomSelected', 'constructor', 'Store state must be provided'));
        }
        this._dispatcher = options.dispatcher;

        this._store = options.store;
    };

    /**
     * Zoom to place
     */
    zoomToExtent() {
        this._dispatcher.notify('map#zoomToExtent');
    };

    /**
     * Zoom to selected area/areas. Get bounding box of selection from server, then notify MapsContainer
     */
    zoomSelected() {
        let areas = this.getSelectedAreas();
        if (areas) {
            let self = this;
            new RemoteJQ({
                url: 'rest/info/bboxes',
                params: {
                    areas: areas,
                    periods: this._store.state.current().periods
                }
            }).post().then(function (result) {
                if (result.status === 'ok') {
                    self._dispatcher.notify('map#zoomSelected', result.bbox);
                } else {
                    window.alert(result.message);
                }
            }).catch(function (err) {
                throw new Error(err);
            });
        }
    };

    /**
     * Get selected areas and group them by unique place-areaTemplate combination
     * @returns {Array} List of areas
     */
    getSelectedAreas() {
        let areas = [];
        let finalAreas = [];
        let selection = Select.selectedAreasMap;

        /**
         * Go through all selections and get list of selected areas
         */
        if (selection) {
            for (let color in selection) {
                let items = selection[color];
                items.forEach(function (item) {
                    delete item.equals;
                    delete item.geom;
                    delete item.index;
                    areas.push(item);
                });
            }
        }

        /**
         * Get objects representing set of areas for given location and area template
         */
        let areasGroupedByLocation = _.groupBy(areas, function (area) {
            return area.loc
        });
        for (let location in areasGroupedByLocation) {
            let areasForLocation = areasGroupedByLocation[location];
            let areasGroupedByAt = _.groupBy(areasForLocation, function (area) {
                return area.at
            });

            for (let template in areasGroupedByAt) {
                let areasForAt = areasGroupedByAt[template];
                let group = {
                    loc: location,
                    at: areasForAt[0].at,
                    gids: []
                };
                areasForAt.forEach(function (area) {
                    group.gids.push(area.gid);
                });
                finalAreas.push(group);
            }
        }
        return finalAreas;
    };
}

export default Zooming;