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
	 * @param options.id {string} id of element
	 * @param options.target {JQuery} JQuery selector of target element
	 * @param options.currentMap
	 * @constructor
	 */
	var WorldWindWidgetPanels = function(options){
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidgetPanels", "constructor", "missingId"));
		}
		if (!options.target || options.target.length == 0){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidgetPanels", "constructor", "missingTarget"));
		}
		if (!options.currentMap){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidgetPanels", "constructor", "missingWorldWind"));
		}
		this._currentMap = options.currentMap;

		this._id = options.id;
		this._target = options.target;
		this._maps = options.maps;
		this.build();
	};

	/**
	 * Rebuild panels with current configuration
	 * @param options {Object}
	 * @param options.config {Object} configuration from global object ThemeYearConfParams
	 * @param options.changes {Object} changes in configuration
	 */
	WorldWindWidgetPanels.prototype.rebuild = function(options){
		if (!options){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidgetPanels", "constructor", "missingParameter"));
		}
		// if (options.changes && !options.changes.scope){
		// 	this._auLayersPanel.switchOnLayersFrom2D();
		// 	this._thematicLayersPanel.switchOnLayersFrom2D();
		// }
		// this._infoLayersPanel.rebuild(options);
		// this._wmsLayersPanel.rebuild(options.config);
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

		// this._auLayersPanel = this.buildAuLayersPanel();
		// this._thematicLayersPanel = this.buildThematicLayersPanel();
		// this._infoLayersPanel = this.buildInfoLayersPanel();
		this._backgroundLayersPanel = this.buildBackgroundLayersPanel();
		// this._wmsLayersPanel = this.buildWmsLayersPanel();

		this.addEventsListeners();
	};

	WorldWindWidgetPanels.prototype.addLayersToMap = function(map){
		this._backgroundLayersPanel.addLayersToMap(map);
	};

	/**
	 * Build panel with background layers
	 */
	WorldWindWidgetPanels.prototype.buildBackgroundLayersPanel = function(){
		return new BackgroundLayersPanel({
			id: "background-layers",
			name: "Background Layers",
			target: this._panelsSelector,
			isOpen: true,
			currentMap: this._currentMap,
			maps: this._maps
		});
	};

	/**
	 * Build panel with thematic layers
	 */
	WorldWindWidgetPanels.prototype.buildThematicLayersPanel = function(){
		return new ThematicLayersPanel({
			id: "thematic-layers",
			name: "Thematic Layers",
			target: this._panelsSelector,
			isOpen: true,
			worldWind: this._worldWind
		});
	};

	/**
	 * Build panel with analytical units layers
	 */
	WorldWindWidgetPanels.prototype.buildAuLayersPanel = function(){
		return new AuLayersPanel({
			id: "au-layers",
			name: "Analytical Units Layers",
			target: this._panelsSelector,
			isOpen: true,
			worldWind: this._worldWind
		});
	};

	/**
	 * Build panel with info layers
	 */
	WorldWindWidgetPanels.prototype.buildInfoLayersPanel = function(){
		return new InfoLayersPanel({
			id: "info-layers",
			name: "Info Layers",
			target: this._panelsSelector,
			isOpen: true,
			worldWind: this._worldWind
		});
	};

	/**
	 * Build panel with wms layers
	 */
	WorldWindWidgetPanels.prototype.buildWmsLayersPanel = function(){
		return new WmsLayersPanel({
			id: "wms-layers",
			name: "Custom WMS Layers",
			target: this._panelsSelector,
			isOpen: true,
			worldWind: this._worldWind
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