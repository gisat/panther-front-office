define(['../../error/ArgumentError',
	'../../error/NotFoundError',
	'../Logger',
	'../Promise',
	'../RemoteJQ',

	'jquery',
	'wicket'
], function(ArgumentError,
			NotFoundError,
			Logger,
			Promise,
			RemoteJQ,

			$,
			wicket
){
	/**
	 * @param options {Object}
	 * @constructor
	 */
	var AnalyticalUnits = function(options){
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
	AnalyticalUnits.prototype.getUnits = function(conf){
		var self = this;
		var confUpdated = this.updateConfiguration(conf);
		if (confUpdated) {
			return this.loadUnits().then(this.parseUnits.bind(this));
		} else {
			return new Promise(function(resolve, reject){
				resolve(self._units);
			})
		}
	};

	/**
	 * It updates scope, locations and areaTemplate params
	 * @param conf {Object} configuration from global object ThemeYearConfParams
	 * @returns {boolean} true if at least one of parameters was updated
	 */
	AnalyticalUnits.prototype.updateConfiguration = function(conf){
		var datasetUpdated = this.updateDataset(conf);
		var atUpdated = this.updateAreaTemplate(conf);
		var locationsUpdated = this.updateLocations(conf);
		return datasetUpdated || atUpdated || locationsUpdated;
	};

	/**
	 * It updates dataset parameter
	 * @param conf {Object}
	 * @returns {boolean} True if dataset was updated
	 */
	AnalyticalUnits.prototype.updateDataset = function(conf){
		if (conf.hasOwnProperty("dataset") && conf.dataset.length != 0){
			var scope = Number(conf.dataset);
			if (scope != this._scope){
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
	AnalyticalUnits.prototype.updateAreaTemplate = function(conf){
		if (conf.hasOwnProperty("auCurrentAt") && conf.auCurrentAt.length != 0){
			var at = Number(conf.auCurrentAt);
			if (at != this._areaTemplate){
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
	AnalyticalUnits.prototype.updateLocations = function(conf){
		if (conf.hasOwnProperty("place") && conf.place.length != 0){
			var location = Number(conf.place);
			if (location != this._locations[0] || location.length == 1){
				this._locations = [location];
				return true;
			}
		} else if (conf.hasOwnProperty("allPlaces") && conf.allPlaces.length != 0){
			var locations = conf.allPlaces;
			if (locations[0] != this._locations[0] && locations.length > 1){
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
	AnalyticalUnits.prototype.parseUnits = function(units){
		var convertedUnits = [];
		var self = this;
		units.forEach(function(unit){
			var converted = self._wkt.read(unit.st_astext);
			unit.geometry = {
				coordinates: converted.components,
				type: converted.type
			};
			delete unit.st_astext;
			convertedUnits.push(unit);
		});
		return convertedUnits;
	};

	/**
	 * Load units from server
	 * @returns {Promise}
	 */
	AnalyticalUnits.prototype.loadUnits = function(){
		var self = this;
		return new RemoteJQ({
			url: "rest/au",
			params: {
				scope: this._scope,
				locations: JSON.stringify(this._locations),
				areaTemplate: this._areaTemplate
			}
		}).get().then(function(result){
			self._units = result.data;
			return self._units;
		});
	};

	return AnalyticalUnits;
});