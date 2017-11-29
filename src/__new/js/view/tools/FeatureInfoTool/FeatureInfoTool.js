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

	/**
	 * It creates Feature Info functionality
	 * @param options {Object}
	 * @param options.elementClass {string} class of the tool used in ExtJS to identify a tool
	 * @param options.targetId {string} id of the target element
	 * @constructor
	 */
	var FeatureInfoTool = function (options) {
		View.apply(this, arguments);
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "FeatureInfoTool", "constructor", "missingId"));
		}
		if (!options.elementClass){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "FeatureInfoTool", "constructor", "missingElementClass"));
		}

		this._floaterTarget = $("body");
		this._class = options.elementClass;
		this._id = options.id;

		this.build();
	};

	FeatureInfoTool.prototype = Object.create(View.prototype);

	/**
	 * Build Feature info basic content
	 */
	FeatureInfoTool.prototype.build = function() {
		this._infoWindow = this.buildInfoWindow();
	};

	/**
	 * Build new window for displaying information about feature
	 * @returns {Object}
	 */
	FeatureInfoTool.prototype.buildInfoWindow = function(){
		return new FeatureInfoWindow({
			target: this._floaterTarget,
			id: this._id + "-window",
			resizable: true
		});
	};

	/**
	 * Rebuild Feature info for specific attributes and map
	 * @param attributes {Array}
	 * @param options {Object}
	 * @param options.olMap {Map}
	 */
	FeatureInfoTool.prototype.rebuild = function(attributes, options) {
		this.addOnClickListener(attributes, options.olMap);
		this.deactivateComponents();
	};

	/**
	 * Add on click listener to the feature button. How do I figure out into which part of the map I clicked? Part of the
	 * question is what to do in the case of multiple maps.
	 * @param attributes
	 * @param map
	 */
	FeatureInfoTool.prototype.addOnClickListener = function(attributes, map){
		var self = this;
		$('body').off("click.featureInfo").on("click.featureInfo", '.' + this._class, function () {
			var button = $(this);
			setTimeout(function(){
				var active = button.hasClass("x-btn-pressed");
				if (active){
					map.rebuild();
					self._map = map;
					self._map.addOnClickListener(attributes, self._infoWindow);
					self._map.onClickActivate();
				} else {
					self._map.onClickDeactivate(self._infoWindow);
					self._infoWindow._settings.close();
				}
			}, 50);
		});
	};

	/**
	 * Deactivate feature info functionality
	 */
	FeatureInfoTool.prototype.deactivateComponents = function(){
		var featureInfoButton = $('.' + this._class);
		var activated = featureInfoButton.hasClass("x-btn-pressed");
		if (activated){
			featureInfoButton.trigger("click");
			this._infoWindow._settings.close();
		}
	};

	return FeatureInfoTool;
});