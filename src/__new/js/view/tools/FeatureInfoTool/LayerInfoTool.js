define(['../../../actions/Actions',
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'./FeatureInfoTool',
	'./LayerInfoWindow',
	'../../../stores/Stores',

	'jquery',
	'worldwind'
], function (Actions,
			 ArgumentError,
			 NotFoundError,
			 Logger,

			 FeatureInfoTool,
			 LayerInfoWindow,
			 InternalStores,

			 $) {
	"use strict";

	var LayerInfoTool = function (options) {
		FeatureInfoTool.apply(this, arguments);
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "FeatureInfoTool", "constructor", "missingId"));
		}
	};

	LayerInfoTool.prototype = Object.create(FeatureInfoTool.prototype);

	LayerInfoTool.prototype.rebuild = function() {
	};

	LayerInfoTool.prototype.build = function() {
		this._infoWindow = this.buildInfoWindow();
	};

	LayerInfoTool.prototype.buildInfoWindow = function(){
		return new LayerInfoWindow({
			target: this._floaterTarget,
			id: this._id + "-window",
			title: polyglot.t("layerInfo")
		});
	};

	LayerInfoTool.prototype.activate = function(){
		var self = this;
		var maps = InternalStores.retrieve('map').getAll();
		maps.forEach(function(map){
			map.layerInfoListener = map.getLayersInfo.bind(map, self.rebuildWindow.bind(self));
			map._wwd.addEventListener("click", map.layerInfoListener);
		});
	};

	LayerInfoTool.prototype.deactivate = function(){
		var self = this;
		var maps = InternalStores.retrieve('map').getAll();
		maps.forEach(function(map){
			if (map.layerInfoListener){
				map._wwd.removeEventListener("click", map.layerInfoListener);
			}
			self._infoWindow.setVisibility("hide");
		});
	};

	LayerInfoTool.prototype.rebuildWindow = function(data){
		this._infoWindow.rebuild(data);
	};

	return LayerInfoTool;
});