define(['../../../actions/Actions',
	'../../../error/ArgumentError',
	'./FeatureInfoWindow',
	'../../../error/NotFoundError',
	'../../../util/Logger',
	'../../../view/map/Map',
	'../../View',

	'jquery',
	'string',
	'text!./FeatureInfoTool.html',
	'css!./FeatureInfoTool'
], function (Actions,
			 ArgumentError,
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
	 * @param options.id {string} id of the element
	 * @param options.control2dClass {string} class of the tool used in ExtJS to identify a tool
	 * @param options.dispatcher {Object}
	 * @constructor
	 */
	var FeatureInfoTool = function (options) {
		View.apply(this, arguments);
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "FeatureInfoTool", "constructor", "missingId"));
		}
		if (!options.control2dClass){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "FeatureInfoTool", "constructor", "missingElementClass"));
		}

		this._floaterTarget = $("body");
		this._control2dClass = options.control2dClass;
		this._id = options.id;
		this._dispatcher = options.dispatcher;

		this.build();
		this._dispatcher.addListener(this.onEvent.bind(this));
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
		this._control2dSelector = $('.' + this._control2dClass);
		if (this._control2dSelector.hasClass("x-btn-pressed")){
			this.trigger2dControlClick()
		}

		this._attributes = attributes;
		this.add2dControlListener(options.olMap);
	};

	/**
	 * Add on click listener to the feature button in Ext.
	 * @param map
	 */
	FeatureInfoTool.prototype.add2dControlListener = function(map){
		var self = this;
		$('body').off("click.featureInfo").on("click.featureInfo", '.' + this._control2dClass, function () {
			var button = $(this);
			setTimeout(function(){
				var active = button.hasClass("x-btn-pressed");
				if (active){
					map.rebuild();
					self._map = map;
					self.activateFor2D();
				} else {
					self.deactivateFor2D();
				}
			}, 50);
		});
	};

	FeatureInfoTool.prototype.activateFor2D = function(){
		this._map.addOnClickListener(this._attributes, this._infoWindow);
		this._map.onClickActivate();
	};

	FeatureInfoTool.prototype.activateFor3D = function(){
		debugger;
	};

	/**
	 * Deactivate feature info functionality for 2D map
	 */
	FeatureInfoTool.prototype.deactivateFor2D = function(){
		this.hideComponents();
		this._map.onClickDeactivate(this._infoWindow);
	};

	FeatureInfoTool.prototype.deactivateFor3D = function(){
		// TODO add functionality
	};

	/**
	 * Hide feature info window and settings window
	 */
	FeatureInfoTool.prototype.hideComponents = function(){
		this._infoWindow.setVisibility("hide");
		this._infoWindow._settings.close();
	};

	/**
	 * Trigger click on Ext Feature info control
	 */
	FeatureInfoTool.prototype.trigger2dControlClick = function(){
		this._control2dSelector.trigger("click")
	};

	/**
	 * @param type {string}
	 */
	FeatureInfoTool.prototype.onEvent = function (type) {
		if (type === Actions.mapSwitchFramework){
			if (this._control2dSelector.hasClass("x-btn-pressed")){
				this.trigger2dControlClick();
			}
		}
	};

	return FeatureInfoTool;
});