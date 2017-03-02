define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../../../util/Filter',
	'../../../util/MapExport',
	'../../../util/viewUtils',

	'./FeatureInfoSettings',

	'jquery',
	'string',
	'text!./FeatureInfoWindow.html',
	'css!./FeatureInfoWindow'
], function (ArgumentError,
			 NotFoundError,
			 Logger,

			 Filter,
			 MapExport,
			 viewUtils,

			 FeatureInfoSettings,

			 $,
			 S,
			 htmlContent) {
	"use strict";

	/**
	 * It creates the window for deature info functionality
	 * @param options {Object}
	 * @param options.id {string} id of the element
	 * @param options.target {Object} JQuery object
	 * @constructor
	 */
	var FeatureInfoWindow = function (options) {
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "FeatureInfoWindow", "constructor", "missingElementId"));
		}
		if (!options.target){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "FeatureInfoWindow", "constructor", "missingTargetElement"));
		}

		this._id = options.id;
		this._target = options.target;

		this.build();
	};

	/**
	 * Build basic structure of info window and attach listeners
	 */
	FeatureInfoWindow.prototype.build = function(){
		var html = S(htmlContent).template({
			id: this._id
		}).toString();
		this._target.append(html);
		this._infoWindow = $("#" + this._id);

		this._settings = this.buildSettings();
		this._settingsConfirm = this._settings.getConfirmButton();

		this.addSettingsOpenListener();
		this.addSettingsChangeListener();
		this.addCloseListener();
		this.makeDraggable();
	};

	/**
	 * Rebuild Feature Info Window and settings window according to current configuration
	 * @param attributes {Array} List of all available attributes
	 * @param gid {string}
	 */
	FeatureInfoWindow.prototype.rebuild = function(attributes, gid){
		this._settings.rebuild(attributes);
		this._selectedAttributes = this._settings.getSelectedAttributes();
		this._gid = gid;
		this.rebuildWindow(this._selectedAttributes);
	};

	/**
	 * Rebuild the content of a window
	 * @param attributes {Array} list of selected attributes
	 */
	FeatureInfoWindow.prototype.rebuildWindow = function(attributes){
		this.handleLoading("show");
		new Filter().featureInfo(attributes, this._gid).then(this.redraw.bind(this));
	};

	/**
	 * Redraw the window with attributes and their values for given area.
	 * @param data {Object}
	 */
	FeatureInfoWindow.prototype.redraw = function(data){
		var content = "";
		var attributes = data[0].attributes;
		attributes.forEach(function(item){
			var value = item.value;
			var units = "";

			if (typeof value == "number"){
				value = viewUtils.numberFormat(value, true, 2);
			}
			if (item.units){
				units = " (" + item.units + ")";
			}

			content += '<tr><td><i>' + item.asName + '</i>: ' + item.name + units + '</td><td>' + value + '</td></tr>';
		});
		this._infoWindow.find(".feature-info-title")
			.html(data[0].name + " (" + data[0].gid + ")")
			.attr("title", data[0].name + " (" + data[0].gid + ")");
		this._infoWindow.find(".feature-info-window-body table").html(content);
		this.addExportListener(this._selectedAttributes, this._gid);
		this.handleLoading("hide");
	};

	/**
	 * Build settings window
	 * @returns {FeatureInfoSettings}
	 */
	FeatureInfoWindow.prototype.buildSettings = function(){
		return new FeatureInfoSettings({
			target: this._target,
			widgetId: this._id
		});
	};

	/**
	 * Make window draggable
	 */
	FeatureInfoWindow.prototype.makeDraggable = function(){
		this._infoWindow.draggable({
			containment: "body",
			handle: ".feature-info-window-header"
		});
	};

	/**
	 * Add listener for downloading feature data
	 * @param attributes {Array} List of attributes
	 * @param gid {string} Id of area
	 */
	FeatureInfoWindow.prototype.addExportListener = function(attributes, gid){
		var locations;
		if (ThemeYearConfParams.place.length > 0){
			locations = [Number(ThemeYearConfParams.place)];
		} else {
			locations = ThemeYearConfParams.allPlaces;
		}

		this._mapExport = new MapExport({
			attributes: JSON.stringify(attributes),
			places: JSON.stringify(locations),
			periods: ThemeYearConfParams.years,
			areaTemplate: ThemeYearConfParams.auCurrentAt,
			gids: JSON.stringify([gid])
		});

		var self = this;
		$("#export-feature-info-csv").off("click.featureInfo.csv").on("click.featureInfo.csv", function(){
			self._mapExport.export("xls");
		});
	};

	/**
	 * Add onclick listener to close button
	 */
	FeatureInfoWindow.prototype.addCloseListener = function(){
		var self = this;
		this._infoWindow.find(".feature-info-close").on("click", function(){
			self.setVisibility("hide");
		});
	};

	/**
	 * It adds onclick listener to settings tool for opening of the settings dialog window
	 */
	FeatureInfoWindow.prototype.addSettingsOpenListener = function() {
		var self = this;
		$(".feature-info-settings").on("click", function(){
			$('#' + self._id + '-settings').show("drop", {direction: "up"}, 200)
				.addClass('open');
		});
	};

	/**
	 * It adds the onclick listener to the settings dialog window for rebuilding of the feature info view
	 */
	FeatureInfoWindow.prototype.addSettingsChangeListener = function(){
		var self = this;
		this._settingsConfirm.on("click",function(){
			self._selectedAttributes = self._settings.getSelectedAttributes();
			self.rebuildWindow(self._selectedAttributes);
		})
	};

	/**
	 * Showing/hiding info window
	 * @param option {string} show or hide
	 */
	FeatureInfoWindow.prototype.setVisibility = function(option){
		if (option == "show"){
			this._infoWindow.show(200);
		} else if (option == "hide"){
			this._infoWindow.hide(200);
		}
	};

	/**
	 * Set the position of info window on the screen
	 * @param coordinates {Object}
	 * @param coordinates.x {number}
	 * @param coordinates.y {number}
	 */
	FeatureInfoWindow.prototype.setScreenPosition = function(coordinates){
		var mapOffsetTop = $('#app-map').offset().top;
		this._infoWindow.offset({
			top: coordinates.y + mapOffsetTop + 5,
			left: coordinates.x + 5
		});
	};

	/**
	 * Show/hide loading overlay
	 * @param state {string}
	 */
	FeatureInfoWindow.prototype.handleLoading = function(state){
		var display;
		switch (state) {
			case "show":
				display = "block";
				break;
			case "hide":
				display = "none";
				break;
		}
		this._infoWindow.find(".overlay").css("display", display);
	};

	return FeatureInfoWindow;
});