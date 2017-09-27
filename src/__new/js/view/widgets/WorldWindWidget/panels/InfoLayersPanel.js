define(['../../../../error/ArgumentError',
	'../../../../error/NotFoundError',
	'../../../../util/Logger',

	'./LayerControl/LayerControl',

	'../../../../util/RemoteJQ',
	'../../../../stores/Stores',
	'./WorldWindWidgetPanel',

	'jquery',
	'string'
], function(ArgumentError,
			NotFoundError,
			Logger,

			LayerControl,

			Remote,
			Stores,
			WorldWindWidgetPanel,

			$,
			S
){
	/**
	 * Class representing Info Layers Panel of WorldWindWidget
	 * TODO move general methods to WorldWindWidgetPanel class
	 * @params options {Object}
	 * @constructor
	 */
	var InfoLayersPanel = function(options){
		WorldWindWidgetPanel.apply(this, arguments);
		this._infoLayersControls = [];
	};

	InfoLayersPanel.prototype = Object.create(WorldWindWidgetPanel.prototype);

	/**
	 * Get all info layers for current configuration from backend. Then rebuild panel in World Wind Widget, remove all old info layers from World Wind and add new ones to each map according to associated period.
	 */
	InfoLayersPanel.prototype.rebuild = function(){
		var self = this;
		this._allMaps = Stores.retrieve("map").getAll();
		this.getLayersForCurrentConfiguration().then(function(result){
			self.clear(self._id);
			self._infoLayersControls = [];
			if (result && result.length > 0){
				var layerGroups = self.groupDataByLayerGroup(result);
				var preparedLayerGroups = self.groupLayersByLayerTemplate(layerGroups);
				self.addPanelContent(preparedLayerGroups);
				self.displayPanel("block");
			} else {
				console.warn("InfoLayersPanel#rebuild: No info layers for current configuration.");
				self.displayPanel("none");
			}
		}).catch(function(err){
			throw new Error(err);
		});
	};

	/**
	 * Add groups and controls
	 * @param layerGroups {Array}
	 */
	InfoLayersPanel.prototype.addPanelContent = function(layerGroups){
		var self = this;
		layerGroups.forEach(function(group){
			var layerGroupBodySelector = self.addLayerGroup(group.name.replace(/ /g, '_'), group.name);
			group.layers.forEach(function(layerTemplate){
				if (layerTemplate.styles.length > 0){
					layerTemplate.styles.forEach(function(style){
						self.buildLayerControlRow(layerGroupBodySelector, layerTemplate.layerTemplateId, layerTemplate.name, layerTemplate.layers, style, true);
					});
				} else {
					self.buildLayerControlRow(layerGroupBodySelector, layerTemplate.layerTemplateId, layerTemplate.name, layerTemplate.layers, null, true);
				}
			});
		});
	};

	/**
	 * Build layer control and add tools
	 * @param target {Object} JQuery selector of target element
	 * @param id {string} id of contol row
	 * @param name {string} label
	 * @param layers {Array} list of associated layers
	 * @param style {Object|null} associated style, if exist
	 * @param checked {boolean} true, if associated layers should be visible by default
	 */
	InfoLayersPanel.prototype.buildLayerControlRow = function(target, id, name, layers, style, checked){
		var control = this.addLayerControl(target, id, name, layers, style, checked);
		this._infoLayersControls.push(control);
		control.layerTools.buildLegend(style);
		control.layerTools.buildOpacity(style);
		if (checked){
			this.showLayers(control);
		}
	};

	/**
	 *
	 * @param target {Object} Jquery selector of targete element
	 * @param id {number} id of layer template
	 * @param name {string} name of layer
	 * @param layers {Array} list of layers attached to this control
	 * @param [style] {Object} Optional parameter. Id of the style
	 * @param [checked] {boolean} Optional parameter. True, if the layer should be visible by default.
	 * @returns {LayerControl}
	 */
	InfoLayersPanel.prototype.addLayerControl = function(target, id, name, layers, style, checked){
		return new LayerControl({
			id: id,
			name: name,
			target: target,
			layers: layers,
			maps: this._allMaps,
			style: style,
			checked: checked,
			groupId: "info-layers"
		});
	};

	/**
	 * Group layers by layer template id
	 * @param layerGroups {Array}
	 * @returns {Array} Layer groups
	 */
	InfoLayersPanel.prototype.groupLayersByLayerTemplate = function(layerGroups){
		var preparedLayerGroups = [];
		layerGroups.forEach(function(layerGroup){
			var groupedLayers = [];
			layerGroup.layers.forEach(function(layer){
				var layerTemplateId = layer.layerTemplateId;
				var existingLayer = _.find(groupedLayers, function(lay){return lay.layerTemplateId === layerTemplateId});
				if (!existingLayer){
					groupedLayers.push({
						layerTemplateId: layerTemplateId,
						layers: [layer],
						opacity: 70,
						name: layer.name,
						styles: layer.styles
					});
				} else {
					existingLayer.layers.push(layer);
				}
			});
			layerGroup.layers = groupedLayers;
			preparedLayerGroups.push(layerGroup);
		});

		return preparedLayerGroups;
	};

	/**
	 * Group data by layer group.
	 * @param dataForPeriods {Array} List of data for each period
	 * @returns {Array} Layer groups
	 */
	InfoLayersPanel.prototype.groupDataByLayerGroup = function(dataForPeriods){
		var groupedData = [];
		dataForPeriods.forEach(function(dataForPeriod){
			dataForPeriod.data.forEach(function(layerGroup){
				var groupId = layerGroup.id;
				var existingGroup = _.find(groupedData, function(group){return group.id === groupId});
				// add group if doesn't exist
				if (!existingGroup){
					groupedData.push(layerGroup);
				}
				// go through all layers of a group
				else {
					layerGroup.layers.forEach(function(layer){
						var layerId = layer.id;
						var existingLayer = _.find(existingGroup.layers, function(lay){return lay.id === layerId});
						// add layer to the group if doesn't exist
						if (!existingLayer){
							existingGroup.layers.push(layer);
						}
					});
				}
			});
		});
		return groupedData;
	};

	/**
	 * Get layers for each period separately.
	 */
	InfoLayersPanel.prototype.getLayersForCurrentConfiguration = function(){
		var configuration = Stores.retrieve("state").current();
		var scope = configuration.scope;
		var theme = configuration.theme;
		var periods = configuration.periods;
		var place = "";
		if (configuration.place.length > 0){
			place = [configuration.place];
		}

		var self = this;
		var promises = [];
		periods.forEach(function(period){
			promises.push(self.getLayersFromAPI(scope, place, period, theme));
		});

		return Promise.all(promises);
	};

	/**
	 * Get the layers list from server
	 * @param scope {string|number} Scope id
	 * @param place {string|array} Place id. Empty strin means all places.
	 * @param period {string|number} Period id.
	 * @param theme {string|number} Theme id.
	 * @returns {Promise}
	 */
	InfoLayersPanel.prototype.getLayersFromAPI = function(scope, place, period, theme){
		return new Remote({
			url: "rest/filtered/layer",
			params: {
				scope: scope,
				place: place,
				year: period,
				theme: theme
			}}).get();
	};

	/**
	 * Show/hide all layers for given control
	 * @param event {Object}
	 */
	InfoLayersPanel.prototype.toggleLayer = function(event){
		var self = this;
		setTimeout(function(){
			var checkbox = $(event.currentTarget);
			var layerId = checkbox.attr("data-id");
			var control = _.find(self._infoLayersControls, function(control){return control._id == layerId});
			if (checkbox.hasClass("checked")){
				self.showLayers(control);
			} else {
				self.hideLayers(control);
			}
		},50);
	};

	/**
	 * Show all layers associted with control for given period
	 * @param control {Object}
	 */
	InfoLayersPanel.prototype.showLayers = function(control){
		var self = this;
		control.layers.forEach(function(layerData){
			self._allMaps.forEach(function(map){
				if (layerData.period === map.period){
					var layerId = layerData.id;
					var layerPaths = layerData.path;
					var stylePaths = "";
					var layerName = layerData.name;
					if (control.style){
						stylePaths = control.style.path;
						if (control.style.name){
							layerName = layerName + " - " + control.style.name;
						}
						layerId = layerId + "-" + stylePaths;
					}
					var layer = {};
					layer.data = {
						id: layerId,
						layerPaths: layerPaths,
						opacity: control.opacity,
						stylePaths: stylePaths,
						name: layerName,
						path: layerPaths.split(",")[0]
					};

					map.layers.addInfoLayer(layer.data, self._id, true);
				}
			});
		});
	};

	/**
	 * Hide all layers associated with control for given period
	 * @param control {Object}
	 */
	InfoLayersPanel.prototype.hideLayers = function(control){
		var self = this;
		control.layers.forEach(function(layerData){
			self._allMaps.forEach(function(map){
				if (layerData.period === map.period){
					var id = layerData.id;
					if (control.style){
						id = id + "-" + control.style.path;
					}
					var layer = map.layers.getLayerById(id);
					map.layers.removeLayer(layer);
				}
			});
		});
	};

	return InfoLayersPanel;
});