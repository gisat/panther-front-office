define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../../../util/metadata/AnalyticalUnits',
	'./WorldWindWidgetPanel',

	'jquery',
	'string'
], function(ArgumentError,
			NotFoundError,
			Logger,

			AnalyticalUnits,
			WorldWindWidgetPanel,

			$,
			S
){
	/**
	 * Class representing AU Layers Panel of WorldWindWidget
	 * @param options {Object}
	 * @constructor
	 */
	var AuLayersPanel = function(options){
		WorldWindWidgetPanel.apply(this, arguments);
		this._au = new AnalyticalUnits();
	};

	AuLayersPanel.prototype = Object.create(WorldWindWidgetPanel.prototype);

	/**
	 * Add content to panel
	 */
	AuLayersPanel.prototype.addContent = function(){
		this.addLayer(this._id + "-outlines", "Analytical Units outlines", this._panelBodySelector, "analyticalUnits", true);

		this.toggleLayers();
		this.addEventsListeners();
	};

	/**
	 * Add layers to the panel and map
	 * @param elementId {string} Id of the HTML element
	 * @param name {string} Name of the layer
	 * @param container {JQuery} JQuery selector of the target element
	 * @param layerId {string} Id of the layer
	 * @param visible {boolean} true if the layer should be shown
	 */
	AuLayersPanel.prototype.addLayer = function(elementId, name, container, layerId, visible){
		this.addCheckbox(elementId, name, container, layerId, visible);
		var layer = this._worldWind._layers.getLayerById(layerId);
		if (layerId == "analyticalUnits"){
			this._auLayer = layer;
		}
		this._worldWind.addLayer(layer);
	};

	/**
	 * Rebuild panel with current configuration
	 * @param configuration {Object} configuration from global object ThemeYearConfParams
	 */
	AuLayersPanel.prototype.rebuild = function(configuration){
		if (!configuration){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "AuLayersPanel", "rebuild", "missingParameter"));
		}
		this.rebuildUnits(configuration);
	};

	/**
	 * Get units from server and rebuild layer
	 * @param configuration
	 */
	AuLayersPanel.prototype.rebuildUnits = function(configuration){
		var self = this;
		this._au.getUnits(configuration).then(function(result){
			if (result.length > 0){
				self._auLayer.redraw(result);
				self._worldWind.redraw();
				console.log(self._worldWind);
			} else {
				console.warn(Logger.logMessage(Logger.LEVEL_WARNING, "AuLayersPanel", "constructor", "missingParameter"))
			}
		});
	};

	/**
	 * Add listeners
	 */
	AuLayersPanel.prototype.addEventsListeners = function(){
		this.addCheckboxOnClickListener();
	};

	/**
	 * Add onclick listener to every radio
	 */
	AuLayersPanel.prototype.addCheckboxOnClickListener = function(){
		this._panelBodySelector.find(".checkbox-row").on("click", this.toggleLayers.bind(this));
	};

	/**
	 * Hide all background layers and show only selected one
	 */
	AuLayersPanel.prototype.toggleLayers = function(){
		var self = this;
		var checkboxes = this._panelBodySelector.find(".checkbox-row");
		setTimeout(function(){
			checkboxes.each(function(index, item){
				var checkbox = $(item);
				var dataId = checkbox.attr("data-id");
				var layer = self._worldWind._layers.getLayerById(dataId);
				if (checkbox.hasClass("checked")){
					self._worldWind.showLayer(layer);
				} else {
					self._worldWind.hideLayer(layer);
				}
			});
		},50);
	};

	return AuLayersPanel;
});