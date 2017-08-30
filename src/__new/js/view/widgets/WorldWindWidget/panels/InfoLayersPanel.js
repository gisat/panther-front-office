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
		this._infoLayers = [];
	};

	InfoLayersPanel.prototype = Object.create(WorldWindWidgetPanel.prototype);

	/**
	 * Rebuild panel
	 */
	InfoLayersPanel.prototype.rebuild = function(){
		this._groupId = "topiclayer";
		this.clear(this._id);

		var self = this;
		this.getLayersFromAPI().then(function(result){
			if (result.hasOwnProperty("data") && result.data.length > 0){
				self.addGroups(result.data);
				self.switchOnActiveLayers(self._groupId);
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
					self.addLayer(id, name, layerList, target, style, false);
				});
			} else {
				self.addLayer(id, name, layerList, target, "", false);
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
	 * @param visible {boolean} true, if layer should be visible
	 */
	InfoLayersPanel.prototype.addLayer = function(id, name, layers, target, style, visible){
		var layerId = this._groupId + "-" + id;
		var layerPaths = this.getLayerNames(layers);
		var stylePaths = "";
		var layerName = name;
		if (style){
			stylePaths = style.path;
			if (style.name != null){
				layerName = layerName + " - " + style.name;
			}
			layerId = layerId + "-" + stylePaths;
		}

		var layer = {};
		layer.data = {
			id: layerId,
			layerPaths: layerPaths,
			opacity: 70,
			stylePaths: stylePaths,
			name: layerName,
			path: layerPaths.split(",")[0]
		};
		layer.control = this.addLayerControl(layerId, layerName, target, visible);

		this.rebuildLayer(layer);
		this._infoLayers.push(layer);
	};

	/**
	 * Rebuild layer with current data
	 * @param layer {Object}
	 */
	InfoLayersPanel.prototype.rebuildLayer = function(layer){
		for (var key in this._maps){
			this._maps[key].layers.addInfoLayer(layer.data, this._id, false);
		}
		var tools = layer.control.getToolBox();
		tools.clear();
		tools.addLegend(layer.data, this._maps);
		tools.addMetadataIcon(layer.data);
		tools.addOpacity(layer.data, this._maps);
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
	 * Get the layers list from server
	 */
	InfoLayersPanel.prototype.getLayersFromAPI = function(){
		var configuration = Stores.retrieve("state").current();

		var scope = Number(configuration.scope);
		var theme = Number(configuration.theme);
		var year = Number(configuration.periods[0]);
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