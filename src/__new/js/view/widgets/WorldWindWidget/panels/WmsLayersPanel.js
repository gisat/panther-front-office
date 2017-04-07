define(['../../../../error/ArgumentError',
	'../../../../error/NotFoundError',
	'../../../../util/Logger',

	'../../../../stores/Stores',
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
		this._groupId = "wmsLayer";
	};

	WmsLayersPanel.prototype = Object.create(WorldWindWidgetPanel.prototype);

	/**
	 * Rebuild panel with current configuration
	 * @param configuration {Object} configuration from global object ThemeYearConfParams
	 */
	WmsLayersPanel.prototype.rebuild = function(configuration){
		if (!configuration){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WmsLayersPanel", "rebuild", "missingParameter"));
		}
		this.clear(this._id);
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
					self.switchOnActiveLayers(self._groupId);
				});
				self.displayPanel("block");
			} else {
				self.displayPanel("none");
			}
		}).catch(function(err){
			throw new Error(err);
		});
	};

	/**
	 * Add layer to the panel and map
	 * @param layer {Object}
	 */
	WmsLayersPanel.prototype.addLayer = function(layer){
		this._worldWind.layers.addWmsLayer(layer, this._id, false);
		var control = this.addLayerControl("wmsLayer-" + layer.id, layer.name, this._panelBodySelector, false);
		var tools = control.getToolBox();
		tools.addOpacity(layer, this._worldWind);
	};

	return WmsLayersPanel;
});