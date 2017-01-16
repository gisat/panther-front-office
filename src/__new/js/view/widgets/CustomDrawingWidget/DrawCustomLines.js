define([
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'./CustomDrawingSection',

	'jquery',
	'string',
	'underscore',
	'text!./DrawCustomLines.html',
	'css!./DrawCustomLines.css'
], function(ArgumentError,
			NotFoundError,
			Logger,

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

		this.build(DrawCustomLinesHtml);

		this._buttonDraw = $("#button-draw-lines");
		this._buttonClear = $("#button-clear-lines");
		this._buttonSave = $("#button-save-lines");
	};

	DrawCustomLines.prototype = Object.create(CustomDrawingSection.prototype);

	/**
	 * Rebuild section with current map
	 * @param map
	 */
	DrawCustomLines.prototype.rebuild = function(map){
		if (!this._map){
			this._map = map;
			this._map.rebuild();
			this._vectorLayer = this._map.addLayerForDrawing("drawLines","#00ff00");
			this._drawControl = this._map.addControlsForLineDrawing(this._vectorLayer, this.addDrawEndListener.bind(this));
			this.addEventListeners();
		}
		if (this._vectorLayer){
			this._vectorLayer.destroyFeatures();
		}

		this._records = [];
	};

	/**
	 * Clear all records
	 * @param event
	 */
	DrawCustomLines.prototype.clearAll = function(event){
		var conf = confirm("Do you really want to clear all lines?");
		if (conf == true) {
			this.destroy();
		}
	};

	/**
	 * Save all lines
	 * @param event
	 */
	DrawCustomLines.prototype.saveAll = function(event){
		var conf = confirm("Do you really want to sent lines?");
		if (conf == true) {
			console.log(this._records); // TODO sent to backend
			this.destroy();
		}
	};

	/**
	 * Set drawing style
	 * @param name {string} name of a feature
	 * @returns {{strokeWidth: number, strokeColor: string, fillColor: string, fontColor: string, fontSize: string, fontFamily: string, fontWeight: string}}
	 */
	DrawCustomLines.prototype.setDrawingStyle = function(name){
		var style = {
			strokeWidth: 5,
			strokeColor: "#33ff33",
			fillColor: "#33ff33",
			fontColor: "black",
			fontSize: "16px",
			fontFamily: "Arial, sans-serif",
			fontWeight: "bold"
		};
		if (name){
			style.label = name;
		}
		return style;
	};

	return DrawCustomLines;
});