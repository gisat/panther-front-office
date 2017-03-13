define([
	'../BaseStore',
	'../Stores',
	'../../data/WmsLayer'
], function(BaseStore,
			Stores,
			WmsLayer){
	"use strict";
	var layers;

	/**
	 * Store for retrieval of WMS Layers from the API.
	 * @augments BaseStore
	 * @constructor
	 * @alias WmsLayers
	 */
	var WmsLayers = function() {
		BaseStore.apply(this, arguments);
	};

	WmsLayers.prototype = Object.create(BaseStore.prototype);

	/**
	 * @inheritDoc
	 */
	WmsLayers.prototype.getInstance = function(layerData) {
		return new WmsLayer({data: layerData});
	};

	/**
	 * @inheritDoc
	 */
	WmsLayers.prototype.getPath = function() {
		return "rest/wms/layer";
	};

	if(!layers) {
		layers = new WmsLayers();
		Stores.register('wmsLayer', layers);
	}
	return layers;
});
