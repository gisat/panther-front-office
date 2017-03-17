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
		this.clear();
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
		var id = this._id + "-" + layer.id;
		var name = layer.name;
		var container = this._panelBodySelector;

		this.addCheckbox(id, name, container, id, false);
		this._worldWind.layers.addWmsLayer(layer, this._id, false);
	};

	/**
	 * Add listeners
	 */
	WmsLayersPanel.prototype.addEventsListeners = function(){
		this.addCheckboxOnClickListener();
	};

	/**
	 * Hide/show layers
	 */
	WmsLayersPanel.prototype.toggleLayer = function(event){
		var self = this;
		setTimeout(function(){
			var checkbox = $(event.currentTarget);
			var layerId = checkbox.attr("data-id");
			if (checkbox.hasClass("checked")){
				self._worldWind.layers.showLayer(layerId);
			} else {
				self._worldWind.layers.hideLayer(layerId);
			}
		},50);
	};


	return WmsLayersPanel;
});