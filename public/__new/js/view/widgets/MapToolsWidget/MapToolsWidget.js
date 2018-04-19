define(['../../../actions/Actions',
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',
	'../../../util/RemoteJQ',

	'../../components/Button/Button',
	'../../tools/FeatureInfoTool/LayerInfoTool',
	'../../tools/SelectInMap',
	'./MapToolTrigger',
	'../Widget',
	'../../tools/Zooming',

	'jquery',
	'css!./MapToolsWidget'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,
			RemoteJQ,

			Button,
			LayerInfoTool,
			SelectInMap,
			MapToolTrigger,
			Widget,
			Zooming,

			$){

	/**
	 * Class representing a widget of map tools for World Wind
	 * @param options {Object}
	 * @param options.dispatcher {Object} Object for handling events in the application.
	 * @param options.featureInfo {FeatureInfoTool}
	 * @param options.store {Object}
	 * @param options.store.map {MapStore}
	 * @param options.store.state {StateStore}
	 * @constructor
	 */
	var MapToolsWidget = function(options){
		Widget.apply(this, arguments);

        if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MapToolsWidget', 'constructor', 'Stores must be provided'));
        }
        if(!options.store.map){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MapToolsWidget', 'constructor', 'Store map must be provided'));
        }
        if(!options.store.state){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'MapToolsWidget', 'constructor', 'Store state must be provided'));
        }

		this._store = options.store;

		this._dispatcher = options.dispatcher;
		this._featureInfo = options.featureInfo;

		this._triggers = [];
		this._buttons = [];

		this.build();
		this._dispatcher.addListener(this.onEvent.bind(this));
	};

	MapToolsWidget.prototype = Object.create(Widget.prototype);

	/**
	 * Build basic view of the widget
	 */
	MapToolsWidget.prototype.build = function(){
		this._widgetBodySelector.append('' +
			'<div class="map-tools-container" id="map-tools-selections">' +
				'<h4>' + polyglot.t("selections") + '</h4>' +
				'<div class="map-tools-container-body"></div>' +
			'</div>' +
			'<div class="map-tools-container" id="map-tools-info">' +
				'<h4>' + polyglot.t("featureInfo") + '</h4>' +
			'<div class="map-tools-container-body"></div>' +
			'</div>' +
			'<div class="map-tools-container" id="map-tools-zooming">' +
				'<h4>' + polyglot.t("zoom") + '</h4>' +
				'<div class="map-tools-container-body"></div>' +
			'</div>');
		this._infoContainerSelector = this._widgetBodySelector.find("#map-tools-info").find(".map-tools-container-body");
		this._selectionsContainerSelector = this._widgetBodySelector.find("#map-tools-selections").find(".map-tools-container-body");
		this._zoomingContainerSelector = this._widgetBodySelector.find("#map-tools-zooming").find(".map-tools-container-body");

		// Select areas functionality
		this._selectInMap = this.buildSelectInMap();
		this._triggers.push(this.buildSelectInMapTrigger());
		this._buttons.push(this.buildClearSelectedButton());

		// Area info functionality
		if (this._featureInfo){
			this._triggers.push(this.buildFeatureInfoTrigger());
		}
		// Layer info functionality
		this._layerInfo = this.buildLayerInfo();
		this._triggers.push(this.buildLayerInfoTrigger());

		// Zooming functionality
		this._zooming = new Zooming({
			dispatcher: this._dispatcher,
			store: {
				state: this._store.state
			}
		});
		this._buttons.push(this.buildZoomSelectedButton());
		this._buttons.push(this.buildZoomToExtentButton());

		this.handleLoading("hide");
	};

	/**
	 * Rebuild all tools in widget
	 */
	MapToolsWidget.prototype.rebuild = function(){
		this._triggers.forEach(function(trigger){
			trigger.rebuild();
		});
	};

	/**
	 * @returns {SelectInMap}
	 */
	MapToolsWidget.prototype.buildSelectInMap = function(){
		return new SelectInMap({
			dispatcher: this._dispatcher,
			store: {
				map: this._store.map
			}
		});
	};

	/**
	 * Build tool for info about layers
	 * @returns {LayerInfoTool}
	 */
	MapToolsWidget.prototype.buildLayerInfo = function(){
		return new LayerInfoTool({
			id: 'layer-info',
			dispatcher: this._dispatcher,
			store: {
				map: this._store.map,
				state: this._store.state
			}
		})
	};

	/**
	 * Build select in map tool trigger
	 * @returns {MapToolTrigger}
	 */
	MapToolsWidget.prototype.buildSelectInMapTrigger = function(){
		return new MapToolTrigger({
			id: 'select-in-map-trigger',
			label: polyglot.t("selectInMap"),
			hasFaIcon: true,
			iconClass: 'fa-hand-o-up',
			dispatcher: this._dispatcher,
			target: this._selectionsContainerSelector,
			onDeactivate: this._selectInMap.deactivate.bind(this._selectInMap),
			onActivate: this._selectInMap.activate.bind(this._selectInMap)
		});
	};

	/**
	 * Build feature info tool trigger
	 * @returns {MapToolTrigger}
	 */
	MapToolsWidget.prototype.buildFeatureInfoTrigger = function(){
		return new MapToolTrigger({
			id: 'feature-info-trigger',
			label: polyglot.t("areaInfo"),
			hasSvgIcon: true,
			iconPath: '__new/icons/feature-info.svg',
			dispatcher: this._dispatcher,
			target: this._infoContainerSelector,
			onDeactivate: this._featureInfo.deactivateFor3D.bind(this._featureInfo),
			onActivate: this._featureInfo.activateFor3D.bind(this._featureInfo)
		});
	};

	/**
	 * Build layer info tool trigger
	 * @returns {MapToolTrigger}
	 */
	MapToolsWidget.prototype.buildLayerInfoTrigger = function(){
		return new MapToolTrigger({
			id: 'layer-info-trigger',
			label: polyglot.t("layerInfo"),
			hasSvgIcon: true,
			iconPath: '__new/icons/layers-info-a.svg',
			dispatcher: this._dispatcher,
			target: this._infoContainerSelector,
			onDeactivate: this._layerInfo.deactivate.bind(this._layerInfo),
			onActivate: this._layerInfo.activate.bind(this._layerInfo)
		});
	};

	/**
	 * Build button for selection clearing
	 * @returns {Button}
	 */
	MapToolsWidget.prototype.buildClearSelectedButton = function(){
		return new Button({
			id: "clear-selected-button",
			containerSelector: this._selectionsContainerSelector,
			title: polyglot.t('clearSelection'),
			text: polyglot.t('clearSelection'),
			textCentered: true,
			textSmall: true,
			icon: {
				type: "fa",
				class: "eraser"
			},
			onClick: this._dispatcher.notify.bind(this._dispatcher, 'selection#clearAll')
		});
	};

	/**
	 * Build button for zooming to selected areas
	 * @returns {Button}
	 */
	MapToolsWidget.prototype.buildZoomSelectedButton = function(){
		return new Button({
			id: "zoom-selected-button",
			containerSelector: this._zoomingContainerSelector,
			title: polyglot.t('zoomSelected'),
			text: polyglot.t('zoomSelected'),
			textCentered: true,
			textSmall: true,
			icon: {
				type: "fa",
				class: "search-plus"
			},
			onClick: this._zooming.zoomSelected.bind(this._zooming)
		});
	};

	/**
	 * Build button for zooming to extent
	 * @returns {Button}
	 */
	MapToolsWidget.prototype.buildZoomToExtentButton = function(){
		return new Button({
			id: "zoom-to-extent-button",
			containerSelector: this._zoomingContainerSelector,
			title: polyglot.t('zoomToPlace'),
			text: polyglot.t('zoomToPlace'),
			textCentered: true,
			textSmall: true,
			icon: {
				type: "fa",
				class: "arrows-alt"
			},
			onClick: this._zooming.zoomToExtent.bind(this._zooming)
		});
	};

	/**
	 * @param type {string} type of event
	 * @param options {Object}
	 */
	MapToolsWidget.prototype.onEvent = function(type, options){
		if (type === Actions.widgetChangedState && options.floater){
			var id = options.floater.attr("id");
			if (id === "floater-map-tools-widget"){
				this.rebuild();
			}
		} else if (type === Actions.widgetPinMapTools){
			this._widgetPinSelector.trigger("click");
		}
	};

	return MapToolsWidget;
});