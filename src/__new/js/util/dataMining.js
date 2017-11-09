define([
	'../stores/Stores'
], function (InternalStores) {

	/**
	 * TODO fix for All places and refactor
	 * Get a list of base layers resources for current analytical units
	 * @params currentPeriod {number}
	 * @returns {Array} List of base layers
	 */
	function getAuBaseLayers(currentPeriod){
		var appState = InternalStores.retrieve("state").current();

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
	}

	return {
		getAuBaseLayers: getAuBaseLayers
	};
});