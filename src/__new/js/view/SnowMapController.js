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
	};

	return SnowMapController;
});

