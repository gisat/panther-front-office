define([
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',
	'../../table/TableCustomAU',

	'jquery',
	'string',
	'text!./DrawCustomAU.html'
], function(ArgumentError,
			NotFoundError,
			Logger,
			TableCustomAU,

			$,
			S,
			DrawCustomAUHtml){

	/**
	 * Class representing Draw Custom AU section
	 * @param options {Object}
	 * @constructor
	 */
	var DrawCustomAU = function(options) {
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
		this.build();
	};

	/**
	 * Build basic structure of section
	 */
	DrawCustomAU.prototype.build = function(){
		var html = S(DrawCustomAUHtml).template({
			id: this._sectionId
		}).toString();
		this._target.append(html);

		this._table = new TableCustomAU({
			targetId: this._sectionId + "-table-container",
			elementId: this._sectionId + "-table"
		});

		this._buttonDrawPolygons = $("#button-draw-polygons");
		this._buttonClearPolygons = $("#button-clear-polygons");
		this._buttonSavePolygons = $("#button-save-polygons");
	};

	/**
	 * Rebuild section with current map
	 * @param map 
	 */
	DrawCustomAU.prototype.rebuild = function(map){
		if (!this._map){
			this._map = map;
			this._map.rebuild();
			this._polygonVectorLayer = this._map.addLayerForDrawing("drawPolygons","#00ff00");
			this._drawControl = this._map.addControlsForDrawing(this._polygonVectorLayer, this.addDrawEndListener.bind(this));
			this.addEventListeners();
		}
		if (this._polygonVectorLayer){
			this._polygonVectorLayer.destroyFeatures();
		}
	};

	/**
	 * Event listeners
	 */
	DrawCustomAU.prototype.addEventListeners = function(){
		var self = this;

		// activate/deactivate drawing on btn click
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

		// clear all on btn click
		this._buttonClearPolygons.on("click", function(){
			self._polygonVectorLayer.destroyFeatures();
			self._table.clear();
			self.deactivateClearSaveButtons();
		});

		// save and clear all on btn click
		this._buttonSavePolygons.on("click", function(){
			self.savePolygons();
			self._polygonVectorLayer.destroyFeatures();
			self._table.clear();
			self.deactivateClearSaveButtons();
		});

		// delete particular polygon
		var table = this._table.getTable();
		table.on("click",".delete-record",function(){
			var id = $(this).parents('tr').attr("data-id");
			self._table.deleteRecord(id);
			self._map.deletePolygonFromLayer(id, self._polygonVectorLayer);
		});
	};

	/**
	 * Add draw end listener. It adds record to the table when drawing of polzgon has been finished.
	 * @param event {Object}
	 */
	DrawCustomAU.prototype.addDrawEndListener = function(event){
		this._table.addRecord(event.feature.id);
	};

	DrawCustomAU.prototype.savePolygons = function(){
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

	DrawCustomAU.prototype.deactivateClearSaveButtons = function(){
		this._buttonClearPolygons.attr("disabled",true);
		this._buttonSavePolygons.attr("disabled",true);
	};

	DrawCustomAU.prototype.activateClearSaveButtons = function(){
		this._buttonClearPolygons.attr("disabled",false);
		this._buttonSavePolygons.attr("disabled",false);
	};

	return DrawCustomAU;
});