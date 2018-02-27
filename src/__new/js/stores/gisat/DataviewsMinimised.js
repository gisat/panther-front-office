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
	var DataviewsMinimised = function() {
		BaseStore.apply(this, arguments);
	};

	DataviewsMinimised.prototype = Object.create(BaseStore.prototype);

	/**
	 * @inheritDoc
	 */
	DataviewsMinimised.prototype.getInstance = function(dataviewData) {
		return new Dataview({data: dataviewData});
	};

	/**
	 * @inheritDoc
	 */
	DataviewsMinimised.prototype.getPath = function() {
		return "rest/views";
	};

	if(!dataviews) {
		dataviews = new DataviewsMinimised();
		Stores.register('dataviewMinimised', dataviews);
	}
	return dataviews;
});
