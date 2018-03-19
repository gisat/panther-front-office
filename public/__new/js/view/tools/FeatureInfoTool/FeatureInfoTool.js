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
	'css!./FeatureInfoTool',
	'worldwind'
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
	 * @param options.dispatcher {Object} Object for handling events in the application.
	 * @param options.store {Object}
	 * @param options.store.map {MapStore}
	 * @param options.store.state {StateStore}
	 * @constructor
	 */
	var FeatureInfoTool = function (options) {
		View.apply(this, arguments);
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "FeatureInfoTool", "constructor", "missingId"));
		}

        if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'FeatureInfoTool', 'constructor', 'Stores must be provided'));
        }
        if(!options.store.map){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'FeatureInfoTool', 'constructor', 'Store map must be provided'));
        }
        if(!options.store.state){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'FeatureInfoTool', 'constructor', 'Store state must be provided'));
        }


        this._floaterTarget = $("body");
		this._id = options.id;
		this._dispatcher = options.dispatcher;
		this._store = options.store;

		this.build();
	};

	FeatureInfoTool.prototype = Object.create(View.prototype);

	/**
	 * Build Feature info basic content
	 */
	FeatureInfoTool.prototype.build = function() {
		this._infoWindow = this.buildInfoWindow(true, true, true);
	};

	/**
	 * Build new window for displaying information about feature
	 * @param resizable {boolean}
	 * @param hasSettings {boolean}
	 * @param hasFooter {boolean}
	 * @returns {FeatureInfoWindow}
	 */
	FeatureInfoTool.prototype.buildInfoWindow = function(resizable, hasSettings, hasFooter){
		return new FeatureInfoWindow({
			target: this._floaterTarget,
			id: this._id + "-window",
			resizable: resizable,
			hasSettings: hasSettings,
			hasFooter: hasFooter,
			store: {
				state: this._store.state
			}
		});
	};

	/**
	 * Rebuild Feature info for specific attributes and map. If the feautre info functionality is activated, deactivate it
	 * @param attributes {Array}
	 */
	FeatureInfoTool.prototype.rebuild = function(attributes) {
		this._attributes = attributes;
	};

	/**
	 * Activate feature info functionality for World Wind
	 */
	FeatureInfoTool.prototype.activateFor3D = function(){
		var self = this;
		var maps = this._store.map.getAll();
		maps.forEach(function(map){
			map.addClickRecognizer(self.onWorldWindClick.bind(self), "gid");
		});
	};

	/**
	 * Deactive feature info functionality for World wind map
	 */
	FeatureInfoTool.prototype.deactivateFor3D = function(){
		this.hideComponents();
		var maps = this._store.map.getAll();
		maps.forEach(function(map){
			map.disableClickRecognizer();
		});
	};

	/**
	 * Hide feature info window and settings window
	 */
	FeatureInfoTool.prototype.hideComponents = function(){
		this._infoWindow.setVisibility("hide");
		if (this._infoWindow._settings){
			this._infoWindow._settings.close();
		}
	};

	/**
	 * Execute on World wind map click
	 * @param period {number} id of period connected with current map
	 * @param gid {number} id of the gid
	 * @param screenCoord {Object} x:{number},y:{number} screen coordinates of click event
	 */
	FeatureInfoTool.prototype.onWorldWindClick = function(gid, period, screenCoord){
		if (gid){
			this._infoWindow.rebuild(this._attributes, gid, period);
			this._infoWindow.setVisibility("show");
			this._infoWindow.setScreenPosition(screenCoord .x, screenCoord.y, true);
		} else {
			this.hideComponents();
		}
	};

	return FeatureInfoTool;
});