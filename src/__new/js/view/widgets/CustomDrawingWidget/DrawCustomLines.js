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

		this.getSavedFeatures();
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
	 * Get saved features from database
	 */
	DrawCustomLines.prototype.getSavedFeatures = function(){
		var self = this;
		this.selectRequest({
			scope: ThemeYearConfParams.dataset
		}).done(function(result){
			if (result.status == "OK"){
				self._records = result.data;
				self._table.rebuild(self._records);
				self._map.addFeaturesToVectorLayer(self._vectorLayer, self._records);

				// todo add features to the layer
			}
		});
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
		table.on("click",".button-delete-record", self.deleteLineFeature.bind(self));
		// add listener for records saving
		table.on("click",".button-save-record", self.saveLineFeature.bind(self));
	};

	/**
	 * Save line
	 * @param event
	 */
	DrawCustomLines.prototype.saveLineFeature = function(event){
		var feature = {
			data: this.addFeatureToList(event)
		};

		if (feature.data){
			this.saveRequest(feature).done(function(result){
				console.log(result);
				// TODO handle results - notification
			});
		}
	};

	/**
	 * Delete line
	 * @param event
	 */
	DrawCustomLines.prototype.deleteLineFeature = function(event){
		// TODO Add deleting confirmation
		var uuid = $(event.target).parents('tr').attr("data-uuid");

		var self = this;
		this.deleteRequest({
			id: uuid
		}).done(function(result){
			if (result.status == "OK"){
				self.deleteFeature(event);
				self._map.deleteFeatureFromLayer("uuid", uuid, self._vectorLayer);
			}
			// TODO handle results - notification
		});
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
	 * @param params {{uuid: {String}}}
	 * @returns {JQuery}
	 */
	DrawCustomLines.prototype.deleteRequest = function(params){
		return $.post(Config.url + "customfeatures/deleteline", params)
	};

	return DrawCustomLines;
});