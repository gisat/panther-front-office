define([
	'../BaseStore',
	'../Stores',
	'../../data/Layer'
], function(BaseStore,
			Stores,
			Layer){
	"use strict";
	var layers;

	/**
	 * Store for retrieval of layers from the API.
	 * @augments BaseStore
	 * @constructor
	 * @alias Layers
	 */
	var Layers = function() {
		BaseStore.apply(this, arguments);
	};

	Layers.prototype = Object.create(BaseStore.prototype);

	/**
	 * @inheritDoc
	 */
	Layers.prototype.getInstance = function(layerData) {
		return new Layer({data: layerData});
	};

	/**
	 * @inheritDoc
	 */
	Layers.prototype.getPath = function() {
		return "rest/layer";
	};

	if(!layers) {
		layers = new Layers();
		Stores.register('layer', layers);
	}
	return layers;
});