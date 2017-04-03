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
		data.forEach(function(group){
			target = self.addLayerGroup(group.name.replace(/ /g, '_'), group.name);
			self.addLayersToGroup(target, group.layers);
		});
	};

	/**
	 * Group layers by temlate id
	 * @param layers {Array} list of layers
	 * @returns {Object} layers grouped by id
	 */
	InfoLayersPanel.prototype.groupLayersByTemplate = function(layers){
		var groupedLayers = {};
		layers.forEach(function(layer){
			var template = layer.layerTemplateId;
			if (!groupedLayers.hasOwnProperty(template)){
				groupedLayers[template] = {};
				groupedLayers[template]["id"] = template;
				groupedLayers[template]["name"] = layer.name;
				groupedLayers[template]["styles"] = layer.styles;
				groupedLayers[template]["layers"] = [];
			}
			groupedLayers[template]["layers"].push(layer);
		});

		return groupedLayers;
	};

	/**
	 * Add layers to group
	 * @param target {JQuery} selector of target element
	 * @param layers {Array} list of layers
	 */
	InfoLayersPanel.prototype.addLayersToGroup = function(target, layers){
		var self = this;
		var groupedLayers = this.groupLayersByTemplate(layers);

		for (var template in groupedLayers){
			var id = groupedLayers[template].id;
			var name = groupedLayers[template].name;
			var layerList = groupedLayers[template].layers;
			var styles = groupedLayers[template].styles;
			if (styles && styles.length > 0){
				styles.forEach(function(style){
					self.addLayer(id, name, layerList, target, style);
				});
			} else {
				self.addLayer(id, name, layerList, target);
			}
		}
	};

	/**
	 * Add representation of a layer to the panel and layer to the map
	 * @param id {string} Id of the layer
	 * @param name {string} Name of the layer, which is displayed in the panel
	 * @param layers {Array} list of data layers. From them are paths of layer acquired.
	 * @param target {JQuery} selector of target element, where will be a layer's control rendered (in a form of checkbox)
	 * @param style {Object} data about style of the layer
	 */
	InfoLayersPanel.prototype.addLayer = function(id, name, layers, target, style){
		var layerId = "wms-layer-" + id;
		var layerPaths = this.getLayerNames(layers);
		var stylePaths = "";
		var layerName = name;
		if (style){
			stylePaths = style.path;
			layerName = layerName + " - " + style.name;
			layerId = layerId + "-" + stylePaths;
		}

		// add layer to the map
		this._worldWind.layers.addInfoLayer(layerPaths, stylePaths, layerId, layerName, this._id, false);

		// add layer's control to the panel
		var control = this.addLayerControl(layerId, layerName, target);
		var tools = control.getToolBox();

		var layerMetadata = {
			id: layerId,
			name: layerName,
			stylePath: stylePaths,
			path: layerPaths.split(",")[0]
		};
		tools.addLegend(layerMetadata, this._worldWind);
		tools.addOpacity(layerMetadata, this._worldWind);
	};

	/**
	 * @param layers {Array} list of layers data
	 * @returns {string} list of layers' paths separated by comma
	 */
	InfoLayersPanel.prototype.getLayerNames = function(layers){
		if (layers.length > 0){
			var names = [];
			layers.forEach(function(layer){
				names.push(layer.path);
			});
			return names.join(",");
		} else {
			return layers[0].path;
		}
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

	return InfoLayersPanel;
});