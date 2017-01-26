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

		this._section = $("#custom-lines-container");
		this._info = $("#custom-lines-info");
	};

	DrawCustomLines.prototype = Object.create(CustomDrawingSection.prototype);

	/**
	 * Rebuild section with current map and load saved features
	 * @param map {Map}
	 */
	DrawCustomLines.prototype.rebuild = function(map){
		this._target.css("display","block");
		if (!this._map){
			this.prepareMap(map);
			this.addEventListeners();
		}
		if (this._vectorLayer){
			this._vectorLayer.destroyFeatures();
		}

		this.getSavedFeatures({
			scope: ThemeYearConfParams.dataset
		});
	};

	/**
	 * Prepare map for drawing
	 * @param map {Map}
	 */
	DrawCustomLines.prototype.prepareMap = function(map){
		this._map = map;
		this._map.rebuild();
		this._vectorLayer = this._map.addLayerForDrawing("drawLines","#00ff00");
		this._drawControl = this._map.addControlsForLineDrawing(this._vectorLayer, this.addDrawEndListener.bind(this));
	};

	/**
	 * Add event listeners to elements
	 */
	DrawCustomLines.prototype.addEventListeners = function(){
		var self = this;

		// activate/deactivate drawing on btn click
		this._buttonDraw.on("click", this.drawingActivation.bind(this));

		var table = this._table.getTable();
		// add listener for records deleting
		table.on("click",".button-delete-record", self.deleteFeature.bind(self));
		// add listener for records saving
		table.on("click",".button-save-record", self.saveFeature.bind(self));
	};

	/**
	 * Sent data for line saving to server
	 * @param params {Object}
	 * @returns {JQuery}
	 */
	DrawCustomLines.prototype.saveRequest = function(params){
		return $.post(Config.url + "customfeatures/saveline", params)
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