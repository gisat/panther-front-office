define(['../../error/ArgumentError',
	'../../error/NotFoundError',
	'../../util/Logger',
	'../View',

	'jquery'
], function (ArgumentError,
			 NotFoundError,
			 Logger,
			 View,

			 $) {
	"use strict";

	var FeatureInfoTool = function (options) {
		View.apply(this, arguments);

		if (!options.elementId){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "FeatureInfoTool", "constructor", "missingElementId"));
		}
		if (!options.targetId){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "FeatureInfoTool", "constructor", "missingTargetElementId"));
		}

		this._target = $("#" + options.targetId);
		this._id = options.elementId;
		this._active = false;

		this.build();
	};

	FeatureInfoTool.prototype = Object.create(View.prototype);

	FeatureInfoTool.prototype.build = function() {
		this._target.append('<div id="feature-info" class="widget-button tool">Info</div>');
		this.addOnClickListener();
	};

	FeatureInfoTool.prototype.addOnClickListener = function(){
		var self = this;
		$('body').off("click.featureInfo").on("click.featureInfo", '#feature-info', function () {
			var button = $(this);
			self._active = !button.hasClass("active");
			button.toggleClass("active");

			if (self._active){
				Observer.notify("featureInfo");
				self.activate();
			}
		});
	};

	FeatureInfoTool.prototype.activate = function(){
		this._map = FeatureInfo.map;
		console.log(this._map);
	};

	return FeatureInfoTool;
});