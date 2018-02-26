define([
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../inputs/checkbox/Checkbox',
	'./CustomDrawingSection',

	'jquery',
	'string',
	'underscore',
	'text!./DrawCustomLines.html',
	'css!./DrawCustomLines.css'
], function(ArgumentError,
			NotFoundError,
			Logger,

			Checkbox,
			CustomDrawingSection,

			$,
			S,
			_,
			DrawCustomLinesHtml){

	/**
	 * Class representing Draw Custom Lines section
	 * @param options {Object}
	 * @constructor
	 */
	var DrawCustomLines = function(options) {
		CustomDrawingSection.apply(this, arguments);

		if (!options.sectionId){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "DrawCustomLines", "constructor", "missingElementId"));
		}
		if (!options.targetId){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "DrawCustomLines", "constructor", "missingTargetElementId"));
		}

		this._sectionId = options.sectionId;
		this._target = $("#" + options.targetId);

		if (this._target.length == 0){
			throw new NotFoundError(Logger.logMessage(Logger.LEVEL_SEVERE, "DrawCustomLines", "constructor", "missingHTMLElement"));
		}

		this.build(DrawCustomLinesHtml, {
            drawingOfCustomLinesIsDisabled: polyglot.t("drawingOfCustomLinesIsDisabled"),
            drawGreenConnectivityLine: polyglot.t("drawGreenConnectivityLine"),
            activateDrawing: polyglot.t("activateDrawing"),
            exportLayerToGeoJson: polyglot.t("exportLayerToGeoJson"),
            exportLayerToShp: polyglot.t("exportLayerToShp")
		});

		this._buttonDraw = $("#button-draw-lines");
		this._section = $("#custom-lines-container");
		this._exportSHPbutton = this._section.find("#lines-export-shp");
		this._exportJSONbutton = this._section.find("#lines-export-json");
	};

	DrawCustomLines.prototype = Object.create(CustomDrawingSection.prototype);

	/**
	 * Prepare map for drawing
	 * @param map {Map}
	 */
	DrawCustomLines.prototype.prepareMap = function(map){
		this._map = map;
		this._map.rebuild();
		this._vectorLayer = this._map.addLayerForDrawing("drawLines","#FA6900");
		this._drawControl = this._map.addControlsForLineDrawing(this._vectorLayer, this.addDrawEndListener.bind(this));
	};

	/**
	 * Build checkbox for showing/hidding of layer
	 * @returns {Checkbox}
	 */
	DrawCustomLines.prototype.buildLayerCheckbox = function(){
		return new Checkbox({
			id: this._sectionId + "-layer-checkbox",
			name: "Show Green Connectivity Layer",
			checked: true,
			target: this._section.find(".layer-check"),
			containerId: this._sectionId
		});
	};

	/**
	 * Check if place is selected and if there is only one AU level
	 */
	DrawCustomLines.prototype.checkConf = function(){
		var section = $("#custom-lines-container");
		var info = $("#custom-lines-info");

		if (ThemeYearConfParams.place.length == 0){
			section.css("display", "none");
			info.css("display","block");
			info.find("p").html("Drawing of custom lines is disabled for All places option. To enable drawing, please select place (pilot).");
			return false;
		} else {
			section.css("display", "block");
			info.css("display","none");
			return true;
		}
	};

	/**
	 * Sent data for line saving to server
	 * @param params {Object}
	 * @returns {JQuery}
	 */
	DrawCustomLines.prototype.saveRequest = function(params){
		var parameters = jQuery.extend(true, {}, params);
		if (parameters.data.hasOwnProperty("olid")){
			delete parameters.data.olid;
		}
		return $.post(Config.url + "customfeatures/saveline", parameters)
	};

	/**
	 * Get data about custom lines from server
	 * @returns {JQuery}
	 */
	DrawCustomLines.prototype.selectRequest = function(params){
		return $.post(Config.url + "customfeatures/selectlines", params)
	};

	/**
	 * Delete custom line
	 * @param params {Object}
	 * @param params.id {String}
	 * @returns {JQuery}
	 */
	DrawCustomLines.prototype.deleteRequest = function(params){
		return $.post(Config.url + "customfeatures/deleteline", params)
	};

	return DrawCustomLines;
});