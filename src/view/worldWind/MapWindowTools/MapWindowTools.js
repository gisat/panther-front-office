import ArgumentError from '../../../error/ArgumentError';
import Logger from '../../../util/Logger';
import Actions from '../../../actions/Actions';
import _ from 'underscore';

    /**
     * Class representing tools of WorldWindMap (such as label, close button etc.)
     * @param options {Object}
     * @param options.dispatcher {Object} Object for handling events in the application.
     * @param options.mapId {string} id of the map
     * @param options.mapName {string} name of the map
     * @param options.store {Object}
     * @param options.store.map {MapStore}
     * @param options.store.periods {Periods}
     * @param options.store.scopes {Scopes}
     * @param options.store.state {StateStore}
     * @param options.targetContainer {Object} JQuery selector of target element
     * @constructor
     */
    class MapWindowTools {
        constructor(options) {
            if (!options.dispatcher) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MapWindowTools', 'constructor', 'Dispatcher  must be provided'));
            }
            if (!options.mapId) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MapWindowTools', 'constructor', 'Map id must be provided'));
            }
            if (!options.store) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MapWindowTools', 'constructor', 'Stores must be provided'));
            }
            if (!options.store.map) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MapWindowTools', 'constructor', 'Stores map must be provided'));
            }
            if (!options.store.periods) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MapWindowTools', 'constructor', 'Stores periods must be provided'));
            }
            if (!options.store.scopes) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MapWindowTools", "constructor", "missingScopesStore"));
            }
            if (!options.store.state) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MapWindowTools', 'constructor', 'Stores state must be provided'));
            }
            if (!options.targetContainer) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MapWindowTools", "constructor", "Target container selector must be provided!"));
            }

            this._dispatcher = options.dispatcher;
            this._mapId = options.mapId;
            this._name = options.mapName || "Map";
            this._mapStore = options.store.map;
            this._periodsStore = options.store.periods;
            this._scopesStore = options.store.scopes;
            this._stateStore = options.store.state;
            this._targetContainer = options.targetContainer;
            this.build();
        };

    /**
     * Add close button to map
     * @param mapId {string} Id of the map
     */
    addCloseButton() {
        var closeButton = this._mapToolsSelector.find(".close-map-button");
        if (closeButton.length === 0) {
            var html = '<div title="Remove map" class="close-map-button"><i class="close-map-icon">&#x2715;</i></div>';
            this._mapToolsSelector.prepend(html);
            this._closeButton = this._mapToolsSelector.find(".close-map-button");
            this.addCloseButtonListener();
        }
    };

    /**
     * Add listener to close button of each map
     */
    addCloseButtonListener() {
        var state = this._stateStore.current();
        var self = this;
        this._closeButton.on("click", function () {
			if (state.isMapIndependentOfPeriod && !state.isMapDependentOnScenario){
				self._dispatcher.notify("map#remove",{id: self._mapId});
			} else if (state.isMapDependentOnScenario){
				let scenarioKey = self._mapStore.getMapById(self._mapId).scenarioKey;
				if (scenarioKey){
					self._dispatcher.notify("scenario#removeActive",{scenarioKey: scenarioKey});
				} else {
					self._dispatcher.notify("scenario#removeDefaultSituation");
				}
			} else {
				let mapPeriod = self._mapStore.getMapById(self._mapId).period;
				let periods = _.reject(self._stateStore.current().periods, function(period) { return period === mapPeriod; });
				self._dispatcher.notify("periods#change", periods);
			}
        });
    };

    /**
     * Add label with info about a map (aka map title)
     * @param period {number}
     */
    addMapLabel(period) {
        var state = this._stateStore.current();
        var self = this;
        this._scopesStore.byId(state.scope).then(function (scopes) {
            var scope = scopes[0];
            if (!scope.hideMapName) {
                if (period && !state.isMapIndependentOfPeriod && !state.isMapDependentOnScenario) {
                    self.addMapLabelWithPeriod(period);
                } else {
                    self.addMapLabelWithName();
                }
            }
        });
    };

    /**
     * Add label with map name
     */
    addMapLabelWithName(name) {
		if (name){
			this._name = name;
		}
        this._mapToolsSelector.find(".map-name-label").remove();
        var html = '<div class="map-name-label">' + this._name + '</div>';
        this._mapToolsSelector.append(html);
        this._nameLabelSelector = this._targetContainer.find(".map-name-label");
    };

    /**
     * Add label with info about about period to the map.
     * Add dataPeriod attribute of the map container (it is used for sorting)
     */
    addMapLabelWithPeriod(period) {
        var self = this;
        this._periodsStore.byId(period).then(function (periods) {
            if (periods.length === 1) {
                self._mapToolsSelector.find(".map-name-label").remove();
                var periodName = periods[0].name;
                var html = '<div class="map-name-label">' + periodName + '</div>';
                self._targetContainer.attr("data-period", periodName);
                self._mapToolsSelector.append(html);
                self._nameLabelSelector = self._mapToolsSelector.find(".map-name-label");
            }
        });
    };

    /**
     * Add label with info about layer
     * @param info {string}
     */
    addLayerInfo(info) {
        this._mapToolsSelector.find(".layer-info-label").remove();
        var html = '<div class="layer-info-label">' + info + '</div>';
        this._mapToolsSelector.append(html);
        this._layerInfoSelector = this._mapToolsSelector.find(".layer-info-label");
    };

    /**
     * Build tools container
     */
    build() {
        this._targetContainer.append('<div class="map-window-tools"></div>');
        this._mapToolsSelector = this._targetContainer.find('.map-window-tools');
    };

    /**
     * Remove close button from this map
     */
    removeCloseButton() {
        this._mapToolsSelector.find(".close-map-button").remove();
    };

    /**
     * Remove layer info label
     */
    removeLayerInfo() {
        if (this._layerInfoSelector) {
            this._layerInfoSelector.remove();
        }
    };


    onEvent(type, options) {
        if (type === Actions.mapHandleMapNameLabel) {
            this._mapNameVisibility = options.visibility;
            this._nameLabelSelector.remove();
        }
    }
}

export default MapWindowTools;