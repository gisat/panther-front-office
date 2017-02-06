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
	 * @param options {Object}
	 */
	CustomDrawingWidget.prototype.rebuild = function(attributes, options){
		if (options.config.dataset.length > 0){
			this.toggleWarning("none");
			if (!this._map){
				this._map = options.olMap;
			}
			this._auSection.rebuild(this._map);
			this._lineSection.rebuild(this._map);

		} else {
			this.toggleWarning("block", [5]);
		}
	};

	/**
	 * Build content of the widget and initialize sections
	 */
	CustomDrawingWidget.prototype.buildContent = function(){
		var html = S(htmlBody).template({
			id: this._widgetId
		}).toString();
		this._widgetBodySelector.append(html);
		this._widgetTabsMenu = $("#" + this._widgetId + "-menu");
		this.addEventListeners();

		this._auSection = new DrawCustomAU({
			sectionId: this._widgetId + "-draw-polygons",
			targetId: this._widgetId + "-draw-polygons"
		});

		this._lineSection = new DrawCustomLines({
			sectionId: this._widgetId + "-draw-lines",
			targetId: this._widgetId + "-draw-lines"
		});
	};

	/**
	 * Event listeners
	 */
	CustomDrawingWidget.prototype.addEventListeners = function(){
		this._widgetTabsMenu.find('a').click(this.switchTabs.bind(this));
	};

	/**
	 * Switch tabs
	 * @param e
	 */
	CustomDrawingWidget.prototype.switchTabs = function(e){
		this._widgetBodySelector.find('.widget-tab-title').removeClass("active");
		this._widgetBodySelector.find('.widget-tab').removeClass("active");

		$(e.target).closest('li').addClass('active');
		var target = $(e.target).closest('a').attr('data-target');
		$("#" + target).addClass('active');

		this._auSection.deactivateDrawing(this._auSection.getDrawingButton());
		this._lineSection.deactivateDrawing(this._lineSection.getDrawingButton());
	};

	return CustomDrawingWidget;
});