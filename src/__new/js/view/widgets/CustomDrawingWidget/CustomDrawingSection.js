define([
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../../table/TableCustomDrawing',

	'jquery',
	'string',
	'underscore'
], function(ArgumentError,
			NotFoundError,
			Logger,

			TableCustomDrawing,

			$,
			S,
			_){

	/**
	 * Class representing Custom Drawing Widget Section
	 * @param options {Object}
	 * @constructor
	 */
	var CustomDrawingSection = function(options) {
	};


	CustomDrawingSection.prototype.checkActivated = function(){
		console.log("checked");
	};

	/**
	 * Build basic structure of section
	 */
	CustomDrawingSection.prototype.build = function(content){
		var html = S(content).template({
			id: this._sectionId
		}).toString();
		this._target.append(html);

		this._table = new TableCustomDrawing({
			targetId: this._sectionId + "-table-container",
			elementId: this._sectionId + "-table"
		});
	};

	/**
	 * Event listeners
	 */
	CustomDrawingSection.prototype.addEventListeners = function(){
		var self = this;
		// activate/deactivate drawing on btn click
		this._buttonDraw.on("click", this.drawingActivation.bind(this));
		// clear all on btn click
		this._buttonClear.on("click", this.clearAll.bind(this));
		// save and clear all on btn click
		this._buttonSave.on("click", this.saveAll.bind(this));

		// delete particular polygon
		var table = this._table.getTable();
		table.on("click",".button-delete-record", self.deleteFeature.bind(self));
		// save record name
		table.on("click",".button-save-record", self.saveFeature.bind(self));
	};

	/**
	 * Add draw end listener. It adds record to the table when drawing of feature has been finished.
	 * @param event {OpenLayers.Event}
	 */
	CustomDrawingSection.prototype.addDrawEndListener = function(event){
		this._table.addRecord(event.feature.id);
		this.checkTableRecords();
	};

	/**
	 * Check if place (pilot in URBIS) is selected
	 */
	CustomDrawingSection.prototype.checkPlace = function(){
		if (ThemeYearConfParams.place.length == 0){
			this._section.css("display", "none");
			this._info.css("display","block");
		} else {
			this._section.css("display", "block");
			this._info.css("display","none");
		}
	};

	/**
	 * Activate/deactivate drawing
	 * @param event
	 */
	CustomDrawingSection.prototype.drawingActivation = function(event){
		var button = $(event.target);
		if (button.hasClass("active")){
			this.deactivateDrawing(event);
		} else {
			this.activateDrawing(event);
		}
	};

	/**
	 * Deactivate drawing
	 * @param event {Object}
	 */
	CustomDrawingSection.prototype.deactivateDrawing = function(event){
		var id = this._buttonDraw.attr("id");
		$(".button-drawing-activation:not(#" + id + ")").attr("disabled", false);

		var button = $(event.target);
		button.removeClass("active");
		this._drawControl.deactivate();
		if (this._vectorLayer.features.length > 0){
			this.checkTableRecords();
			this.activateClearButton();
		}
	};

	/**
	 * Activate drawing
	 * @param event {Object}
	 */
	CustomDrawingSection.prototype.activateDrawing = function(event){
		var id = this._buttonDraw.attr("id");
		$(".button-drawing-activation:not(#" + id + ")").attr("disabled", true);

		var button = $(event.target);
		button.addClass("active");
		this._drawControl.activate();
		this.deactivateClearSaveButtons();
	};

	/**
	 * Add feature to the list of records
	 * @param event {OpenLayers.Event}
	 */
	CustomDrawingSection.prototype.saveFeature = function(event){
		var button = $(event.target);
		var id = button.parents('tr').attr("data-id");
		var feature = this._map.getFeatureById(id, this._vectorLayer);
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

		feature.style = this.setDrawingStyle(name);
		this._vectorLayer.redraw();

		button.attr("disabled", "disabled")
			.html("Saved!")
			.css("color", "#d35400")
			.parents('tr').addClass("saved");

		this.checkTableRecords();
	};

	/**
	 * Set style of drawing
	 * @param name {string}
	 */
	CustomDrawingSection.prototype.setDrawingStyle = function(name){
		return this._map.prepareStyle("#00ff00", name);
	};

	/**
	 * Delete polygon from the list of records, table and map
	 * @param event {OpenLayers.Event}
	 */
	CustomDrawingSection.prototype.deleteFeature = function(event){
		var id = $(event.target).parents('tr').attr("data-id");
		this._table.deleteRecord(id);
		this._map.deleteFeatureFromLayer(id, this._vectorLayer);
		this._records = _.without(this._records, _.findWhere(this._records, {
			olId: id
		}));
		this.checkTableRecords();
	};

	/**
	 * Check if all records are saved
	 */
	CustomDrawingSection.prototype.checkTableRecords = function(){
		var table = this._table.getTable();
		var recs = table.find("tr.record-row");
		var allSaved = true;

		$.each(recs, function( index, row ) {
			if (!$(row).hasClass("saved")){
				allSaved = false;
			}
		});

		// clear the table if there is no record in it
		if (recs.length == 0){
			allSaved = false;
			this._table.clear();
		}

		// hadnle state of buttons
		if (allSaved){
			this.activateSaveButton();
		} else {
			this.deactivateClearSaveButtons();
		}
	};

	/**
	 * Destroy table, record list and clear the layer
	 */
	CustomDrawingSection.prototype.destroy = function(){
		this._vectorLayer.destroyFeatures();
		this._records = [];
		this._table.clear();
		this.deactivateClearSaveButtons();
	};

	/**
	 * Deactivate buttons for clearing and saving
	 */
	CustomDrawingSection.prototype.deactivateClearSaveButtons = function(){
		this._buttonClear.attr("disabled",true);
		this._buttonSave.attr("disabled",true);
	};

	CustomDrawingSection.prototype.activateClearButton = function(){
		this._buttonClear.attr("disabled",false);
	};

	CustomDrawingSection.prototype.activateSaveButton = function(){
		this._buttonSave.attr("disabled",false);
	};

	/**
	 * Generate uuid
	 * @returns {string}
	 */
	CustomDrawingSection.prototype.generateUuid = function(){
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
	};

	return CustomDrawingSection;
});