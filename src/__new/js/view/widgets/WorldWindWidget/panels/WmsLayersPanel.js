define(['../../../../error/ArgumentError',
	'../../../../error/NotFoundError',
	'../../../../util/Logger',

	'./LayerControl/LayerControl',
	'../../../../stores/Stores',
	'./WorldWindWidgetPanel',

	'jquery',
	'underscore',
	'string'
], function(ArgumentError,
			NotFoundError,
			Logger,

			LayerControl,
			StoresInternal,
			WorldWindWidgetPanel,

			$,
			_,
			S
){
	/**
	 * Class representing Wms Layers Panel of WorldWindWidget
	 * @param options {Object}
	 * @constructor
	 */
	var WmsLayersPanel = function(options){
		WorldWindWidgetPanel.apply(this, arguments);
		this._groupId = "wms-layers";
		this._group2dId = "wmsLayer";
		this._idPrefix = "wmsLayer";
		this._layersControls = [];
	};

	WmsLayersPanel.prototype = Object.create(WorldWindWidgetPanel.prototype);

	/**
	 * Add onclick listener to every checkbox
	 * Temporarily in this class TODO move method to parent
	 */
	WmsLayersPanel.prototype.addCheckboxOnClickListener = function(){
		this._panelBodySelector.on("click", ".checkbox-row", this.switchLayer.bind(this));
	};

	/**
	 * Rebuild panel
	 */
	WmsLayersPanel.prototype.rebuild = function(){
		var self = this;
		this._allMaps = StoresInternal.retrieve("map").getAll();
		this.getLayersForCurrentConfiguration().then(function(layers){
			self.clear(self._id);
			self._previousWmsLayersControls = jQuery.extend(true, {}, self._layersControls);
			self._layersControls = [];
			if (layers && layers.length > 0){
				layers.forEach(function(layer){
					self.buildLayerControlRow(self._panelBodySelector, layer.id, layer.name, [layer], null);
				});
				self.displayPanel("block");
			} else {
				console.warn("WmsLayersPanel#rebuild: No WMS layers for current configuration.");
				self.displayPanel("none");
			}
		});
	};

	/**
	 * Get WMS layers for each place.
	 */
	WmsLayersPanel.prototype.getLayersForCurrentConfiguration = function(){
		var wmsStore = StoresInternal.retrieve('wmsLayer');
		var configuration = StoresInternal.retrieve("state").current();
		var periods = configuration.periods;
		var locations = configuration.allPlaces;
		if (configuration.place.length > 0){
			locations = [Number(configuration.place)];
		}
		var promises = [];
		locations.forEach(function(location){
			promises.push(wmsStore.filter({locations: location}));
		});
		return Promise.all(promises).then(function(results){
			if (results.length > 0){
				var relevantLayers = [];
				var layers = _.flatten(results);
				var periods = configuration.periods;
				layers.forEach(function(layer){
					if(_.intersection(layer.periods, periods).length > 0){
						relevantLayers.push(layer);
					}
				});
				return relevantLayers;
			}
		});
	};

	return WmsLayersPanel;
});