import {geoCentroid, geoBounds, geoDistance} from 'd3';
import WorldWind from '@nasaworldwind/worldwind';

import ArgumentError from '../error/ArgumentError';
import Logger from '../util/Logger';

let GoToAnimator = WorldWind.GoToAnimator;

/**
 * Class extending the WorldWind.GoToAnimator class
 * @param wwd {WorldWindow} The World Window in which to perform the animation.
 * @param options {Object}
 * @param options.store {Object}
 * @param options.store.state {StateStore}
 * @param options.store.locations {Locations}
 * @param options.dispatcher
 * @constructor
 */
class MyGoToAnimator extends GoToAnimator {
    constructor(wwd, options) {
        if (!wwd) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MyGoToAnimator", "constructor", "missingWorldWind"));
        }

        if (!options.store) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MyGoToAnimator', 'constructor', 'Stores must be provided'));
        }
        if (!options.store.state) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MyGoToAnimator', 'constructor', 'Store state must be provided'));
        }
        if (!options.store.locations) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MyGoToAnimator', 'constructor', 'Store locations must be provided'));
        }

        super(wwd);
        this._store = options.store;

        this.wwd = wwd;
        this.travelTime = 0;

        this._defaultLocation = [14, 50];
        this._defaultRange = 10000000;

        this._dispatcher = options.dispatcher;
    }

    /**
     * Set the location according to current configuration
     */
    setLocation() {
        let self = this;
        let stateStore = this._store.state;
        let currentState = stateStore.current();
        let places = currentState.places;
        let dataset = currentState.scope;

        if (!dataset) {
            console.warn(Logger.logMessage(Logger.LEVEL_WARNING, "MyGoToAnimator", "setLocation", "missingDataset"));
            this._store.state.removeLoadingOperation("ScopeLocationChanged");
        }
        else {
            let values = {dataset: dataset};
            if ((places[0] !== 'All places') && places.length === 1) {
                values.id = places[0];
            }

            this._store.locations.filter(values).then(function (response) {
                if (response.length > 0) {
                    let points = [];
                    response.forEach(function (location) {
                        if (location.bbox) {
                            let bbox = location.bbox.split(",");
                            let pointsForArea = self.getPointsFromBBox(bbox);
                            points = points.concat(pointsForArea);
                        }
                    });
                    self.setLocationFromPointSet(points);
                } else {
                    console.warn(Logger.logMessage(Logger.LEVEL_WARNING, "MyGoToAnimator", "setLocation", "emptyResult"));
                    self.updateLocation(self._defaultLocation[0], self._defaultLocation[1], self._defaultRange);
                }
            }).catch(function (err) {
                throw new Error(Logger.log(Logger.LEVEL_SEVERE, err));
            });
        }
    }
    ;

    /**
     * Set location and range based on given point set
     * @param points {Array} list of [lon,lat] points
     */
    setLocationFromPointSet(points) {
        let json = this.getGeoJsonFromPoints(points);

        /**
         * get bounding box of point set
         */
        let bounds = geoBounds(json);

        /**
         * add other two corners to bbox (due to more precise calculation of centroid)
         */
        bounds.push([bounds[0][0], bounds[1][1]]);
        bounds.push([bounds[1][0], bounds[0][1]]);

        /**
         * calculate centroid (it will be used as the reference postion of camera)
         */
        let centroid = this.getCentroid(bounds);

        /**
         * according to centroid, bounding box and other settings (window size ratio, area size and area size ratio),
         * update the position and range of the camera
         */
        let self = this;
        setTimeout(function () {
            let position = self.getPosition(centroid, bounds);
            self.updateLocation(position.lat, position.lon, position.alt);
        }, 100);
    }
    ;

    /**
     * It returns corners of bounding box and centroid in form of three [lon,lat] points
     * @param bbox {Array} 4 coordinates
     * @returns {Array} Corners and centroid
     */
    getPointsFromBBox(bbox) {
        let points = [];

        let minLon = Number(bbox[0]);
        let minLat = Number(bbox[1]);
        let maxLon = Number(bbox[2]);
        let maxLat = Number(bbox[3]);
        points.push([minLon, minLat]);
        points.push([maxLon, maxLat]);
        points.push(this.getCentroid([[minLon, minLat], [maxLon, maxLat]]));

        return points;
    }
    ;

    /**
     * Zoom map to area (represented by bounding box)
     * @param bounds {Array} Bounding box represented by a two pairs of coordinates
     */
    zoomToArea(bounds) {
        let minLon = bounds[0][0];
        let minLat = bounds[0][1];
        let maxLon = bounds[1][0];
        let maxLat = bounds[1][1];

        let bottomLeft = bounds[0];
        let topRight = bounds[1];
        let bottomRight = [maxLon, minLat];
        let topLeft = [minLon, maxLat];

        let leftCentroid = this.getCentroid([bottomLeft, topLeft]);
        let topCentroid = this.getCentroid([topLeft, topRight]);
        let rightCentroid = this.getCentroid([topRight, bottomRight]);
        let bottomCentroid = this.getCentroid([bottomRight, bottomLeft]);

        let topCenter = [topCentroid[0], maxLat];
        let centerRight = [maxLon, rightCentroid[1]];
        let bottomCenter = [bottomCentroid[0], minLat];
        let centerLeft = [minLon, leftCentroid[1]];

        /**
         * add other two corners to bbox and center points of boundary segments (due to more precise calculation of centroid)
         */
        bounds.push([bounds[0][0], bounds[1][1]]);
        bounds.push([bounds[1][0], bounds[0][1]]);
        bounds.push(topCenter);
        bounds.push(centerRight);
        bounds.push(bottomCenter);
        bounds.push(centerLeft);

        /**
         * calculate centroid (it will be used as a postion of the camera)
         */
        let centroid = this.getCentroid(bounds);

        /**
         * according to centroid, bounding box and other settings (window size ratio, area size and area size ratio),
         * update the position and range of the camera
         */
        let self = this;
        setTimeout(function () {
            let position = self.getPosition(centroid, bounds);
            self.updateLocation(position.lat, position.lon, position.alt);
        }, 100);
    }
    ;

    /**
     * Update look at location and range
     * @param lat {number} Latitude of camera. From -90 to 90
     * @param lon {number} Longitude of camera. From -180 to 180
     * @param range {number} Distance from surface. From 0 to inf
     */
    updateLocation(lat, lon, range) {
        this.wwd.navigator.lookAtLocation.latitude = lat;
        this.wwd.navigator.lookAtLocation.longitude = lon;
        this.wwd.navigator.range = range;

        this.wwd.redraw();
        this.wwd.redrawIfNeeded(); // TODO: Check with new releases. This isn't part of the public API and therefore might change.
        this._store.state.removeLoadingOperation("ScopeLocationChanged");
    }
    ;


    /**
     * It converts list of points [lon,lat] to GeoJSON structure
     * @param points {Array} list of points
     * @returns {Object} GeoJSON
     */
    getGeoJsonFromPoints(points) {
        let json = {
            "type": "FeatureCollection",
            "features": []
        };
        points.forEach(function (point) {
            json["features"].push({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": point
                }
            })
        });
        return json;
    }
    ;

    /**
     * Get position for camera from centroid and bbox
     * @param centroid {[lon,lat]} coordinates of centroid
     * @param bbox {[[{Number}, {Number}],[{Number}, {Number}]]} bottom left and top right corner of the bounding box
     * @returns {{lat: number, lon: number, alt: number}}
     */
    getPosition(centroid, bbox) {
        var range = this.calculateRange(bbox);
        range = this.adjustRangeAccordingToProjection(range, centroid);
        this.checkRange(range);

        return {
            lat: centroid[1],
            lon: centroid[0],
            alt: range
        }
    }


    /**
     * Calculate centroid from bounding box
     * @param bbox {[[{Number}, {Number}],[{Number}, {Number}]]} bottom left and top right corner of the bounding box
     * @returns {[lon,lat]} coordinates of centroid
     */
    getCentroid(bbox) {
        let json = this.getGeoJsonFromPoints(bbox);
        return geoCentroid(json);
    }
    ;

    /**
     * Calculate range acording to distance between bounding box corners and map window size
     * @param bbox {[[{Number}, {Number}],[{Number}, {Number}]]} bottom left and top right corner of the bounding box
     * @returns {number} Range (distance from surface to camera)
     */
    calculateRange(bbox) {
        const RANGE_COEFF = 140000;
        let windowSizeRatio = 1;

        let width = this.wwd.viewport.width;
        let height = this.wwd.viewport.height;
        let range = this._defaultRange;
        let diagonalDistance_1 = geoDistance(bbox[0], bbox[1]);
        let diagonalDistance_2 = geoDistance(bbox[3], bbox[2]);

        let meridianDistance = geoDistance(bbox[0], bbox[2]);
        let parallelDistance_1 = geoDistance(bbox[0], bbox[3]);
        let parallelDistance_2 = geoDistance(bbox[1], bbox[2]);
        let parallelDistance = parallelDistance_1;
        if (parallelDistance_2 > parallelDistance_1) {
            parallelDistance = parallelDistance_2;
        }

        if (Math.abs(diagonalDistance_1 - diagonalDistance_2) > 0.000001) {
            console.error("MyGoToAnimator#calculate range: A control distance calculation is higher than a limit.");
            return range;
        }

        // calculate window size ratio
        if (width > 1 && height > 1) {
            windowSizeRatio = width / height;
            if (windowSizeRatio < 1) {
                windowSizeRatio = 1 / windowSizeRatio;
            }
        }

        // calculate area size ratio
        let areaSizeRatio = parallelDistance / meridianDistance;

        // distance between bounding box corners in degrees
        let distanceInDegrees = diagonalDistance_1 * (180 / Math.PI);
        if (distanceInDegrees < 0.01) {
            distanceInDegrees = 0.01;
        }

        // Calculate range
        range = distanceInDegrees * RANGE_COEFF * windowSizeRatio;

        // Adjust range for specific options
        if (areaSizeRatio > 2 && windowSizeRatio > 1.5 && distanceInDegrees < 20) {
            range /= windowSizeRatio;
        }

        // TODO Solve this for locations with high altitude (e.g. mountains)
        if (range < 1000) {
            return 1000;
        }
        return range;
    }

    checkRange(range){
        var is2D = !this._store.state.current().isMap3D;

        if (range < 1000000){
            this._dispatcher.notify("toolBar#disable3DMapButton");
            if (is2D){
                this._dispatcher.notify("toolBar#click3DMapButton");
            }
        } else {
            this._dispatcher.notify("toolBar#enable3DMapButton");
        }

        return range;
    }

    adjustRangeAccordingToProjection(range, position){
        var is2D = !this._store.state.current().isMap3D;
        if (is2D){
            var latitude = position[1];
            return (range/Math.abs(Math.cos(latitude)));
        } else {
            return range;
        }
    }
}

export default MyGoToAnimator;
