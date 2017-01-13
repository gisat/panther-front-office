define([
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'./DrawCustomAU',
	'../../../util/Logger',
	'../../map/Map',
	'../../../util/Remote',
	'../../table/Table',
	'../Widget',

	'resize',
	'jquery',
	'string',
	'text!./CustomPolygonsWidgetBody.html',
	'css!./CustomPolygonsWidget'
], function(ArgumentError,
			NotFoundError,
			DrawCustomAU,
			Logger,
			Map,
			Remote,
			Table,
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
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "CustomPolygonsWidget", "constructor", "missingElementId"));
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

	/**
	 * Build the basic structure of the widget
	 */
	CustomPolygonsWidget.prototype.build = function(){
		this.buildContent();
		this.deleteFooter(this._widgetSelector);
	};

	/**
	 * Rebuild section with current settings
	 * @param attributes {Array}
	 * @param map
	 */
	CustomPolygonsWidget.prototype.rebuild = function(attributes, map){
		if (!this._map){
			this._map = map;
		}

		this._drawingSection.rebuild(this._map);
	};

	/**
	 * Build content of the widget
	 */
	CustomPolygonsWidget.prototype.buildContent = function(){
		var html = S(htmlBody).template({
			id: this._widgetId
		}).toString();
		this._widgetBodySelector.append(html);

		this._drawingSection = new DrawCustomAU({
			sectionId: this._widgetId + "-draw-polygons",
			targetId: this._widgetId + "-draw-polygons"
		})
	};

	return CustomPolygonsWidget;
});