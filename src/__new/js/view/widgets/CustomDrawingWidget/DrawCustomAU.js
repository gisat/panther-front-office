define([
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'./CustomDrawingSection',

	'jquery',
	'string',
	'underscore',
	'text!./DrawCustomAU.html',
	'css!./DrawCustomAU.css'
], function(ArgumentError,
			NotFoundError,
			Logger,

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

		this.build(DrawCustomAUHtml);

		this._buttonDraw = $("#button-draw-polygons");
		this._buttonClear = $("#button-clear-polygons");
		this._buttonSave = $("#button-save-polygons");

		this._section = $("#custom-au-container");
		this._info = $("#custom-au-info");
	};

	DrawCustomAU.prototype = Object.create(CustomDrawingSection.prototype);

	/**
	 * Rebuild section with current map
	 * @param map 
	 */
	DrawCustomAU.prototype.rebuild = function(map){
		//if (OneLevelAreas.hasOneLevel){
		//	this._target.css("display","block");
		//	if (!this._map){
		//		this._map = map;
		//		this._map.rebuild();
		//		this._vectorLayer = this._map.addLayerForDrawing("drawPolygons","#00ff00");
		//		this._drawControl = this._map.addControlsForPolygonDrawing(this._vectorLayer, this.addDrawEndListener.bind(this));
		//		this.addEventListeners();
		//	}
		//	if (this._vectorLayer){
		//		this._vectorLayer.destroyFeatures();
		//	}
		//
		//	this._records = [];
		//
		//} else {
		//	this._target.css("display","none");
		//}
	};

	/**
	 * Clear all records
	 * @param event
	 */
	DrawCustomAU.prototype.clearAll = function(event){
		var conf = confirm("Do you really want to clear all polygons?");
		if (conf == true) {
			this.destroy();
		}
	};

	/**
	 * Save all polygons
	 * @param event
	 */
	DrawCustomAU.prototype.saveAll = function(event){
		var conf = confirm("Do you really want to sent polygons for calculation?");
		if (conf == true) {
			console.log(this._records); // TODO sent to backend
			var toSave = {
				data: this._records,
				dataset: Number(ThemeYearConfParams.dataset),
				periods: Number(ThemeYearConfParams.years.charAt(1)),
				location: Number(ThemeYearConfParams.place),
				areaTemplate: Number(ThemeYearConfParams.auCurrentAt)
			};
			console.log(toSave);
			//this.sendData(toSave);
			this.destroy();
		}
	};

	/**
	 * Send data to backend
	 * @param data {Object}
	 */
	DrawCustomAU.prototype.sendData = function(data){
		$.ajax({
			type: "POST",
			url: Config.url + "",
			data: data
		});
	};

	return DrawCustomAU;
});