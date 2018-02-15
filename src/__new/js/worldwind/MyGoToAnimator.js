define(['../error/ArgumentError',
	'../error/NotFoundError',
	'../util/Logger',
	'js/stores/Stores',

	'd3',
	'jquery',
	'underscore',
	'worldwind'
], function(ArgumentError,
			NotFoundError,
			Logger,
			Stores,

			d3,
			$,
			_
){
	var GoToAnimator = window.WorldWind.GoToAnimator;

	/**
	 * Class extending the WorldWind.GoToAnimator class
	 * @param wwd {WorldWindow} The World Window in which to perform the animation.
	 * @constructor
	 */
	var MyGoToAnimator = function(wwd){
		if (!wwd){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MyGoToAnimator", "constructor", "missingWorldWind"));
		}

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
		this._stateStore = Stores.retrieve("state");
		var currentState = this._stateStore.current();
		var places = currentState.places;
		var dataset = currentState.scope;

		console.log('MyGoToAnimator#setLocation CurrentState: ', currentState);
		if (!dataset){
			console.warn(Logger.logMessage(Logger.LEVEL_WARNING, "MyGoToAnimator", "setLocation", "missingDataset"));
			this._stateStore.removeLoadingOperation("ScopeLocationChanged");
		}
		else {
			var values = {dataset: dataset};
			if ((places[0] !== 'All places') && places.length === 1){
				values.id = places[0];
			}

			Stores.retrieve("location").filter(values).then(function(response){
				console.log('MyGoToAnimator#setLocation Location: ', response);
				if (response.length > 0){
					var points = [];
					response.forEach(function(location){
						if (location.bbox){
							var bbox = location.bbox.split(",");
							var minLon = Number(bbox[0]);
							var minLat = Number(bbox[1]);
							var maxLon = Number(bbox[2]);
							var maxLat = Number(bbox[3]);
							points.push([minLon,minLat]);
							points.push([maxLon,maxLat]);
							points.push(self.getCentroid([[minLon,minLat],[maxLon,maxLat]]));
						}
					});
					var json = self.getGeoJsonFromPoints(points);
					var bounds = d3.geoBounds(json);

					// add other two corners to bbox
					bounds.push([bounds[0][0],bounds[1][1]]);
					bounds.push([bounds[1][0],bounds[0][1]]);

					var centroid = self.getCentroid(bounds);

					setTimeout(function(){
						var position = self.getPosition(centroid, bounds);
						self.updateLocation(position.lat, position.lon, position.alt);
					},100);
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
	 * Get position for camera from centroid and bbox
	 * @param centroid {[lon,lat]} coordinates of centroid
	 * @param bbox {[[{Number}, {Number}],[{Number}, {Number}]]} bottom left and top right corner of the bounding box
	 * @returns {{lat: number, lon: number, alt: number}}
	 */
	MyGoToAnimator.prototype.getPosition = function(centroid, bbox){
		return {
			lat: centroid[1],
			lon: centroid[0],
			alt: this.calculateRange(bbox)
		}
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
		this._stateStore.removeLoadingOperation("ScopeLocationChanged");
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
		const RANGE_COEFF = 130000;
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
		}

		// calculate area size ratio
		var areaSizeRatio = parallelDistance/meridianDistance;

		// distance between bounding box corners in degrees
		var distanceInDegrees = diagonalDistance_1 * (180/Math.PI);

		// Calculate range
		range = distanceInDegrees*RANGE_COEFF*windowSizeRatio;

		// Adjust range for specific options
		if (areaSizeRatio > 2 && windowSizeRatio > 1.5 && distanceInDegrees < 20){
			range /= windowSizeRatio;
		}

		return range;
	};

	return MyGoToAnimator;
});
