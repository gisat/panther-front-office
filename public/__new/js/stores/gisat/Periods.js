define([
	'../BaseStore',
	'../../data/Period'
], function(BaseStore,
			Period){
	"use strict";

	/**
	 * Store for retrieval of Periods from the API.
	 * @augments BaseStore
	 * @constructor
	 * @alias Periods
	 */
	var Periods = function() {
		BaseStore.apply(this, arguments);
	};

	Periods.prototype = Object.create(BaseStore.prototype);

	/**
	 * @inheritDoc
	 */
	Periods.prototype.getInstance = function(data) {
		return new Period({data: data});
	};

	/**
	 * @inheritDoc
	 */
	Periods.prototype.getPath = function() {
		return "rest/year";
	};

	Periods.prototype.loaded = function(models) {
		window.Stores.notify("PERIODS_LOADED", models);
	};

	return Periods;
});
