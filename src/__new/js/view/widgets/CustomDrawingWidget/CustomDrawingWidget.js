define([
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'./DrawCustomAU',
	'./DrawCustomLines',
	'../../../util/Logger',
	'../../map/Map',
	'../../../util/Remote',
	'../../table/Table',
	'../Widget',

	'resize',
	'jquery',
	'string',
	'text!./CustomDrawingWidgetBody.html',
	'css!./CustomDrawingWidget'
], function(ArgumentError,
			NotFoundError,
			DrawCustomAU,
			DrawCustomLines,
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
	 * Class representing the Custom Drawing Widget
	 * @param options {Object}
	 * @param options.elementId {String} ID of widget
	 * @param options.targetId {String} ID of an element in which should be the widget rendered
	 * @param options.name {String} Name of the widget
	 * @constructor
	 */
	var CustomDrawingWidget = function(options) {
		Widget.apply(this, arguments);

		if (!options.elementId){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "CustomDrawingWidget", "constructor", "missingElementId"));
		}
		if (!options.targetId){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "CustomDrawingWidget", "constructor", "missingTargetElementId"));
		}

		this._name = options.name || "";
		this._widgetId = options.elementId;
		this._target = $("#" + options.targetId);
		if (this._target.length == 0){
			throw new NotFoundError(Logger.logMessage(Logger.LEVEL_SEVERE, "CustomDrawingWidget", "constructor", "missingHTMLElement"));
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

	CustomDrawingWidget.prototype = Object.create(Widget.prototype);

	/**
	 * Build the basic structure of the widget
	 */
	CustomDrawingWidget.prototype.build = function(){
		this.buildContent();
		this.deleteFooter(this._widgetSelector);
	};

	/**
	 * Rebuild section with current settings
	 * @param attributes {Array} List of attributes depends on current settings
	 * @param map {OpenLayers.Map}
	 */
	CustomDrawingWidget.prototype.rebuild = function(attributes, map){
		if (!this._map){
			this._map = map;
		}

		this._auSection.rebuild(this._map);
		this._lineSection.rebuild(this._map);
	};

	/**
	 * Build content of the widget and initialize sections
	 */
	CustomDrawingWidget.prototype.buildContent = function(){
		var html = S(htmlBody).template({
			id: this._widgetId
		}).toString();
		this._widgetBodySelector.append(html);

		this._auSection = new DrawCustomAU({
			sectionId: this._widgetId + "-draw-polygons",
			targetId: this._widgetId + "-draw-polygons"
		});

		this._lineSection = new DrawCustomLines({
			sectionId: this._widgetId + "-draw-lines",
			targetId: this._widgetId + "-draw-lines"
		});
	};

	return CustomDrawingWidget;
});