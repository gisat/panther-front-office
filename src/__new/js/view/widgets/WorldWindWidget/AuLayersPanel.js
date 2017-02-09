define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../../../util/AnalyticalUnits',
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
		this.addLayers();
		this.addEventsListeners();
	};

	/**
	 * Add radios and add selected layer
	 */
	AuLayersPanel.prototype.addLayers = function(){
		this.addCheckbox(this._id + "-au-layers", "Analytical Units outlines", this._panelBodySelector, "analyticalUnits", true);
		this.toggleLayers();
	};

	/**
	 * Rebuild panel with current configuration
	 * @param configuration {Object} configuration from global object ThemeYearConfParams
	 */
	AuLayersPanel.prototype.rebuild = function(configuration){
		if (!configuration){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "AuLayersPanel", "constructor", "missingParameter"));
		}
		this._au.getUnits(configuration).then(function(result){
			debugger;
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
		//var self = this;
		//var radios = this._panelBodySelector.find(".radiobox-row");
		//setTimeout(function(){
		//	radios.each(function(index, item){
		//		var radio = $(item);
		//		var dataId = radio.attr("data-id");
		//		var layer = self._worldWind.layers.getLayerById(dataId);
		//		if (radio.hasClass("checked")){
		//			self._worldWind.addLayer(layer);
		//		} else {
		//			self._worldWind.removeLayer(layer);
		//		}
		//	});
		//},50);
	};

	return AuLayersPanel;
});