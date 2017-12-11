define([
	'../BaseStore',
	'../Stores',
	'../../data/Dataview'
], function(BaseStore,
			Stores,
			Dataview){
	"use strict";
	var dataviews;

	/**
	 * Store for retrieval of Dataviews from the API.
	 * @augments BaseStore
	 * @constructor
	 * @alias Dataviews
	 */
	var Dataviews = function() {
		BaseStore.apply(this, arguments);
	};

	Dataviews.prototype = Object.create(BaseStore.prototype);

	/**
	 * @inheritDoc
	 */
	Dataviews.prototype.getInstance = function(dataviewData) {
		return new Dataview({data: dataviewData});
	};

	/**
	 * @inheritDoc
	 */
	Dataviews.prototype.getPath = function() {
		return "rest/dataview";
	};

	if(!dataviews) {
		dataviews = new Dataviews();
		Stores.register('dataview', dataviews);
	}
	return dataviews;
});
