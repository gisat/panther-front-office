define(['../../error/ArgumentError',
	'../../error/NotFoundError',
	'../../util/Logger',
	'../../view/map/Map',
	'../View',

	'jquery'
], function (ArgumentError,
			 NotFoundError,
			 Logger,
			 Map,
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
		this.rebuild();
	};

	FeatureInfoTool.prototype.rebuild = function() {
		this.addOnClickListener();
	};

	FeatureInfoTool.prototype.addOnClickListener = function(){
		var self = this;
		$('body').off("click.featureInfo").on("click.featureInfo", '#feature-info', function () {
			var button = $(this);
			self._active = !button.hasClass("active");
			button.toggleClass("active");

			if (self._active){
				if (!self._map){
					Observer.notify("featureInfo");
					self._map = new Map({
						map: FeatureInfo.map
					});
					self._map.addOnClickListener();
				}
				self._map.onClickActivate();
			} else {
				self._map.onClickDeactivate();
			}
		});
	};

	return FeatureInfoTool;
});