define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'./panels/AuLayersPanel',
	'./panels/BackgroundLayersPanel',
	'./panels/InfoLayersPanel',
	'./panels/ThematicLayersPanel',
	'./panels/WmsLayersPanel',

	'jquery',
	'string',
	'text!./WorldWindWidgetPanels.html',
	'css!./WorldWindWidgetPanels'
], function(ArgumentError,
			NotFoundError,
			Logger,

			AuLayersPanel,
			BackgroundLayersPanel,
			InfoLayersPanel,
			ThematicLayersPanel,
			WmsLayersPanel,

			$,
			S,
			htmlBody
){
	/**
	 * @param options {Object}
	 * @param options.dispatcher {Object}
	 * @param options.id {string} id of element
	 * @param options.target {Object} JQuery selector of target element
	 * @param options.currentMap
	 * @param options.store {Object}
	 * @param options.store.state {StateStore}
	 * @param options.store.map {MapStore}
	 * @param options.store.wmsLayers {WmsLayers}
	 * @constructor
	 */
	var WorldWindWidgetPanels = function(options){
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidgetPanels", "constructor", "missingId"));
		}
		if (!options.target || options.target.length === 0){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidgetPanels", "constructor", "missingTarget"));
		}
        if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WorldWindWidgetPanels', 'constructor', 'Stores must be provided'));
        }
        if(!options.store.map){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WorldWindWidgetPanels', 'constructor', 'Store map must be provided'));
        }
        if(!options.store.state){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WorldWindWidgetPanels', 'constructor', 'Store state must be provided'));
        }
        if(!options.store.wmsLayers){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WorldWindWidgetPanels', 'constructor', 'Store wms layers must be provided'));
        }
		if (!options.dispatcher){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WorldWindWidgetPanels', 'constructor', 'Dispatcher must be provided'));
		}

		this._store = options.store;
		this._id = options.id;
		this._target = options.target;
		this._dispatcher = options.dispatcher;
		this.build();
	};

	/**
	 * Rebuild panels with current configuration
	 */
	WorldWindWidgetPanels.prototype.rebuild = function(){
		// var configChanges = this._store.state.current().changes;
		// if (!configChanges.scope){
		// 	this._thematicLayersPanel.switchOnLayersFrom2D();
		// }

		this._auLayersPanel.rebuild("updateOutlines","updateOutlines");
		this._infoLayersPanel.rebuild();
		this._wmsLayersPanel.rebuild();
	};

	/**
	 * Build section of World Wind Widget
	 */
	WorldWindWidgetPanels.prototype.build = function(){
		var html = S(htmlBody).template({
			panelsId: this._id
		}).toString();
		this._target.append(html);
		this._panelsSelector = $("#" + this._id);

		this._auLayersPanel = this.buildAuLayersPanel();
		this._thematicLayersPanel = this.buildThematicLayersPanel();
		this._infoLayersPanel = this.buildInfoLayersPanel();
		this._backgroundLayersPanel = this.buildBackgroundLayersPanel();
		this._wmsLayersPanel = this.buildWmsLayersPanel();

		this.addEventsListeners();
	};

	/**
	 * Add background layers to map
	 * @param map {WorldWindMap}
	 */
	WorldWindWidgetPanels.prototype.addLayersToMap = function(map){
		this._backgroundLayersPanel.addLayersToMap(map);
	};

	/**
	 * Build panel with background layers
	 */
	WorldWindWidgetPanels.prototype.buildBackgroundLayersPanel = function(){
		return new BackgroundLayersPanel({
			id: "background-layers",
			name: polyglot.t("backgroundLayers"),
			target: this._panelsSelector,
			isOpen: true,
			store: {
				map: this._store.map,
				state: this._store.state
			}
		});
	};

	/**
	 * Build panel with thematic layers
	 */
	WorldWindWidgetPanels.prototype.buildThematicLayersPanel = function(){
		return new ThematicLayersPanel({
			id: "thematic-layers",
			name: polyglot.t("thematicLayers"),
			target: this._panelsSelector,
			isOpen: true,
            store: {
                map: this._store.map,
				state: this._store.state
            }
		});
	};

	/**
	 * Build panel with analytical units layers
	 */
	WorldWindWidgetPanels.prototype.buildAuLayersPanel = function(){
		return new AuLayersPanel({
			id: "au-layers",
			name: polyglot.t("analyticalUnitsLayers"),
			target: this._panelsSelector,
			isOpen: true,
            store: {
                map: this._store.map,
				state: this._store.state
            }
		});
	};

	/**
	 * Build panel with info layers
	 */
	WorldWindWidgetPanels.prototype.buildInfoLayersPanel = function(){
		return new InfoLayersPanel({
			id: "info-layers",
			name: polyglot.t("infoLayers"),
			target: this._panelsSelector,
			isOpen: true,
            store: {
                map: this._store.map,
				state: this._store.state
            }
		});
	};

	/**
	 * Build panel with wms layers
	 */
	WorldWindWidgetPanels.prototype.buildWmsLayersPanel = function(){
		return new WmsLayersPanel({
			id: "wms-layers",
			name: polyglot.t("customWmsLayers"),
			target: this._panelsSelector,
			isOpen: true,
            store: {
                map: this._store.map,
				state: this._store.state,
				wmsLayers: this._store.wmsLayers
            },
            dispatcher: this._dispatcher
		});
	};

	/**
	 * Add listeners
	 */
	WorldWindWidgetPanels.prototype.addEventsListeners = function(){
		this.onPanelHeaderClick();
	};

	/**
	 * Open/Close panel on panel header click
	 * @returns {boolean}
	 */
	WorldWindWidgetPanels.prototype.onPanelHeaderClick = function(){
		this._panelsSelector.find(".panel-header").click(function(){
			$(this).toggleClass('open');
			$(this).next().slideToggle();
			return false;
		});

		this._panelsSelector.on("click",".panel-layer-group-header", function(){
			$(this).toggleClass('open');
			$(this).next().slideToggle();
			return false;
		});
	};

	return WorldWindWidgetPanels;
});