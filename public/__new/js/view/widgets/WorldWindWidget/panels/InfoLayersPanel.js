define(['../../../../error/ArgumentError',
	'../../../../error/NotFoundError',
	'../../../../util/Logger',

	'./LayerControl/LayerControl',

	'../../../../util/RemoteJQ',
	'./WorldWindWidgetPanel',

	'jquery',
	'string'
], function(ArgumentError,
			NotFoundError,
			Logger,

			LayerControl,

			Remote,
			WorldWindWidgetPanel,

			$,
			S
){
	/**
	 * Class representing Info Layers Panel of WorldWindWidget
	 * TODO move general methods to WorldWindWidgetPanel class
	 * @params options {Object}
	 * @params options.store {Object}
	 * @params options.store.map {MapStore}
	 * @params options.store.state {StateStore}
	 * @constructor
	 */
	var InfoLayersPanel = function(options){
		WorldWindWidgetPanel.apply(this, arguments);

		if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'InfoLayersPanel', 'constructor', 'Stores must be provided'));
        }
        if(!options.store.state){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'InfoLayersPanel', 'constructor', 'Store state must be provided'));
        }
        if(!options.store.map){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'InfoLayersPanel', 'constructor', 'Store map must be provided'));
        }

		this._groupId = "info-layers";
		this._group2dId = "topiclayer";

		this._layersControls = [];

		this._store = options.store;
		this._stateStore = options.store.state;
	};

	InfoLayersPanel.prototype = Object.create(WorldWindWidgetPanel.prototype);

	/**
	 * Add onclick listener to every checkbox
	 * Temporarily in this class TODO move method to parent
	 */
	InfoLayersPanel.prototype.addCheckboxOnClickListener = function(){
		this._panelBodySelector.on("click", ".checkbox-row", this.switchLayer.bind(this));
	};

	/**
	 * Get all info layers for current configuration from backend. Then rebuild panel in World Wind Widget, remove all old info layers from World Wind and add new ones to each map according to associated period.
	 */
	InfoLayersPanel.prototype.rebuild = function(){
		var self = this;
		this._allMaps = this._store.map.getAll();
        var scope = this._store.state.current().scope;
        var opacity = scope && scope.get && scope.get('defaultOpacity') || 70;
        this.getLayersForCurrentConfiguration().then(function(result){
			self.clear(self._id);
			self._previousLayersControls = jQuery.extend(true, [], self._layersControls);
			self._layersControls = [];
			if (result && result.length > 0){
				var layerGroups = self.groupDataByLayerGroup(result);
				var preparedLayerGroups = self.groupLayersByLayerTemplate(layerGroups, opacity);
				self.addPanelContent(preparedLayerGroups);
				self.displayPanel("block");
				if (preparedLayerGroups.length < 1){
					self.displayPanel("none");
				}
			} else {
				Logger.logMessage(Logger.LEVEL_WARNING, 'InfoLayersPanel', 'rebuild', 'No info layers for current configuration.');
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
						var id = layerTemplate.layerTemplateId + "-" + style.path;
						var name = layerTemplate.name + " - " + style.name;
						self.buildLayerControlRow(layerGroupBodySelector, id, name, layerTemplate.layers, style, layerTemplate.layerTemplateId);
					});
				} else {
					self.buildLayerControlRow(layerGroupBodySelector, layerTemplate.layerTemplateId, layerTemplate.name, layerTemplate.layers, null, layerTemplate.layerTemplateId);
				}
			});
		});
	};

	/**
	 * Group layers by layer template id
	 * @param layerGroups {Array}
	 * @param opacity {Number} Number betwen 0 and 100 showing default opacity of he layer.
	 * @returns {Array} Layer groups
	 */
	InfoLayersPanel.prototype.groupLayersByLayerTemplate = function(layerGroups, opacity){
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
						opacity: opacity,
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
		var configuration = this._store.state.current();
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
	 * Go through a list of active layers. If at least one layer associated with given control is among active infoLayers,
	 * the control should be active.
	 * @param templateId {string} id of template
	 * @returns {boolean} true, if control should be active
	 */
	InfoLayersPanel.prototype.isControlActive = function(templateId){
		var state = this._stateStore.current().mapDefaults;
		if (state && state.layerTemplates){
			return (_.findIndex(state.layerTemplates, function(template){return template === templateId}) > -1);
		} else {
			return false;
		}
	};

	return InfoLayersPanel;
});