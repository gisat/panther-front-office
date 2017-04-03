define(['../../error/ArgumentError',
	'../../error/NotFoundError',
	'../../util/Logger',
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
		this._defaultLoc = [14,50];
	};

	MyGoToAnimator.prototype = Object.create(GoToAnimator.prototype);

	/**
	 * Set the location according to current configuration
	 * @param config {Object} ThemeYearConfParams (configuration from global variable)
	 * @param widget {JQuery} JQuery widget selector
	 */
	MyGoToAnimator.prototype.setLocation = function(config, widget){
		var self = this;
		var warningContainer = widget.find(".floater-body .warning");
		var place = Number(config.place);
		var dataset = Number(config.dataset);

		if (!dataset){
			console.warn(Logger.logMessage(Logger.LEVEL_WARNING, "MyGoToAnimator", "setLocation", "missingDataset"));
			warningContainer.css("display", "block").html("").append('<p>No dataset detected! Possible reasons: <br> Broken links in visualizations (e.g. non-existing attributes or attribute sets). Try to create visualizations again. <br> Choropleths includes non-existing attributes or attribute sets.</p>');
		}
		else {
			warningContainer.css("display", "none");

			var values = {dataset: dataset};
			if (place && place != 0){
				values.id = place;
			}

			Stores.retrieve("location").filter(values).then(function(response){
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
					var centroid = self.getCentroid(bounds);
					var position = self.getPosition(centroid, bounds);
					self.goTo(new WorldWind.Position(position.lat, position.lon, position.alt));
				} else {
					console.warn(Logger.logMessage(Logger.LEVEL_WARNING, "MyGoToAnimator", "setLocation", "emptyResult"));
					self.goTo(new WorldWind.Location(self._defaultLoc[0],self._defaultLoc[1]));
				}
			}).catch(function(err){
				throw new Error(Logger.log(Logger.LEVEL_SEVERE, err));
			});
		}
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
	 * Get position for camera from centroid and bbox
	 * @param centroid {[lon,lat]} coordinates of centroid
	 * @param bbox {[[{Number}, {Number}],[{Number}, {Number}]]} bottom left and top right corner of the bounding box
	 * @returns {{lat: number, lon: number, alt: number}}
	 */
	MyGoToAnimator.prototype.getPosition = function(centroid, bbox){
		return {
			lat: centroid[1],
			lon: centroid[0],
			alt: this.getAltitude(bbox)
		}
	};

	/**
	 * It returns altitude for current bounding box to display whole area in viewport.
	 * The coefficient is optimized for 16:9 landscape viewports.
	 * The method is NOT optimised for areas around poles and big areas. In those cases, it returns default value
	 *
	 * @param bbox {Array}
	 * @returns {number} altitude in meters
	 */
	MyGoToAnimator.prototype.getAltitude = function(bbox){
		var box = _.flatten(bbox);
		var minLon = box[0];
		var minLat = box[1];
		var maxLon = box[2];
		var maxLat = box[3];

		var differenceLat = Math.abs(maxLat - minLat);
		var differenceLon = Math.abs(maxLon - minLon);

		// for areas crossing date line
		if (Math.abs(maxLon - minLon) > 180  && maxLon < minLon){
			differenceLon = Math.abs(Math.abs(maxLon) - Math.abs(minLon));
		}

		var coef = 350000;
		if ((Math.abs(minLat) > 70 && Math.abs(maxLat) > 85) || differenceLat > 50 || differenceLon > 50){
			return 10000000
		} else {
			return (differenceLat*coef);
		}
	};

	return MyGoToAnimator;
});
