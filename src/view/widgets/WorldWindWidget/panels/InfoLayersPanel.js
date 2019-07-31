import jQuery from 'jquery';
import _ from 'lodash';

import ArgumentError from '../../../../error/ArgumentError';
import Logger from '../../../../util/Logger';

import Remote from '../../../../util/RemoteJQ';
import WorldWindWidgetPanel from './WorldWindWidgetPanel';

/**
 * Class representing Info Layers Panel of WorldWindWidget
 * TODO move general methods to WorldWindWidgetPanel class
 * @params options {Object}
 * @params options.store {Object}
 * @params options.store.map {MapStore}
 * @params options.store.state {StateStore}
 * @constructor
 */
class InfoLayersPanel extends WorldWindWidgetPanel {
    constructor(options) {
        super(options);

        if (!options.store) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'InfoLayersPanel', 'constructor', 'Stores must be provided'));
        }
        if (!options.store.state) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'InfoLayersPanel', 'constructor', 'Store state must be provided'));
        }
        if (!options.store.map) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'InfoLayersPanel', 'constructor', 'Store map must be provided'));
        }

        this._groupId = "info-layers";
        this._group2dId = "topiclayer";

        this._layersControls = [];

        this._store = options.store;
		this._stateStore = options.store.state;
    };

    /**
     * Add onclick listener to every checkbox
     * Temporarily in this class TODO move method to parent
     */
    addCheckboxOnClickListener() {
        this._panelBodySelector.on("click", ".checkbox-row", this.switchLayer.bind(this));
    };

    /**
     * Get all info layers for current configuration from backend. Then rebuild panel in World Wind Widget, remove all old info layers from World Wind and add new ones to each map according to associated period.
     */
    rebuild() {
        let self = this;
        this._allMaps = this._store.map.getAll();
        let scope = this._store.state.current().scope;
        let opacity = (scope && scope.get && scope.get('defaultOpacity')) || 70;
        this.getLayersForCurrentConfiguration().then(function (result) {
            self.clear(self._id);
            self._previousLayersControls = jQuery.extend(true, [], self._layersControls);
            self._layersControls = [];
            if (result && result.length > 0) {
                let layerGroups = self.groupDataByLayerGroup(result);
                let preparedLayerGroups = self.groupLayersByLayerTemplate(layerGroups, opacity);
                self.addPanelContent(preparedLayerGroups);
                self.displayPanel("block");
                if (preparedLayerGroups.length < 1) {
                    self.displayPanel("none");
                }
            } else {
                console.warn("InfoLayersPanel#rebuild: No info layers for current configuration.");
                self.displayPanel("none");
            }
        }).catch(function (err) {
            throw new Error(err);
        });
    };

    /**
     * Add groups and controls
     * @param layerGroups {Array}
     */
    addPanelContent(layerGroups) {
        let self = this;
        layerGroups.forEach(function (group) {
            let layerGroupBodySelector = self.addLayerGroup(group.name.replace(/ |&/g, '_'), group.name);
            group.layers.forEach(function (layerTemplate) {
                if (layerTemplate.styles.length > 0) {
                    layerTemplate.styles.forEach(function (style) {
                        let id = layerTemplate.layerTemplateId + "-" + style.path;
                        let name = layerTemplate.name + " - " + style.name;
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
    groupLayersByLayerTemplate(layerGroups, opacity) {
        let preparedLayerGroups = [];
        layerGroups.forEach(function (layerGroup) {
            let groupedLayers = [];
            layerGroup.layers.forEach(function (layer) {
                let layerTemplateId = layer.layerTemplateId;
                let existingLayer = _.find(groupedLayers, function (lay) {
                    return lay.layerTemplateId === layerTemplateId
                });
                if (!existingLayer) {
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
    groupDataByLayerGroup(dataForPeriods) {
        let groupedData = [];
        dataForPeriods.forEach(function (dataForPeriod) {
            dataForPeriod.data.forEach(function (layerGroup) {
                let groupId = layerGroup.id;
                let existingGroup = _.find(groupedData, function (group) {
                    return group.id === groupId
                });
                // add group if doesn't exist
                if (!existingGroup) {
                    groupedData.push(layerGroup);
                }
                // go through all layers of a group
                else {
                    layerGroup.layers.forEach(function (layer) {
                        let layerId = layer.id;
                        let existingLayer = _.find(existingGroup.layers, function (lay) {
                            return lay.id === layerId
                        });
                        // add layer to the group if doesn't exist
                        if (!existingLayer) {
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
    getLayersForCurrentConfiguration() {
        let configuration = this._store.state.current();
        let scope = configuration.scope;
        let theme = configuration.theme;
        let periods = configuration.periods;
        let place = configuration.locations;

        let self = this;
        let promises = [];
        periods.forEach(function (period) {
            promises.push(self.getLayersFromAPI(scope, place, period, theme));
        });

        return Promise.all(promises);
    };

    /**
     * Get the layers list from server
     * @param scope {string|number} Scope id
     * @param place {string|array} Place id. Empty strin means all places.
     * @param period {string|number} Period id.
     * @param theme {string|number} ThemeSelector id.
     * @returns {Promise}
     */
    getLayersFromAPI(scope, place, period, theme) {
        return new Remote({
            url: "rest/filtered/layer",
            params: {
                scope: scope,
                place: place,
                year: period,
                theme: theme
            }
        }).get();
    };

	/**
	 * Go through a list of active layers. If at least one layer associated with given control is among active infoLayers,
	 * the control should be active.
	 * @param templateId {string} id of template
     * @param style {object}
	 * @returns {boolean} true, if control should be active
	 */
	isControlActive(templateId, style){
	    let state = this._stateStore.current();
		let mapDefaults = state.mapDefaults;
		let scopeConfig = state && state.scopeFull && state.scopeFull.configuration;
		if (mapDefaults && mapDefaults.layerTemplates){
			return (_.findIndex(mapDefaults.layerTemplates, function(template){
			    if (style || template.styles){
					let savedPath = (template.styles && template.styles.length) ? template.styles[0].path : null;

                    let pucsStyles = scopeConfig && scopeConfig.pucsLandUseScenarios && scopeConfig.pucsLandUseScenarios.styles;
                    let layerTemplateKey = template.templateId;
                    let activePlaceKey = state.locations && state.locations[0];

                    if (pucsStyles && layerTemplateKey && activePlaceKey) {
                        if (pucsStyles && layerTemplateKey && activePlaceKey) {
                            let styleObject = _.find(pucsStyles, {'layerTemplateKey': layerTemplateKey, 'placeKey': activePlaceKey});
                            if (styleObject) {
                                savedPath = styleObject.styleId;
                            }
                        }
                    }

			        let requiredPath = style ? style.path : null;
					return template.templateId === templateId && savedPath === requiredPath;
                } else {
			        return template.templateId === templateId;
                }
			}) > -1);
		} else {
			return false;
		}
	};
}

export default InfoLayersPanel;