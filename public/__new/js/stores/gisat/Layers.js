define([
	'../BaseStore',
	'../../data/Layer'
], function(BaseStore,
			Layer){
	"use strict";

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

	return Layers;
});