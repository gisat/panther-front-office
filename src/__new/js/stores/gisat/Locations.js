define([
	'../BaseStore',
	'../Stores',
	'../../data/Location'
], function(BaseStore,
			Stores,
			Location){
	"use strict";
	var locations;

	/**
	 * Store for retrieval of Locations from the API.
	 * @augments BaseStore
	 * @constructor
	 * @alias Visualizations
	 */
	var Locations = function() {
		BaseStore.apply(this, arguments);
	};

	Locations.prototype = Object.create(BaseStore.prototype);

	/**
	 * @inheritDoc
	 */
	Locations.prototype.getInstance = function(locationData) {
		return new Location({data: locationData});
	};

	/**
	 * @inheritDoc
	 */
	Locations.prototype.getPath = function() {
		return "rest/location";
	};

	if(!locations) {
		locations = new Locations();
		Stores.register('location', locations);
	}
	return locations;
});
