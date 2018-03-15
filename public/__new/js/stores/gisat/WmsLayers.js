define([
	'../BaseStore',
	'../../data/WmsLayer'
], function(BaseStore,
			WmsLayer){
	"use strict";

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

	WmsLayers.prototype.loaded = function(models) {
		window.Stores.notify("WMS_LAYERS_LOADED", models);
	};

	return WmsLayers;
});
