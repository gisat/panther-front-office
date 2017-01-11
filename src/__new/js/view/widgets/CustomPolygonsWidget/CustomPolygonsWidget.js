define([
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',
	'../../map/Map',
	'../../../util/Remote',
	'../Widget',

	'resize',
	'jquery',
	'css!./CustomPolygonsWidget'
], function(ArgumentError,
			NotFoundError,
			Logger,
			Map,
			Remote,
			Widget,

			resize,
			$){

	/**
	 * @param options {Object}
	 * @param options.elementId {String} ID of widget
	 * @param options.targetId {String} ID of an element in which should be the widget rendered
	 * @param options.name {String} Name of the widget
	 * @constructor
	 */
	var CustomPolygonsWidget = function(options) {
		Widget.apply(this, arguments);

		if (!options.elementId){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "CustomPolygonsWidgett", "constructor", "missingElementId"));
		}
		if (!options.targetId){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "CustomPolygonsWidget", "constructor", "missingTargetElementId"));
		}

		this._name = options.name || "";
		this._widgetId = options.elementId;
		this._target = $("#" + options.targetId);
		if (this._target.length == 0){
			throw new NotFoundError(Logger.logMessage(Logger.LEVEL_SEVERE, "CustomPolygonsWidget", "constructor", "missingHTMLElement"));
		}

		Widget.prototype.build.call(this, this._widgetId, this._target, this._name);

		this._widgetSelector = $("#floater-" + this._widgetId);
		this._placeholderSelector = $("#placeholder-" + this._widgetId);
		this._widgetBodySelector = this._widgetSelector.find(".floater-body");
	};

	CustomPolygonsWidget.prototype = Object.create(Widget.prototype);

	/**
	 * It rebuilds the widget.
	 * @param attributes {Array} List of attributes for current configuration
	 * @param map {Object}
	 */
	CustomPolygonsWidget.prototype.rebuild = function(attributes, map){
		console.log(map);
	};

	return CustomPolygonsWidget;
});