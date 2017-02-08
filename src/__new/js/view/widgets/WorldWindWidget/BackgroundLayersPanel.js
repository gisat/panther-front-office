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
	 * Class representing Background Layers Panel of WorldWindWidget
	 * @param options {Object}
	 * @constructor
	 */
	var BackgroundLayersPanel = function(options){
		WorldWindWidgetPanel.apply(this, arguments);
	};

	BackgroundLayersPanel.prototype = Object.create(WorldWindWidgetPanel.prototype);

	/**
	 * Add content to panel
	 */
	BackgroundLayersPanel.prototype.addContent = function(){
		this.addLayers();
		this.addEventsListeners();
	};

	/**
	 * Add radios and add selected layer
	 */
	BackgroundLayersPanel.prototype.addLayers = function(){
		this.addRadio(this._id + "-bing-roads", "Bing roads", this._panelBodySelector, "bingRoads", true);
		this.addRadio(this._id + "-bing-aerial", "Bing Aerial", this._panelBodySelector, "bingAerial", false);
		this.addRadio(this._id + "-landsat", "Landsat", this._panelBodySelector, "landsat", false);
		this.toggleLayers();
	};

	/**
	 * Add listeners
	 */
	BackgroundLayersPanel.prototype.addEventsListeners = function(){
		this.addRadioOnClickListener();
	};

	/**
	 * Add onclick listener to every radio
	 */
	BackgroundLayersPanel.prototype.addRadioOnClickListener = function(){
		this._panelBodySelector.find(".radiobox-row").on("click", this.toggleLayers.bind(this));
	};

	/**
	 * Hide all background layers and show only selected one
	 */
	BackgroundLayersPanel.prototype.toggleLayers = function(){
		var self = this;
		var radios = this._panelBodySelector.find(".radiobox-row");
		setTimeout(function(){
			radios.each(function(index, item){
				var radio = $(item);
				var dataId = radio.attr("data-id");
				var layer = self._worldWind.layers.getLayerById(dataId);
				if (radio.hasClass("checked")){
					self._worldWind.addLayer(layer);
				} else {
					self._worldWind.removeLayer(layer);
				}
			});
		},50);
	};

	return BackgroundLayersPanel;
});