define([
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',
	'../../table/TableCustomAU',

	'jquery',
	'string',
	'underscore',
	'text!./DrawCustomAU.html'
], function(ArgumentError,
			NotFoundError,
			Logger,
			TableCustomAU,

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

		this._records = [];
	};

	/**
	 * Event listeners
	 */
	DrawCustomAU.prototype.addEventListeners = function(){
		var self = this;

		// activate/deactivate drawing on btn click
		this._buttonDrawPolygons.on("click", this.drawingActivation.bind(this));
		// clear all on btn click
		this._buttonClearPolygons.on("click", this.clearAll.bind(this));
		// save and clear all on btn click
		this._buttonSavePolygons.on("click", this.saveAll.bind(this));

		// delete particular polygon
		var table = this._table.getTable();
		table.on("click",".button-delete-record", self.deletePolygon.bind(self));
		// save record name
		table.on("click",".button-save-record", self.savePolygon.bind(self));
	};

	/**
	 * Add draw end listener. It adds record to the table when drawing of polzgon has been finished.
	 * @param event {Object}
	 */
	DrawCustomAU.prototype.addDrawEndListener = function(event){
		this._table.addRecord(event.feature.id);
		this.checkTableRecords();
	};

	/**
	 * Activate/deactivate drawing
	 * @param event
	 */
	DrawCustomAU.prototype.drawingActivation = function(event){
		var button = $(event.target);
		if (button.hasClass("active")){
			button.removeClass("active");
			this._drawControl.deactivate();
			if (this._polygonVectorLayer.features.length > 0){
				this.checkTableRecords();
				this.activateClearButton();
			}
		} else {
			button.addClass("active");
			this._drawControl.activate();
			this.deactivateClearSaveButtons();
		}
	};

	/**
	 * Check if all records are saved
	 */
	DrawCustomAU.prototype.checkTableRecords = function(){
		var table = this._table.getTable();
		var recs = table.find("tr");
		var allSaved = true;

		$.each(recs, function( index, row ) {
			if (!$(row).hasClass("saved")){
				allSaved = false;
			}
		});

		if (allSaved){
			this.activateSaveButton();
		} else {
			this.deactivateClearSaveButtons();
		}
	};

	/**
	 * Add polygon to the list of records
	 * @param event
	 */
	DrawCustomAU.prototype.savePolygon = function(event){
		var button = $(event.target);
		var id = button.parents('tr').attr("data-id");
		var feature = this._map.getFeatureById(id, this._polygonVectorLayer);
		var geometry = this._map.getWKT(feature);
		var input = $(event.target).parents('tr').find('.record-name input');
		var name = input.val();
		if (name.length == 0){
			window.alert("Fill the name!");
			return;
		} else {
			input.attr("disabled", true);
		}

		var record = {
			olId: id,
			uuID: this.generateUuid(),
			name: name,
			geometry: geometry
		};

		this._records.push(record);
		feature.style = this._map.prepareStyle("#00ff00", name);

		this._polygonVectorLayer.redraw();

		button.attr("disabled", "disabled")
			.html("Saved!")
			.css("color", "#d35400")
			.parents('tr').addClass("saved");

		this.checkTableRecords();
	};

	/**
	 * Delete polygon from the list of records and map
	 * @param event
	 */
	DrawCustomAU.prototype.deletePolygon = function(event){
		var id = $(event.target).parents('tr').attr("data-id");
		this._table.deleteRecord(id);
		this._map.deletePolygonFromLayer(id, this._polygonVectorLayer);
		this._records = _.without(this._records, _.findWhere(this._records, {
			olId: id
		}));
		this.checkTableRecords();
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
			this.destroy();
		}
	};

	/**
	 * Destroy table, record list and clear the layer
	 */
	DrawCustomAU.prototype.destroy = function(){
		this._polygonVectorLayer.destroyFeatures();
		this._table.clear();
		this._records = [];
		this.deactivateClearSaveButtons();
	};

	DrawCustomAU.prototype.deactivateClearSaveButtons = function(){
		this._buttonClearPolygons.attr("disabled",true);
		this._buttonSavePolygons.attr("disabled",true);
	};

	DrawCustomAU.prototype.activateClearButton = function(){
		this._buttonClearPolygons.attr("disabled",false);
	};

	DrawCustomAU.prototype.activateSaveButton = function(){
		this._buttonSavePolygons.attr("disabled",false);
	};

	/**
	 * Generate uuid
	 * @returns {string}
	 */
	DrawCustomAU.prototype.generateUuid = function(){
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
	};

	return DrawCustomAU;
});