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
	 * Rebuild section with current map
	 * @param map
	 */
	DrawCustomLines.prototype.rebuild = function(map){
		this._layerInfo = this.getLayerConf();
		if (this._layerInfo.exists){
			this._target.css("display","block");
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
			this.checkPlace();
			this._records = [];

		} else {
			this._target.css("display","none");
		}
	};

	/**
	 * It returns current "Custom lines layer" configuration, if exists
	 */
	DrawCustomLines.prototype.getLayerConf = function(){
		var refMap = ThemeYearConfParams.layerRefMap;
		var dataset = Number(ThemeYearConfParams.dataset);
		var currentYear = JSON.parse(ThemeYearConfParams.years)[0];
		var currentPlace = null;
		if (ThemeYearConfParams.place.length > 0){
			currentPlace = JSON.parse(ThemeYearConfParams.place);
		}

		var status = {
			exists: false,
			metadata: {
				dataset: dataset,
				currentLocation: currentPlace,
				currentPeriod: currentYear,
				allLocations: [],
				allPeriod: [],
				areaTemplate: null
			}
		};

		for (var at in refMap){
			for (var place in refMap[at]){
				for (var year in refMap[at][place]){
					var layers = refMap[at][place][year];
					layers.forEach(function(layer){
						if (layer.hasOwnProperty("layer")){
							var name = layer.layer;
							var parts = name.split(":");
							if (parts[1] == "custom_line"){
								status.exists = true;
								status.metadata.areaTemplate = Number(at);
							}
						}
					});
				}
			}
		}
		return status;
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
			data: this.saveFeature(event),
			metadata: this._layerInfo.metadata
		};

		if (feature.data){
			this.saveRequest(feature).done(function(result){
				console.log(result);
				// TODO handle results
			});
		}
	};


	/**
	 * Delete line
	 * @param event
	 */
	DrawCustomLines.prototype.deleteLineFeature = function(event){
		this.deleteFeature(event);
		// TODO Add deleting confirmation
		// TODO Remove feature from layer on server
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
		return $.post(Config.url + "customfeatures/line", params)
	};

	DrawCustomLines.prototype.checkTableRecords = function(){
		var table = this._table.getTable();
		var recs = table.find("tr.record-row");

		// clear the table if there is no record in it
		if (recs.length == 0){
			this._table.clear();
		}
	};

	return DrawCustomLines;
});