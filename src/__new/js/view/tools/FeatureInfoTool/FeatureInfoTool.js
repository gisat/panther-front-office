define(['../../../error/ArgumentError',
	'./FeatureInfoWindow',
	'../../../error/NotFoundError',
	'../../../util/Logger',
	'../../../view/map/Map',
	'../../View',

	'jquery',
	'string',
	'text!./FeatureInfoTool.html',
	'css!./FeatureInfoTool'
], function (ArgumentError,
			 FeatureInfoWindow,
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

		this.build();
	};

	FeatureInfoTool.prototype = Object.create(View.prototype);

	/**
	 * Build Feature info basic content
	 */
	FeatureInfoTool.prototype.build = function() {
		var html = S(htmlContent).template({
			id: this._id
		}).toString();
		this._target.append(html);
		this._infoWindow = this.buildInfoWindow();
	};

	/**
	 * Build new window for displaying information about feature
	 * @returns {Object}
	 */
	FeatureInfoTool.prototype.buildInfoWindow = function(){
		return new FeatureInfoWindow({
			target: this._target,
			id: this._id + "-window"
		});
	};

	/**
	 * Rebuild Feature info for specific attributes and map
	 * @param attributes {Array}
	 * @param map {Object}
	 */
	FeatureInfoTool.prototype.rebuild = function(attributes, map) {
		this.addOnClickListener(attributes, map);
	};

	FeatureInfoTool.prototype.addOnClickListener = function(attributes, map){
		var self = this;
		$('body').off("click.featureInfo").on("click.featureInfo", '#feature-info', function () {
			var button = $(this);
			var active = !button.hasClass("active");
			button.toggleClass("active");

			if (active){
				Observer.notify("featureInfo");
				map.rebuild(FeatureInfo.map);
				self._map = map;
				self._map.addOnClickListener(attributes, self._infoWindow);
				self._map.onClickActivate();
			} else {
				self._map.onClickDeactivate(self._infoWindow);
			}
		});
	};

	return FeatureInfoTool;
});