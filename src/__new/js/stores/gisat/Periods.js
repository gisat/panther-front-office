define([
	'../BaseStore',
	'../Stores',
	'../../data/Period'
], function(BaseStore,
			Stores,
			Period){
	"use strict";
	var periods;

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

	if(!periods) {
		periods = new Periods();
		Stores.register('period', periods);
	}
	return periods;
});
