define([
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',
	'../../map/Map',
	'../../../util/Remote',
	'../Widget',

	'resize',
	'jquery',
	'string',
	'text!./CustomPolygonsWidgetBody.html',
	'css!./CustomPolygonsWidget'
], function(ArgumentError,
			NotFoundError,
			Logger,
			Map,
			Remote,
			Widget,

			resize,
			$,
			S,
			htmlBody){

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

		Widget.prototype.build.call(this, {
			widgetId: this._widgetId,
			name: this._name,
			target: this._target
		});

		this._widgetSelector = $("#floater-" + this._widgetId);
		this._placeholderSelector = $("#placeholder-" + this._widgetId);
		this._widgetBodySelector = this._widgetSelector.find(".floater-body");

		this.build();
	};

	CustomPolygonsWidget.prototype = Object.create(Widget.prototype);

	CustomPolygonsWidget.prototype.build = function(){
		this.buildContent();
		this.deleteFooter(this._widgetSelector);
	};

	CustomPolygonsWidget.prototype.rebuild = function(attributes, map){
		this._map = map;
	};

	/**
	 * Build content of the widget
	 */
	CustomPolygonsWidget.prototype.buildContent = function(){
		var html = S(htmlBody).template().toString();
		this._widgetBodySelector.append(html);

		this.addEventListeners();
	};

	/**
	 * Event listeners
	 */
	CustomPolygonsWidget.prototype.addEventListeners = function(){
		var self = this;
		$("#button-draw-polygons").on("click", function(){
			var button = $(this);
			if (button.hasClass("active")){
				button.removeClass("active");
			} else {
				button.addClass("active");
				self.activatePolygonDrawing();
			}
		});
	};

	/**
	 * Activate drawing of polygons into the map
	 */
	CustomPolygonsWidget.prototype.activatePolygonDrawing = function(){
		this._map.rebuild();
		console.log(this._map);
	};

	return CustomPolygonsWidget;
});