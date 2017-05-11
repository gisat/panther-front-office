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
		this._iFrameBodySelector = $("#" + this._iFrame.getElementId()).contents().find("body");
		this._iFrameBodySelector.off("click.scenes").on("click.scenes", ".ptr-scenes-scene", function(){
			var id = $(this).attr("data-id");
			debugger;
		});
	};

	return SnowMapController;
});

