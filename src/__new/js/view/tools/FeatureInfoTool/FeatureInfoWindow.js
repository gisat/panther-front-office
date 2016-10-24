define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../../../util/Filter',
	'../../../util/viewUtils',

	'jquery',
	'string',
	'text!./FeatureInfoWindow.html',
	'css!./FeatureInfoWindow'
], function (ArgumentError,
			 NotFoundError,
			 Logger,

			 Filter,
			 viewUtils,

			 $,
			 S,
			 htmlContent) {
	"use strict";

	/**
	 * It creates the window for deature info functionality
	 * @param options {Object}
	 * @param options.id {string} id of the element
	 * @param options.target {Object} JQuery object
	 * @constructor
	 */
	var FeatureInfoWindow = function (options) {
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "FeatureInfoWindow", "constructor", "missingElementId"));
		}
		if (!options.target){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "FeatureInfoWindow", "constructor", "missingTargetElement"));
		}

		this._id = options.id;
		this._target = options.target;

		this.build();
	};

	/**
	 * Rebuild the content of Feature Info window
	 * @param attributes {Array}
	 * @param gid {string}
	 */
	FeatureInfoWindow.prototype.rebuild = function(attributes, gid){
		var self = this;
		new Filter().featureInfo(attributes, gid).then(function(info){
			var content = "";
			var attributes = info[0].attributes;
			for (var item in attributes){
				if (attributes.hasOwnProperty(item)){
					var value = attributes[item];
					if (typeof value == "number"){
						value = viewUtils.numberFormat(value, true, 2);
					}
					content += '<tr><td>' + item + '</td><td>' + value + '</td></tr>';
				}
			}
			console.log(self._id);
			self._infoWindow.find(".feature-info-window-header").html(info[0].name + " (" + info[0].gid + ")");
			self._infoWindow.find(".feature-info-window-body table").html(content);
		});
	};

	/**
	 * Build basic structure of info window
	 */
	FeatureInfoWindow.prototype.build = function(){
		var html = S(htmlContent).template({
			id: this._id
		}).toString();
		this._target.append(html);
		this._infoWindow = $("#" + this._id);
	};

	/**
	 * Showing/hiding info window
	 * @param option {string} show or hide
	 */
	FeatureInfoWindow.prototype.setVisibility = function(option){
		if (option == "show"){
			this._infoWindow.show(200);
		} else if (option == "hide"){
			this._infoWindow.hide(200);
		}
	};

	/**
	 * Set the position of info window on the screen
	 * @param coordinates {Object}
	 * @param coordinates.x {number}
	 * @param coordinates.y {number}
	 */
	FeatureInfoWindow.prototype.setScreenPosition = function(coordinates){
		var mapOffsetTop = $('#app-map').offset().top;
		this._infoWindow.offset({
			top: coordinates.y + mapOffsetTop + 5,
			left: coordinates.x + 5
		});
	};

	return FeatureInfoWindow;
});