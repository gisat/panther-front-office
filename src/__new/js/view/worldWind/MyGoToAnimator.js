define(['../../error/ArgumentError',
	'../../error/NotFoundError',
	'../../util/Logger',
	'js/stores/Stores',

	'jquery',
	'underscore',
	'worldwind'
], function(ArgumentError,
			NotFoundError,
			Logger,
			Stores,

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
					var bboxes = [];
					response.forEach(function(location){
						var bbox = location.bbox.split(",");
						bboxes.push({
							minLon: Number(bbox[0]),
							maxLon: Number(bbox[2]),
							minLat: Number(bbox[3]),
							maxLat: Number(bbox[1])
						});
					});
					var boundingBox = self.getBoundingBox(bboxes);
					var position = self.getCentroidCoordinates(boundingBox);
					self.goTo(new WorldWind.Position(position.lat,position.lon,position.alt));
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
	 * Get center of area from bounding box
	 * @param bbox {Object}
	 * @param bbox.minLat {number}
	 * @param bbox.maxLat {number}
	 * @param bbox.minLon {number}
	 * @param bbox.maxLon {number}
	 * @returns {{lat, lon, alt}}
	 */
	MyGoToAnimator.prototype.getCentroidCoordinates = function(bbox){
		if (!bbox){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MyGoToAnimator", "getCentroidCoordinates", "missingParameter"));
		}
		return {
			lat: (bbox.maxLat + bbox.minLat)/2,
			lon: (bbox.maxLon + bbox.minLon)/2,
			alt: this.getAltitude(bbox.maxLat, bbox.minLat)
		}
	};

	/**
	 * Get overall bounding box from smaller bounding boxes
	 * @param boxes {Array}
	 * @returns {{minLat, maxLat, minLon, maxLon}}
	 */
	MyGoToAnimator.prototype.getBoundingBox = function(boxes){
		if (!boxes){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MyGoToAnimator", "getBoundingBox", "missingParameter"));
		}
		return {
			minLat: Math.min.apply(0, boxes.map(function(box) { return box.minLat; })),
			maxLat: Math.max.apply(0, boxes.map(function(box) { return box.maxLat; })),
			minLon: Math.min.apply(0, boxes.map(function(box) { return box.minLon; })),
			maxLon: Math.max.apply(0, boxes.map(function(box) { return box.maxLon; }))
		}
	};

	/**
	 * It returns altitude for current bounding box to display whole area in viewport.
	 * The coefficient is optimized for 16:9 landscape viewports.
	 * The method is NOT optimised for areas around poles and big areas. In those cases, it returns default value
	 *
	 * @param maxLat {number} maximum latitude of bounding box
	 * @param minLat {number} minimum latitude of bounding box
	 * @returns {number} altitude in meters
	 */
	MyGoToAnimator.prototype.getAltitude = function(maxLat, minLat){
		var difference = Math.abs(maxLat - minLat);
		var coef = 350000;
		if ((Math.abs(minLat) > 70 && Math.abs(maxLat) > 85)){
			return 10000000
		} else {
			return (difference*coef);
		}
	};

	return MyGoToAnimator;
});
