define([
	'../BaseStore',
	'../Stores',
	'../../data/LayerRef'
], function(BaseStore,
			Stores,
			LayerRef){
	"use strict";
	var layerRefs;

	/**
	 * Store for retrieval of LayerRefs from the API.
	 * @augments BaseStore
	 * @constructor
	 * @alias LayerRefs
	 */
	var LayerRefs = function() {
		BaseStore.apply(this, arguments);
	};

	LayerRefs.prototype = Object.create(BaseStore.prototype);

	/**
	 * @inheritDoc
	 */
	LayerRefs.prototype.getInstance = function(layerRefData) {
		return new LayerRef({data: layerRefData});
	};

	LayerRefs.prototype.filterByParams = function(params){
		return this.filter(params);
	};

	/**
	 * @inheritDoc
	 */
	LayerRefs.prototype.getPath = function() {
		return "rest/layerref";
	};

	if(!layerRefs) {
		layerRefs = new LayerRefs();
		Stores.register('layerRef', layerRefs);
	}
	return layerRefs;
});