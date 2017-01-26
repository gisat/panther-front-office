define([
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',
	'../../../util/Uuid',

	'../../table/TableCustomDrawing',

	'jquery',
	'string',
	'underscore'
], function(ArgumentError,
			NotFoundError,
			Logger,
			Uuid,

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
	 * Add draw end listener. It adds record to the table when drawing of feature has been finished.
	 * @param event {OpenLayers.Event}
	 */
	CustomDrawingSection.prototype.addDrawEndListener = function(event){
		var recordUuid = new Uuid().generate();
		var recordOoid = event.feature.id;

		this._table.addRecord(recordOoid, recordUuid);
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
			this._table.checkRecords();
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
	};

	/**
	 * Add feature to the list of records
	 * @param event {OpenLayers.Event}
	 */
	CustomDrawingSection.prototype.addFeatureToList = function(event){
		var button = $(event.target);
		button.attr("disabled", "disabled")
			.html("Saved!")
			.css("color", "#d35400")
			.parents('tr').addClass("saved");

		var olid = button.parents('tr').attr("data-olid");
		var uuid = button.parents('tr').attr("data-uuid");
		var input = button.parents('tr').find('.record-name input');

		var feature = this._map.getFeatureById(olid, this._vectorLayer);
		var geometry = this._map.getWKT(feature);
		var name = input.val();

		if (name.length == 0){
			window.alert("Fill the name!");
			return;
		} else {
			input.attr("disabled", true);
		}

		var record = {
			olId: olid,
			uuid: uuid,
			name: name,
			geometry: geometry,
			scope: ThemeYearConfParams.dataset
		};

		this._records.push(record);

		feature.style = this.setDrawingStyle(name);
		this._vectorLayer.redraw();

		this._table.checkRecords();
		return record;
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
		var uuid = $(event.target).parents('tr').attr("data-uuid");
		var olid = $(event.target).parents('tr').attr("data-olid");

		this._table.deleteRecord(uuid);
		this._records = _.without(this._records, _.findWhere(this._records, {
			uuid: uuid
		}));
		if (olid){
			this._map.deleteFeatureFromLayerById(olid, this._vectorLayer);
		}

		this._table.checkRecords();
	};

	/**
	 * Destroy table, record list and clear the layer
	 */
	CustomDrawingSection.prototype.destroy = function(){
		this._vectorLayer.destroyFeatures();
		this._records = [];
		this._table.clear();
	};

	return CustomDrawingSection;
});