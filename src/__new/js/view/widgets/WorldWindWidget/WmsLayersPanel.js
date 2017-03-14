define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../../../stores/Stores',
	'./WorldWindWidgetPanel',

	'jquery',
	'string'
], function(ArgumentError,
			NotFoundError,
			Logger,

			Stores,
			WorldWindWidgetPanel,

			$,
			S
){
	/**
	 * Class representing Wms Layers Panel of WorldWindWidget
	 * @param options {Object}
	 * @constructor
	 */
	var WmsLayersPanel = function(options){
		WorldWindWidgetPanel.apply(this, arguments);
	};

	WmsLayersPanel.prototype = Object.create(WorldWindWidgetPanel.prototype);

	/**
	 * Add content to panel
	 */
	WmsLayersPanel.prototype.addContent = function(){
		this.addEventsListeners();
	};

	/**
	 * Rebuild panel with current configuration
	 * @param configuration {Object} configuration from global object ThemeYearConfParams
	 */
	WmsLayersPanel.prototype.rebuild = function(configuration){
		if (!configuration){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WmsLayersPanel", "rebuild", "missingParameter"));
		}
		this.removeAllLayers();
		var filter = {};
		filter.scope = Number(configuration.dataset);
		if (configuration.place.length > 0){
			filter.locations = Number(configuration.place);
		}
		var self = this;
		Stores.retrieve('wmsLayer').filter(filter).then(function(layers){
			if (layers.length > 0){
				layers.forEach(function(layer){
					self.addLayer(layer);
				});
			}
			self.toggleLayers();
		}).catch(function(err){
			throw new Error(err);
		});
	};

	/**
	 * Add layer to the panel and map
	 * @param layer {Object}
	 */
	WmsLayersPanel.prototype.addLayer = function(layer){
		var id = "custom-wms-" + layer.id;
		var name = layer.name;
		var container = this._panelBodySelector;
		this.addCheckbox(id, name, container, id, false);
		this._worldWind.addWmsLayer(layer);
	};

	/**
	 * Remove all layers from this panel
	 */
	WmsLayersPanel.prototype.removeAllLayers = function(){
		var self = this;
		this._panelBodySelector.find(".checkbox-row").each(function(index, item){
			var checkbox = $(item);
			var id = checkbox.attr("data-id");
			var layer = self._worldWind.getLayerById(id);
			self._worldWind.removeLayer(layer);
		});
		this._panelBodySelector.html('');
	};

	/**
	 * Add listeners
	 */
	WmsLayersPanel.prototype.addEventsListeners = function(){
		this.addCheckboxOnClickListener();
	};

	/**
	 * Add onclick listener to every checkbox
	 */
	WmsLayersPanel.prototype.addCheckboxOnClickListener = function(){
		this._panelBodySelector.on("click", ".checkbox-row", this.toggleLayers.bind(this));
	};

	/**
	 * Hide/show layers
	 */
	WmsLayersPanel.prototype.toggleLayers = function(event){
		var self = this;
		setTimeout(function(){
			self._panelBodySelector.find(".checkbox-row").each(function(index, item){
				var checkbox = $(item);
				var id = checkbox.attr("data-id");
				var layer = self._worldWind.getLayerById(id);
				if (checkbox.hasClass("checked")){
					self._worldWind.showLayer(layer);
				} else {
					self._worldWind.hideLayer(layer);
				}
			});
		},50);
	};


	return WmsLayersPanel;
});