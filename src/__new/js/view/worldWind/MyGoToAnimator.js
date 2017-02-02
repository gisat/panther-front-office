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
	 */
	MyGoToAnimator.prototype.setLocation = function(config){
		var self = this;
		var place = Number(config.place);
		var dataset = Number(config.dataset);

		if (!dataset){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MyGoToAnimator", "setLocation", "missingDataset"));
		}

		var values = {dataset: dataset};
		if (place){
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
				var location = self.getCentroidCoordinates(boundingBox);
				self.goTo(new WorldWind.Location(location.lat,location.lon));
			} else {
				console.warn(Logger.logMessage(Logger.LEVEL_WARNING, "MyGoToAnimator", "setLocation", "emptyResult"));
				self.goTo(new WorldWind.Location(self._defaultLoc[0],self._defaultLoc[1]));
			}
		}).catch(function(err){
			throw new Error(Logger.log(Logger.LEVEL_SEVERE, err));
		});
	};

	/**
	 * Get center of area from bounding box
	 * @param bbox {Object}
	 * @param bbox.minLat {number}
	 * @param bbox.maxLat {number}
	 * @param bbox.minLon {number}
	 * @param bbox.maxLon {number}
	 * @returns {{lat, lon}}
	 */
	MyGoToAnimator.prototype.getCentroidCoordinates = function(bbox){
		if (!bbox){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MyGoToAnimator", "getCentroidCoordinates", "missingParameter"));
		}
		return {
			lat: (bbox.maxLat + bbox.minLat)/2,
			lon: (bbox.maxLon + bbox.minLon)/2
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

	return MyGoToAnimator;
});
