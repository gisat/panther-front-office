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
	 * Get saved features from database
	 */
	CustomDrawingSection.prototype.getSavedFeatures = function(params){
		var self = this;
		this.selectRequest(params).done(function(result){
			if (result.status == "OK"){
				self._records = result.data;
				self._table.rebuild(self._records);
				self._map.addFeaturesToVectorLayer(self._vectorLayer, self._records);
			}
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
			this.deactivateDrawing(button);
		} else {
			this.activateDrawing(button);
		}
	};

	/**
	 * Deactivate drawing
	 * @param button {JQuery}
	 */
	CustomDrawingSection.prototype.deactivateDrawing = function(button){
		var id = this._buttonDraw.attr("id");
		$(".button-drawing-activation:not(#" + id + ")").attr("disabled", false);

		button.removeClass("active");
		this._drawControl.deactivate();
		if (this._vectorLayer.features.length > 0){
			this._table.checkRecords();
		}
	};

	/**
	 * Activate drawing
	 * @param button {JQuery}
	 */
	CustomDrawingSection.prototype.activateDrawing = function(button){
		var id = this._buttonDraw.attr("id");
		$(".button-drawing-activation:not(#" + id + ")").attr("disabled", true);

		button.addClass("active");
		this._drawControl.activate();
	};

	/**
	 * Save feature
	 * @param event
	 */
	CustomDrawingSection.prototype.saveFeature = function(event){
		var button = $(event.target);
		var feature = {data: this.addFeatureToList(button)};

		if (feature.data){
			this.saveRequest(feature).done(function(result){
				if (result.status == "OK"){
					button.attr("disabled", "disabled")
						.html("Saved!")
						.css("color", "#d35400")
						.parents('tr').addClass("saved");
				} else {
					alert(result.status + ": " + result.message);
				}
			});
		}
	};

	/**
	 * Add feature to the list of records
	 * @param button {JQuery}
	 */
	CustomDrawingSection.prototype.addFeatureToList = function(button){
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
			olid: olid,
			uuid: uuid,
			name: name,
			geometry: geometry,
			scope: ThemeYearConfParams.dataset
		};

		this._records.push(record);

		feature.style = this._map.prepareStyle("#33ff33",name);
		this._vectorLayer.redraw();

		this._table.checkRecords();
		return record;
	};

	/**
	 * Delete feature
	 * @param event
	 */
	CustomDrawingSection.prototype.deleteFeature = function(event){
		var button = $(event.target);
		var olid = button.parents('tr').attr("data-olid");
		var uuid = button.parents('tr').attr("data-uuid");
		var name = button.parents('tr').find(".record-name input").val();

		var conf = confirm("Do you really want to delete line " + name);
		if (!conf){
			return;
		}

		var self = this;
		this.deleteRequest({id: uuid}).done(function(result){
			if (result.status == "OK"){
				self._table.deleteRecord(uuid);
				self._records = _.without(self._records, _.findWhere(self._records, {
					uuid: uuid
				}));
				if (olid){
					self._map.deleteFeatureFromLayerById(olid, self._vectorLayer);
				} else {
					self._map.deleteFeatureFromLayer("uuid", uuid, self._vectorLayer);
				}
				self._table.checkRecords();
			} else {
				alert(result.status + ": " + result.message);
			}
		});
	};

	/**
	 * Add event listeners to elements
	 */
	CustomDrawingSection.prototype.addEventListeners = function(){
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
	 * Add listener for showing/hidding of layer
	 */
	CustomDrawingSection.prototype.addLayerCheckboxListener = function(){
		var self = this;
		this._layerCheckbox.getCheckbox().on("click", function(){
			var checkbox = $(this);
			setTimeout(function(){
				if (checkbox.hasClass("checked")){
					self._vectorLayer.display(true);
				} else {
					self._vectorLayer.display(false);
				}
			}, 50);
		})
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