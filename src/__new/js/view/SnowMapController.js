define([
	'jquery'
], function (
	$
) {
	"use strict";

	var SnowMapController = function(options) {
		this._iFrame = options.iFrame;
	};

	SnowMapController.prototype.rebuild = function(){
		this.addSceneShowOnClickListener();
	};

	SnowMapController.prototype.addSceneShowOnClickListener = function(){
		var self = this;
		this._iFrameBodySelector = $("#" + this._iFrame.getElementId()).contents().find("body");
		this._iFrameBodySelector.off("click.composites").on("click.composites", ".ptr-composites-composite", function(){
			var id = $(this).attr("data-id");
			self.addCompositeToMap(id);
		});
	};

	SnowMapController.prototype.addCompositeToMap = function(compositeId){
		this._map = OlMap.map;
		// remove old wms
		// add new one
		var layer = this.createWmsLayer(compositeId);
		this._map.addLayer(layer);
		var layerr = this._map.getLayersByName(compositeId)[0];
		layerr.visibility = true;
		layer.redraw();
	};

	SnowMapController.prototype.createWmsLayer = function(layerId){
		return new OpenLayers.Layer.WMS(layerId,
			"http://35.165.51.145/geoserver/geonode/wms",
			{layers: "geonode:" + layerId});
	};

	return SnowMapController;
});

