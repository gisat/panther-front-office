define([
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../inputs/checkbox/Checkbox',
	'./CustomDrawingSection',

	'jquery',
	'string',
	'underscore',
	'text!./DrawCustomAU.html',
	'css!./DrawCustomAU.css'
], function(ArgumentError,
			NotFoundError,
			Logger,

			Checkbox,
			CustomDrawingSection,

			$,
			S,
			_,
			DrawCustomAUHtml){

	/**
	 * Class representing Draw Custom AU section
	 * @param options {Object}
	 * @constructor
	 */
	var DrawCustomAU = function(options) {
		CustomDrawingSection.apply(this, arguments);

		if (!options.sectionId){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "DrawCustomAU", "constructor", "missingElementId"));
		}
		if (!options.targetId){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "DrawCustomAU", "constructor", "missingTargetElementId"));
		}

		this._sectionId = options.sectionId;
		this._target = $("#" + options.targetId);

		if (this._target.length == 0){
			throw new NotFoundError(Logger.logMessage(Logger.LEVEL_SEVERE, "DrawCustomAU", "constructor", "missingHTMLElement"));
		}

		this.build(DrawCustomAUHtml, {
            drawCustomAnalyticalUnits: polyglot.t("drawCustomAnalyticalUnits"),
            exportLayerToGeoJson: polyglot.t("exportLayerToGeoJson"),
            exportLayerToShp: polyglot.t("exportLayerToShp"),
            activateDrawing: polyglot.t("activateDrawing")
		});

		this._buttonDraw = $("#button-draw-polygons");
		this._section = $("#custom-au-container");
		this._exportSHPbutton = this._section.find("#polygons-export-shp");
		this._exportJSONbutton = this._section.find("#polygons-export-json");
	};

	DrawCustomAU.prototype = Object.create(CustomDrawingSection.prototype);

	/**
	 * Build checkbox for showing/hidding of layer
	 * @returns {Checkbox}
	 */
	DrawCustomAU.prototype.buildLayerCheckbox = function(){
		return new Checkbox({
			id: this._sectionId + "-layer-checkbox",
			name: polyglot.t("showCustomAnalyticalUnitsLayer"),
			checked: true,
			target: this._section.find(".layer-check"),
			containerId: this._sectionId
		});
	};

	/**
	 * Check if place is selected and if there is only one AU level
	 */
	DrawCustomAU.prototype.checkConf = function(){
		var section = $("#custom-au-container");
		var info = $("#custom-au-info");

		if (ThemeYearConfParams.place.length == 0){
			section.css("display", "none");
			info.css("display","block");
			info.find("p").html(polyglot.t("drawCustomAnalyticalUnitsIsDisabled"));
			return false;
		} else {
			section.css("display", "block");
			info.css("display","none");
			return true;
		}
	};

	/**
	 * Prepare map for drawing, add layer and attach drawing control
	 * @param map {Map}
	 */
	DrawCustomAU.prototype.prepareMap = function(map){
		this._map = map;
		this._map.rebuild();
		this._vectorLayer = this._map.addLayerForDrawing("drawPolygons","#FA6900");
		this._drawControl = this._map.addControlsForPolygonDrawing(this._vectorLayer, this.addDrawEndListener.bind(this));
	};

	/**
	 * Sent data for polygon saving to server
	 * @param params {Object}
	 * @returns {JQuery}
	 */
	DrawCustomAU.prototype.saveRequest = function(params){
		var parameters = jQuery.extend(true, {}, params);
		if (parameters.data.hasOwnProperty("olid")){
			delete parameters.data.olid;
		}

		return $.post(Config.url + "customfeatures/savepolygon", parameters)
	};

	/**
	 * Get data about custom polygons from server
	 * @returns {JQuery}
	 */
	DrawCustomAU.prototype.selectRequest = function(params){
		return $.post(Config.url + "customfeatures/selectpolygons", params)
	};

	/**
	 * Delete custom polygon
	 * @param params {Object}
	 * @param params.id {String}
	 * @returns {JQuery}
	 */
	DrawCustomAU.prototype.deleteRequest = function(params){
		return $.post(Config.url + "customfeatures/deletepolygon", params)
	};

	return DrawCustomAU;
});