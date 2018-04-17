define(['../error/ArgumentError',
	'../error/NotFoundError',
	'../util/Logger',

	'd3',
	'jquery',
	'underscore',
	'worldwind'
], function(ArgumentError,
			NotFoundError,
			Logger,

			d3,
			$,
			_
){
	var GoToAnimator = window.WorldWind.GoToAnimator;

	/**
	 * Class extending the WorldWind.GoToAnimator class
	 * @param wwd {WorldWindow} The World Window in which to perform the animation.
	 * @param options {Object}
	 * @param options.store {Object}
	 * @param options.store.state {StateStore}
	 * @param options.store.locations {Locations}
	 * @param options.dispatcher {Object}
	 * @constructor
	 */
	var MyGoToAnimator = function(wwd, options){
		if (!wwd){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MyGoToAnimator", "constructor", "missingWorldWind"));
		}

        if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MyGoToAnimator', 'constructor', 'Stores must be provided'));
        }
        if(!options.store.state){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MyGoToAnimator', 'constructor', 'Store state must be provided'));
        }
        if(!options.store.locations){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MyGoToAnimator', 'constructor', 'Store locations must be provided'));
        }
        if (!options.dispatcher){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MyGoToAnimator', 'constructor', 'Dispatcher must be provided'));
		}

		this._store = options.store;
		this._stateStore = options.store.state;
		this._dispatcher = options.dispatcher;

		GoToAnimator.call(this, wwd);

		this.wwd = wwd;
		this.travelTime = 0;

		this._defaultLocation = [14,50];
		this._defaultRange = 10000000;
	};

	MyGoToAnimator.prototype = Object.create(GoToAnimator.prototype);

	/**
	 * Set the location according to current configuration
	 */
	MyGoToAnimator.prototype.setLocation = function(){
		var self = this;
		var stateStore = this._store.state;
		var currentState = stateStore.current();
		var places = currentState.locations;
		var dataset = currentState.scope;

		if (!dataset){
			console.warn(Logger.logMessage(Logger.LEVEL_WARNING, "MyGoToAnimator", "setLocation", "missingDataset"));
			this._store.state.removeLoadingOperation("ScopeLocationChanged");
		}
		else {
			var values = {dataset: dataset};
			if (places.length === 1){
				values.id = places[0];
			}

			this._store.locations.filter(values).then(function(response){
				if (response.length > 0){
					var points = [];
					response.forEach(function(location){
						if (location.bbox){
							var bbox = location.bbox.split(",");
                            var pointsForArea = self.getPointsFromBBox(bbox);
                            points = points.concat(pointsForArea);
                        } else if (location.geometry){
							location.geometry.coordinates.forEach(function(coord){
								points = points.concat(coord);
							});
						}
                    });
                    self.setLocationFromPointSet(points);
                } else {
                    console.warn(Logger.logMessage(Logger.LEVEL_WARNING, "MyGoToAnimator", "setLocation", "emptyResult"));
                    self.updateLocation(self._defaultLocation[0], self._defaultLocation[1], self._defaultRange);
                }
            }).catch(function(err){
                throw new Error(Logger.log(Logger.LEVEL_SEVERE, err));
            });
        }
    };

    /**
     * Set location and range based on given point set
     * @param points {Array} list of [lon,lat] points
     */
    MyGoToAnimator.prototype.setLocationFromPointSet = function(points){
        var json = this.getGeoJsonFromPoints(points);

        /**
         * get bounding box of point set
         */
        var bounds = d3.geoBounds(json);

        /**
         * add other two corners to bbox (due to more precise calculation of centroid)
         */
        bounds.push([bounds[0][0],bounds[1][1]]);
        bounds.push([bounds[1][0],bounds[0][1]]);

        /**
         * calculate centroid (it will be used as the reference postion of camera)
         */
        var centroid = this.getCentroid(bounds);

        /**
         * according to centroid, bounding box and other settings (window size ratio, area size and area size ratio),
         * update the position and range of the camera
         */
        var self = this;
        setTimeout(function(){
            var position = self.getPosition(centroid, bounds);
            self.updateLocation(position.lat, position.lon, position.alt);
        },100);
    };

    /**
     * It returns corners of bounding box and centroid in form of three [lon,lat] points
     * @param bbox {Array} 4 coordinates
     * @returns {Array} Corners and centroid
     */
    MyGoToAnimator.prototype.getPointsFromBBox = function(bbox){
        var points = [];

        var minLon = Number(bbox[0]);
        var minLat = Number(bbox[1]);
        var maxLon = Number(bbox[2]);
        var maxLat = Number(bbox[3]);
        points.push([minLon,minLat]);
        points.push([maxLon,maxLat]);
        points.push(this.getCentroid([[minLon,minLat],[maxLon,maxLat]]));

        return points;
    };

    /**
     * Zoom map to area (represented by bounding box)
     * @param bounds {Array} Bounding box represented by two pairs of coordinates
     */
    MyGoToAnimator.prototype.zoomToArea = function(bounds){
    	if (bounds.length === 4 && !_.isArray(bounds[0])){
    		bounds = [[bounds[0], bounds[1]], [bounds[2], bounds[3]]]
		} else if (_.isArray(bounds[0]) && bounds[0].length === 4){
    		var points = [];
    		var self = this;
    		bounds.forEach(function(bbox){
    			points.push(self.getPointsFromBBox(bbox));
			});
    		self.setLocationFromPointSet(_.flatten(points, true));
    		return;
		}

        var minLon = bounds[0][0];
        var minLat = bounds[0][1];
        var maxLon = bounds[1][0];
        var maxLat = bounds[1][1];

        var bottomLeft = bounds[0];
        var topRight = bounds[1];
        var bottomRight = [maxLon, minLat];
        var topLeft = [minLon, maxLat];

        var leftCentroid = this.getCentroid([bottomLeft, topLeft]);
        var topCentroid = this.getCentroid([topLeft, topRight]);
        var rightCentroid = this.getCentroid([topRight, bottomRight]);
        var bottomCentroid = this.getCentroid([bottomRight, bottomLeft]);

        var topCenter = [topCentroid[0], maxLat];
        var centerRight = [maxLon, rightCentroid[1]];
        var bottomCenter = [bottomCentroid[0], minLat];
        var centerLeft = [minLon, leftCentroid[1]];

        /**
         * add other two corners to bbox and center points of boundary segments (due to more precise calculation of centroid)
         */
        bounds.push([bounds[0][0],bounds[1][1]]);
        bounds.push([bounds[1][0],bounds[0][1]]);
        bounds.push(topCenter);
        bounds.push(centerRight);
        bounds.push(bottomCenter);
        bounds.push(centerLeft);

        /**
         * calculate centroid (it will be used as a postion of the camera)
         */
        var centroid = this.getCentroid(bounds);

        /**
         * according to centroid, bounding box and other settings (window size ratio, area size and area size ratio),
         * update the position and range of the camera
         */
        var self = this;
        setTimeout(function(){
            var position = self.getPosition(centroid, bounds);
            self.updateLocation(position.lat, position.lon, position.alt);
        },100);
    };

    /**
     * Update look at location and range
     * @param lat {number} Latitude of camera. From -90 to 90
     * @param lon {number} Longitude of camera. From -180 to 180
     * @param range {number} Distance from surface. From 0 to inf
     */
    MyGoToAnimator.prototype.updateLocation = function(lat, lon, range){
        this.wwd.navigator.lookAtLocation.latitude = lat;
        this.wwd.navigator.lookAtLocation.longitude = lon;
        this.wwd.navigator.range = range;

        this.wwd.redraw();
        this.wwd.redrawIfNeeded(); // TODO: Check with new releases. This isn't part of the public API and therefore might change.
        this._store.state.removeLoadingOperation("ScopeLocationChanged");
    };


    /**
	 * It converts list of points [lon,lat] to GeoJSON structure
	 * @param points {Array} list of points
	 * @returns {Object} GeoJSON
	 */
	MyGoToAnimator.prototype.getGeoJsonFromPoints = function(points){
		var json = {
			"type": "FeatureCollection",
			"features": []
		};
		points.forEach(function(point){
			json["features"].push({
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": point
				}
			})
		});
		return json;
	};

	/**
	 * Get position for camera from centroid and bbox
	 * @param centroid {[lon,lat]} coordinates of centroid
	 * @param bbox {[[{Number}, {Number}],[{Number}, {Number}]]} bottom left and top right corner of the bounding box
	 * @returns {{lat: number, lon: number, alt: number}}
	 */
	MyGoToAnimator.prototype.getPosition = function(centroid, bbox){
		var range = this.calculateRange(bbox);
		range = this.adjustRangeAccordingToProjection(range, centroid);
		this.checkRange(range);

		return {
			lat: centroid[1],
			lon: centroid[0],
			alt: range
		}
	};

	/**
	 * Calculate centroid from bounding box
	 * @param bbox {[[{Number}, {Number}],[{Number}, {Number}]]} bottom left and top right corner of the bounding box
	 * @returns {[lon,lat]} coordinates of centroid
	 */
	MyGoToAnimator.prototype.getCentroid = function(bbox){
		var json = this.getGeoJsonFromPoints(bbox);
		return d3.geoCentroid(json);
	};

    /**
     * Calculate range acording to distance between bounding box corners and map window size
     * @param bbox {[[{Number}, {Number}],[{Number}, {Number}]]} bottom left and top right corner of the bounding box
     * @returns {number} Range (distance from surface to camera)
     */
    MyGoToAnimator.prototype.calculateRange = function(bbox){
        const RANGE_COEFF = 140000;
        var windowSizeRatio = 1;

        var width = this.wwd.viewport.width;
        var height = this.wwd.viewport.height;
        var range = this._defaultRange;
        var diagonalDistance_1 = d3.geoDistance(bbox[0], bbox[1]);
        var diagonalDistance_2 = d3.geoDistance(bbox[3], bbox[2]);

        var meridianDistance = d3.geoDistance(bbox[0], bbox[2]);
        var parallelDistance_1 = d3.geoDistance(bbox[0], bbox[3]);
        var parallelDistance_2 = d3.geoDistance(bbox[1], bbox[2]);
        var parallelDistance = parallelDistance_1;
        if (parallelDistance_2 > parallelDistance_1){
            parallelDistance = parallelDistance_2;
        }

        if (Math.abs(diagonalDistance_1 - diagonalDistance_2) > 0.000001){
            console.error("MyGoToAnimator#calculate range: A control distance calculation is higher than a limit.");
            return range;
        }

        // calculate window size ratio
        if (width > 1 && height > 1){
            windowSizeRatio = width/height;
            if (windowSizeRatio < 1){
                windowSizeRatio = 1/windowSizeRatio;
            }
        }

        // calculate area size ratio
        var areaSizeRatio = parallelDistance/meridianDistance;

        // distance between bounding box corners in degrees
        var distanceInDegrees = diagonalDistance_1 * (180/Math.PI);
        if (distanceInDegrees < 0.01){
            distanceInDegrees = 0.01;
        }

        // Calculate range
        range = distanceInDegrees*RANGE_COEFF*windowSizeRatio;

        // Adjust range for specific options
        if (areaSizeRatio > 2 && windowSizeRatio > 1.5 && distanceInDegrees < 20){
            range /= windowSizeRatio;
        }

        // TODO Solve this for locations with high altitude (e.g. mountains)
        if (range < 1000) {
            return 1000;
        }
        return range;
    };

	/**
	 * Check range value. If the value is higher than
	 * @param range {number}
	 */
	MyGoToAnimator.prototype.checkRange = function(range){
		var is2D = !this._stateStore.current().isMap3D;

		if (range < 1000000){
    		this._dispatcher.notify("toolBar#disable3DMapButton");
    		if (is2D){
				this._dispatcher.notify("toolBar#click3DMapButton");
			}
		} else {
			this._dispatcher.notify("toolBar#enable3DMapButton");
		}

		return range;
	};

	/**
	 * Adjust range according to projection
	 * @param range {number}
	 * @param position {Array} coordinates of camera
	 * @returns {number} adjustec range
	 */
	MyGoToAnimator.prototype.adjustRangeAccordingToProjection = function(range, position){
		var is2D = !this._stateStore.current().isMap3D;
		if (is2D){
			var latitude = position[1];
			return (range/Math.abs(Math.cos(latitude)));
		} else {
			return range;
		}
	};

	return MyGoToAnimator;
});
