define([
	'jquery'
], function (
	$
) {
	"use strict";

	var SnowMapController = function(options) {
		this._iFrame = options.iFrame;
		this._previousLayer = null;
	};

	SnowMapController.prototype.rebuild = function(){
		this.addCompositeShowOnClickListener();
	};

	/**
	 * Add listener to iframe inner element
	 */
	SnowMapController.prototype.addCompositeShowOnClickListener = function(){
		var self = this;
		this._iFrameBodySelector = $("#" + this._iFrame.getElementId()).contents().find("body");
		this._iFrameBodySelector.off("click.composites").on("click.composites", ".ptr-composites-composite", function(){
			var compositeId = $(this).attr("data-id");
			self.showCompositeInMap(compositeId);
		});
	};

	/**
	 * Remove previously added composite layer and show the new one
	 * @param compositeId {string} ID of the layer
	 */
	SnowMapController.prototype.showCompositeInMap = function(compositeId){
		Observer.notify("getMap");
		this._map = OlMap.map;

		if (this._previousLayer){
			this._map.removeLayer(this._previousLayer);
		}
		this.addCompositeToMap(compositeId, 0.7);
	};

	/**
	 * @param compositeId {string} ID of the layer
	 * @param opacity {number} layer opacity
	 */
	SnowMapController.prototype.addCompositeToMap = function(compositeId, opacity){
		var layer = this.createWmsLayer(compositeId);
		this._map.addLayer(layer);
		layer.visibility = true;
		layer.opacity = opacity;
		layer.redraw();
		this._previousLayer = layer;
	};

	/**
	 * @param layerId {string} ID of the layer
	 * @returns {OpenLayers.Layer.WMS}
	 */
	SnowMapController.prototype.createWmsLayer = function(layerId){
		return new OpenLayers.Layer.WMS(layerId,
			Config.snowUrl + "geoserver/geonode/wms",
			{layers: "geonode:" + layerId});
	};

	return SnowMapController;
});

