define([
	'../error/ArgumentError',
	'../util/Logger'
], function (ArgumentError,
			 Logger) {
    /**
	 *
     * @param options
	 * @param options.store
	 * @param options.store.state {StateStore}
     * @constructor
     */
	var DataMining = function(options) {
        if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'DataMining', 'constructor', 'Stores must be provided'));
        }
        if(!options.store.state){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'DataMining', 'constructor', 'Store state must be provided'));
        }

        this._store = options.store;
	};

	/**
	 * TODO fix for All places and refactor
	 * Get a list of base layers resources for current analytical units
	 * @params currentPeriod {number}
	 * @returns {Array} List of base layers
	 */
	DataMining.prototype.getAuBaseLayers = function(currentPeriod){
		var appState = this._store.state.current();

		var locations = appState.places;
		if (!locations || locations[0] === "All places"){
			locations = appState.allPlaces;
		}

		var period = currentPeriod;
		if (!period){
			period = appState.periods[0];
		}

		var areaTemplate = appState.currentAuAreaTemplate;
		var auRefMap = appState.auRefMap;

		var layers = [];
		for (var place in auRefMap){
			locations.forEach(function(location){
				if (auRefMap.hasOwnProperty(place) && place == location){
					for (var aTpl in auRefMap[place]){
						if (auRefMap[place].hasOwnProperty(aTpl) && aTpl == areaTemplate){
							for (var currentYear in auRefMap[place][aTpl]){
								if (auRefMap[place][aTpl].hasOwnProperty(currentYear) && currentYear == period){
									var unit = auRefMap[place][aTpl][currentYear];
									if (unit.hasOwnProperty("_id")){
										layers.push(Config.geoserver2Workspace + ':layer_'+unit._id);
									}
								}
							}
						}
					}
				}
			});
		}
		return layers;
	};

	/**
	 * @param data {string}
	 * @returns {boolean} true, if data is in JSON format
	 */
	DataMining.prototype.isJson = function(data){
		var ret = true;
		try {
			return JSON.parse(data);
		}
		catch(e) {
			return false;
		}
		return ret;
	};

	return DataMining;
});