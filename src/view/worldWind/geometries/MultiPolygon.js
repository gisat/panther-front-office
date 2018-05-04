import WorldWind from '@nasaworldwind/worldwind';

import ArgumentError from '../../../error/ArgumentError';
import Logger from '../../../util/Logger';

/**
 *
 * @param options {Object}
 * @param options.geometry {JSON}
 * @param options.geometry.coordinates {Array}
 * @param options.switchedCoordinates {boolean}
 * @constructor
 */
class MultiPolygon {
    constructor(options) {
        if (!options.geometry) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MultiPolygon", "constructor", "Geometry must be provided"));
        }

        this._coordinates = options.geometry.coordinates;
        this._switchedCoordinates = options.switchedCoordinates;

        this._shapeAttributes = new WorldWind.ShapeAttributes(null);
        this._shapeAttributes.outlineColor = new WorldWind.Color(.4, .15, .7, 1);
        this._shapeAttributes.outlineWidth = 4;
        this._shapeAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 0);
    };

    /**
     * @param boundaries {Array} outer and inner boundaries
     * @returns {WorldWind.SurfacePolygon}
     */
    getPolygon(boundaries) {
        var bounds = [];
        var self = this;
        boundaries.forEach(function (boundary) {
            var coords = [];
            boundary.forEach(function (coordinates) {
                coords.push(self.getPosition(coordinates));
            });
            bounds.push(coords);
        });

        return new WorldWind.SurfacePolygon(bounds, this._shapeAttributes);
    };

    /**
     * @param coordinates {Array}
     * @returns {WorldWind.Location}
     */
    getPosition(coordinates) {
        var latitude = coordinates[0];
        var longitude = coordinates[1];

        if (this._switchedCoordinates) {
            latitude = coordinates[1];
            longitude = coordinates[0];
        }
        return new WorldWind.Location(latitude, longitude);
    };

    /**
     * Get list of renderables for multipolygon
     * @returns {Array} renderables
     */
    render() {
        var renderables = [];
        var self = this;
        this._coordinates.forEach(function (polygon) {
            renderables.push(self.getPolygon(polygon));
        });
        return renderables;
    };
}

export default MultiPolygon;