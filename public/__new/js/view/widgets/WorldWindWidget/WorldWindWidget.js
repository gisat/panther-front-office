define([
	'../../../actions/Actions',
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../Widget',
	'./WorldWindWidgetPanels',

	'jquery',
	'string',
	'text!./WorldWindWidget.html',
	'css!./WorldWindWidget'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,

			Widget,
			WorldWindWidgetPanels,

			$,
			S,
			htmlBody
){
	/**
	 * Class representing widget for 3D map
	 * @param options {Object}
	 * @param options.dispatcher {Object}
	 * @param options.mapsContainer {MapsContainer} Container where should be all maps rendered
	 * @param options.store {Object}
	 * @param options.store.state {StateStore}
	 * @param options.store.map {MapStore}
	 * @param options.store.wmsLayers {WmsLayers}
	 * @param options.topToolBar {TopToolBar}
	 * @constructor
	 */
	var WorldWindWidget = function(options){
		Widget.apply(this, arguments);

		if (!options.mapsContainer){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidget", "constructor", "missingMapsContainer"));
		}
        if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WorldWindWidget', 'constructor', 'Stores must be provided'));
        }
		if (!options.store.state){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidget", "constructor", "missingStateStore"));
		}
        if (!options.store.map){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidget", "constructor", "missingMapStore"));
        }
        if (!options.store.wmsLayers){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidget", "constructor", "missingWmsLayersStore"));
        }
		if (!options.dispatcher){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'WorldWindWidget', 'constructor', 'Dispatcher must be provided'));
		}


		this._mapsContainer = options.mapsContainer;
		this._stateStore = options.store.state;
		this._mapStore = options.store.map;
		this._store = options.store;
		this._dispatcher = options.dispatcher;

		if (options.topToolBar){
			this._topToolBar = options.topToolBar;
		}

		// Inherited from Widget
		this._dispatcher.addListener(this.onEvent.bind(this));

		this.build();

		// TODO it should be higher
		this._mapsContainer.addMap('default-map');
	};

	WorldWindWidget.prototype = Object.create(Widget.prototype);

	/**
	 * It basicaly adds layers to the map according to selected layers in the widget
	 * @param map {WorldWindMap}
	 */
	WorldWindWidget.prototype.addDataToMap = function(map){
		this._panels.addLayersToMap(map);
		if (map._id !== 'default-map'){
			map.rebuild();
			this._panels.rebuild();
		}
	};


	/**
	 * Add listener to the minimise button
	 */
	WorldWindWidget.prototype.addMinimiseButtonListener = function(){
		var self = this;
		$(this._widgetSelector).find(".widget-minimise").on("click", function(){
			var id = self._widgetSelector.attr("id");
			self._widgetSelector.removeClass("open");
			$(".item[data-for=" + id + "]").removeClass("open");
		});
	};

	/**
	 * Add thematic maps configuration icon the header
	 */
	WorldWindWidget.prototype.addSettingsIcon = function(){
		this._widgetSelector.find(".floater-tools-container")
			.append('<div id="thematic-layers-configuration" title="'+polyglot.t("configureThematicMaps")+'" class="floater-tool">' +
				'<i class="fa fa-sliders"></i>' +
				'</div>');
	};

	/**
	 * Add onclick listener to the settings icon
	 */
	WorldWindWidget.prototype.addSettingsOnClickListener = function(){
		$("#thematic-layers-configuration").on("click", function(){
			Observer.notify("thematicMapsSettings");
		});
	};

	/**
	 * Build basic view of the widget
	 */
	WorldWindWidget.prototype.build = function(){
		this.addSettingsIcon();
		this.addSettingsOnClickListener();

		this._panels = this.buildPanels();

		this.addMinimiseButtonListener();
		// set position in context of other widgets
		this._widgetSelector.css({
			height: widgets.layerpanel.height + 40,
			top: widgets.layerpanel.ptrWindow.y,
			left: widgets.layerpanel.ptrWindow.x
		});
	};

	/**
	 * Build panels
	 */
	WorldWindWidget.prototype.buildPanels = function(){
		return new WorldWindWidgetPanels({
			id: this._widgetId + "-panels",
			target: this._widgetBodySelector,
			store: {
				state: this._stateStore,
				map: this._mapStore,
				wmsLayers: this._store.wmsLayers
			}
		});
	};

	/**
	 * Rebuild widget. Rebuild all maps in container and panels.
	 */
	WorldWindWidget.prototype.rebuild = function(){
		this._mapsContainer.rebuildMaps();
		this._panels.rebuild();
		this.handleLoading("hide");
	};

	/**
	 * @param type {string} type of event
	 * @param options {Object}
	 */
	WorldWindWidget.prototype.onEvent = function(type, options) {
		if(type === Actions.mapAdd){
			this.addDataToMap(options.map);
		}
	};

	return WorldWindWidget;
});