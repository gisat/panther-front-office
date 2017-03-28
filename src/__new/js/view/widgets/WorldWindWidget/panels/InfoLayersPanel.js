define(['../../../../error/ArgumentError',
	'../../../../error/NotFoundError',
	'../../../../util/Logger',

	'../../../../util/RemoteJQ',
	'../../../../stores/Stores',
	'./WorldWindWidgetPanel',

	'jquery',
	'string'
], function(ArgumentError,
			NotFoundError,
			Logger,

			Remote,
			Stores,
			WorldWindWidgetPanel,

			$,
			S
){
	/**
	 * Class representing Info Layers Panel of WorldWindWidget
	 * @param options {Object}
	 * @constructor
	 */
	var InfoLayersPanel = function(options){
		WorldWindWidgetPanel.apply(this, arguments);
	};

	InfoLayersPanel.prototype = Object.create(WorldWindWidgetPanel.prototype);

	/**
	 * Add content to panel
	 */
	InfoLayersPanel.prototype.addContent = function(){
		this.addEventsListeners();
	};

	/**
	 * Rebuild panel with current configuration
	 * @param configuration {Object} configuration from global object ThemeYearConfParams
	 */
	InfoLayersPanel.prototype.rebuild = function(configuration){
		if (!configuration){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "InfoLayersPanel", "constructor", "missingParameter"));
		}
		this.clear();

		var self = this;
		this.getLayers(configuration).then(function(result){
			if (result.hasOwnProperty("data") && result.data.length > 0){
				self.addGroups(result.data);
				self.displayPanel("block");
			} else {
				self.displayPanel("none");
			}
		}).catch(function(err){
			throw new Error(err);
		});
	};

	/**
	 * It adds groups and layers to panel
	 * @param data {Array} list of layer groups
	 */
	InfoLayersPanel.prototype.addGroups = function(data){
		var self = this;
		var target = null;
		var other = null;
		data.forEach(function(group){
			target = self.addLayerGroup(group.name.replace(/ /g, '_'), group.name);
			self.addLayersToGroup(target, group.layers);
		});
	};

	/**
	 * Add layers to group
	 * @param target {JQuery} selector of target element
	 * @param layers {Array} list of layers
	 */
	InfoLayersPanel.prototype.addLayersToGroup = function(target, layers){
		var self = this;
		layers.forEach(function(layer){
			layer.id = layer.path.split(":")[1];
			self._worldWind.layers.addInfoLayer(layer, this._id, false);
			self.addRow(layer, target, self._worldWind);
		});
	};

	/**
	 * Get the layers list from server
	 * @param configuration {Object} configuration from global object ThemeYearConfParams
	 */
	InfoLayersPanel.prototype.getLayers = function(configuration){
		var scope = Number(configuration.dataset);
		var theme = Number(configuration.theme);
		var year = JSON.parse(configuration.years);
		var place = "";
		if (configuration.place.length > 0){
			place = [Number(configuration.place)];
		}

		return new Remote({
			url: "rest/filtered/layer",
			params: {
				scope: scope,
				place: place,
				year: year,
				theme: theme
			}}).get();
	};

	/**
	 * Add tools for the layer
	 * @param tools {LayerTools}
	 * @param layerMetadata {Object}
	 * @param worldWind {WorldWindMap}
	 */
	InfoLayersPanel.prototype.addTools = function(tools, layerMetadata, worldWind){
		tools.addLegend(layerMetadata, worldWind);
		tools.addOpacity(layerMetadata, worldWind);
	};

	/**
	 * Add listeners
	 */
	InfoLayersPanel.prototype.addEventsListeners = function(){
		this.addCheckboxOnClickListener();
	};

	/**
	 * Hide/show layers
	 */
	InfoLayersPanel.prototype.toggleLayer = function(event){
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

	return InfoLayersPanel;
});