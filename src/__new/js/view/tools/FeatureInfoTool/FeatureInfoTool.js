define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',
	'../../../view/map/Map',
	'../../View',

	'jquery',
	'string',
	'text!./FeatureInfoTool.html',
	'css!./FeatureInfoTool'
], function (ArgumentError,
			 NotFoundError,
			 Logger,
			 Map,
			 View,

			 $,
			 S,
             htmlContent) {
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
		var html = S(htmlContent).template().toString();
		this._target.append(html);
	};

	FeatureInfoTool.prototype.rebuild = function(attributes, map) {
		this.addOnClickListener(map);
	};

	FeatureInfoTool.prototype.addOnClickListener = function(map){
		var self = this;
		$('body').off("click.featureInfo").on("click.featureInfo", '#feature-info', function () {
			var button = $(this);
			self._active = !button.hasClass("active");
			button.toggleClass("active");

			if (self._active){
				if (!self._map){
					Observer.notify("featureInfo");
					map.rebuild(FeatureInfo.map);
					self._map = map;
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