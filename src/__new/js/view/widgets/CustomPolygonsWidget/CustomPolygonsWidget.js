define([
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
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

	CustomPolygonsWidget.prototype.build = function(){
		this.buildContent();
		this.deleteFooter(this._widgetSelector);
	};

	CustomPolygonsWidget.prototype.rebuild = function(attributes, map){
		if (!this._map){
			this._map = map;
			this._map.rebuild();
			this._polygonVectorLayer = this._map.addLayerForDrawing("drawPolygons","#00ff00");
			this._drawControl = this._map.addControlsForDrawing(this._polygonVectorLayer, this.addDrawEndListener);
			this.addEventListeners();
		}

		if (this._polygonVectorLayer){
			this._polygonVectorLayer.destroyFeatures();
		}
	};

	/**
	 * Build content of the widget
	 */
	CustomPolygonsWidget.prototype.buildContent = function(){
		var html = S(htmlBody).template({
			id: this._widgetId
		}).toString();
		this._widgetBodySelector.append(html);
		this._table = new Table({
			targetId: this._widgetId + "-table-container",
			elementId: this._widgetId + "-table"
		});

		this._buttonDrawPolygons = $("#button-draw-polygons");
		this._buttonClearPolygons = $("#button-clear-polygons");
		this._buttonSavePolygons = $("#button-save-polygons");
	};

	/**
	 * Event listeners
	 */
	CustomPolygonsWidget.prototype.addEventListeners = function(){
		var self = this;

		this._buttonDrawPolygons.on("click", function(){
			var button = $(this);
			if (button.hasClass("active")){
				button.removeClass("active");
				self._drawControl.deactivate();
				if (self._polygonVectorLayer.features.length > 0){
					self.activateClearSaveButtons();
				}
			} else {
				button.addClass("active");
				self._drawControl.activate();
				self.deactivateClearSaveButtons();
			}
		});

		this._buttonClearPolygons.on("click", function(){
			self._polygonVectorLayer.destroyFeatures();
			self.deactivateClearSaveButtons();
		});

		this._buttonSavePolygons.on("click", function(){
			self.savePolygons();
			self._polygonVectorLayer.destroyFeatures();
			self.deactivateClearSaveButtons();
		});
	};

	CustomPolygonsWidget.prototype.addDrawEndListener = function(event){
		console.log(event.feature);
	};

	CustomPolygonsWidget.prototype.savePolygons = function(){
		var data = [];
		var self = this;
		this._polygonVectorLayer.features.forEach(function(feature){
			var unit = {
				geom: self._map.getPolygonVertices(feature),
				id: "0", //TODO generate uuid
				name: "aaa" //TODO add name from attributes
			};
			data.push(unit);
		});
		console.log(data);
	};

	CustomPolygonsWidget.prototype.deactivateClearSaveButtons = function(){
		this._buttonClearPolygons.attr("disabled",true);
		this._buttonSavePolygons.attr("disabled",true);
	};

	CustomPolygonsWidget.prototype.activateClearSaveButtons = function(){
		this._buttonClearPolygons.attr("disabled",false);
		this._buttonSavePolygons.attr("disabled",false);
	};

	return CustomPolygonsWidget;
});