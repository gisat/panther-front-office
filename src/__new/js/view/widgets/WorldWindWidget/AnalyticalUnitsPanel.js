define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'./WorldWindWidgetPanel',

	'jquery',
	'string'
], function(ArgumentError,
			NotFoundError,
			Logger,

			WorldWindWidgetPanel,

			$,
			S
){
	/**
	 * Class representing Analytical Units Panel of WorldWindWidget
	 * @param options {Object}
	 * @constructor
	 */
	var AnalyticalUnitsPanel = function(options){
		WorldWindWidgetPanel.apply(this, arguments);
	};

	AnalyticalUnitsPanel.prototype = Object.create(WorldWindWidgetPanel.prototype);

	/**
	 * Add content to panel
	 */
	AnalyticalUnitsPanel.prototype.addContent = function(){
		this.addLayers();
		this.addEventsListeners();
	};

	/**
	 * Add radios and add selected layer
	 */
	AnalyticalUnitsPanel.prototype.addLayers = function(){
		this.addCheckbox(this._id + "-analytical-units", "Analytical units outlines", this._panelBodySelector, "analyticalUnits", true);
	};

	/**
	 * Add listeners
	 */
	AnalyticalUnitsPanel.prototype.addEventsListeners = function(){
		this.addCheckboxOnClickListener();
	};

	/**
	 * Add onclick listener to every checkbox
	 */
	AnalyticalUnitsPanel.prototype.addCheckboxOnClickListener = function(){
		this._panelBodySelector.find(".checkbox-row").on("click", this.toggleLayers.bind(this));
	};

	/**
	 * Hide all background layers and show only selected one
	 */
	AnalyticalUnitsPanel.prototype.toggleLayers = function(){
		// var self = this;
		// var radios = this._panelBodySelector.find(".radiobox-row");
		// setTimeout(function(){
		// 	radios.each(function(index, item){
		// 		var radio = $(item);
		// 		var dataId = radio.attr("data-id");
		// 		var layer = self._worldWind.layers.getLayerById(dataId);
		// 		if (radio.hasClass("checked")){
		// 			self._worldWind.addLayer(layer);
		// 		} else {
		// 			self._worldWind.removeLayer(layer);
		// 		}
		// 	});
		// },50);
	};

	return AnalyticalUnitsPanel;
});