define(['../../../../error/ArgumentError',
	'../../../../error/NotFoundError',
	'../../../../util/Logger',

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

		this.layerControls = [];

		this.addLayerControls();
		this.addEventsListeners();
	};

	BackgroundLayersPanel.prototype = Object.create(WorldWindWidgetPanel.prototype);

	/**
	 * Add control for background layers
	 */
	BackgroundLayersPanel.prototype.addLayerControls = function(){
		this.layerControls.push({
			id: "osm",
			control: this.addRadio(this._id + "-osm", "OpenStreetMap", this._panelBodySelector, "osm", true)
		});
		this.layerControls.push({
			id: "cartoDb",
			control: this.addRadio(this._id + "-carto-db", "Carto DB basemap", this._panelBodySelector, "cartoDb", false)
		});
		this.layerControls.push({
			id: "bingAerial",
			control: this.addRadio(this._id + "-bing-aerial", "Bing Aerial", this._panelBodySelector, "bingAerial", false)
		});
		this.layerControls.push({
			id: "landsat",
			control: this.addRadio(this._id + "-landsat", "Blue Marble", this._panelBodySelector, "landsat", false)
		})
	};

	/**
	 * Add background layers to a map
	 * @param map {WorldWindMap}
	 */
	BackgroundLayersPanel.prototype.addLayersToMap = function(map){
		this.layerControls.forEach(function(control){
			map.layers.addBackgroundLayer(control.id, this._id);
		});
		this.toggleLayers();
	};

	/**
	 * Add listeners to controls
	 */
	BackgroundLayersPanel.prototype.addEventsListeners = function(){
		this.addRadioOnClickListener();
	};

	/**
	 * Hide all background layers and show only the selected one
	 */
	BackgroundLayersPanel.prototype.toggleLayers = function(){
		var self = this;
		setTimeout(function(){
			self.layerControls.forEach(function(item, index){
				var radio = item.control.getRadiobox();
				var dataId = radio.attr("data-id");
				if (radio.hasClass("checked")){
					for(var key in self._maps){
						self._maps[key].layers.showBackgroundLayer(dataId);
					}
				} else {
					for(var key in self._maps){
						self._maps[key].layers.hideBackgroundLayer(dataId);
					}
				}
			});
		},50);
	};

	return BackgroundLayersPanel;
});