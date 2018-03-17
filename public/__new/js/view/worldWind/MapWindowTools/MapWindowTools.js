define(['../../../actions/Actions',
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'jquery'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,

			$
){

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
	var MapWindowTools = function(options){
		if(!options.dispatcher){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MapWindowTools', 'constructor', 'Dispatcher  must be provided'));
		}
		if(!options.mapId){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MapWindowTools', 'constructor', 'Map id must be provided'));
		}
		if(!options.store){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MapWindowTools', 'constructor', 'Stores must be provided'));
		}
		if(!options.store.map){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MapWindowTools', 'constructor', 'Stores map must be provided'));
		}
		if(!options.store.periods){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MapWindowTools', 'constructor', 'Stores periods must be provided'));
		}
		if (!options.store.scopes){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MapWindowTools", "constructor", "missingScopesStore"));
		}
		if(!options.store.state){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MapWindowTools', 'constructor', 'Stores state must be provided'));
		}
		if (!options.targetContainer){
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
	MapWindowTools.prototype.addCloseButton = function(){
		var closeButton = this._mapToolsSelector.find(".close-map-button");
		if (closeButton.length === 0){
			var html = '<div title="Remove map" class="close-map-button"><i class="close-map-icon">&#x2715;</i></div>';
			this._mapToolsSelector.prepend(html);
			this._closeButton = this._mapToolsSelector.find(".close-map-button");
			this.addCloseButtonListener();
		}
	};

	/**
	 * Add listener to close button of each map
	 */
	MapWindowTools.prototype.addCloseButtonListener = function(){
		var state = this._stateStore.current();
		var self = this;
		this._closeButton.on("click", function(){
			if (state.isMapIndependentOfPeriod){
				self._dispatcher.notify("map#remove",{id: self._mapId});
			} else {
				var mapPeriod = self._mapStore.getMapById(self._mapId).period;
				var periods = _.reject(self._stateStore.current().periods, function(period) { return period === mapPeriod; });
				self._dispatcher.notify("periods#change", periods);
			}
		});
	};

	/**
	 * Add label with info about a map (aka map title)
	 * @param period {number}
	 */
	MapWindowTools.prototype.addMapLabel = function(period) {
		var state = this._stateStore.current();
		var self = this;
		this._scopesStore.byId(state.scope).then(function(scopes){
			var scope = scopes[0];
			if (!scope.hideMapName){
				if (period && !state.isMapIndependentOfPeriod) {
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
	MapWindowTools.prototype.addMapLabelWithName = function(){
		this._mapToolsSelector.find(".map-name-label").remove();
		var html = '<div class="map-name-label">' + this._name + '</div>';
		this._mapToolsSelector.append(html);
		this._nameLabelSelector = this._targetContainer.find(".map-name-label");
	};

	/**
	 * Add label with info about about period to the map.
	 * Add dataPeriod attribute of the map container (it is used for sorting)
	 */
	MapWindowTools.prototype.addMapLabelWithPeriod = function(period){
		var self = this;
		this._periodsStore.byId(period).then(function(periods){
			if (periods.length === 1){
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
	 * Build tools container
	 */
	MapWindowTools.prototype.build = function(){
		this._targetContainer.append('<div class="map-window-tools"></div>');
		this._mapToolsSelector = this._targetContainer.find('.map-window-tools');
	};

	/**
	 * Remove close button from this map
	 */
	MapWindowTools.prototype.removeCloseButton = function(){
		this._mapToolsSelector.find(".close-map-button").remove();
	};

	MapWindowTools.prototype.onEvent = function(type, options){
		if (type === Actions.mapHandleMapNameLabel){
			this._mapNameVisibility = options.visibility;
			this._nameLabelSelector.remove();
		}
	};

	return MapWindowTools;
});