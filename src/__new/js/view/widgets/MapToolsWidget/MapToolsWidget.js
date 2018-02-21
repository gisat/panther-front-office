define(['../../../actions/Actions',
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',
	'../../../util/RemoteJQ',

	'../../components/Button/Button',
	'../../tools/FeatureInfoTool/LayerInfoTool',
	'./MapToolTrigger',
	'../Widget',
	'../../tools/ZoomSelected',

	'jquery',
	'css!./MapToolsWidget'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,
			RemoteJQ,

			Button,
			LayerInfoTool,
			MapToolTrigger,
			Widget,
			ZoomSelected,

			$){

	/**
	 * Class representing a widget of map tools for World Wind
	 * @param options {Object}
	 * @param options.dispatcher {Object} Object for handling events in the application.
	 * @param options.featureInfo {FeatureInfoTool}
	 * @constructor
	 */
	var MapToolsWidget = function(options){
		Widget.apply(this, arguments);

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
			'<div class="map-tools-container map-tools-triggers-container">' +
				'<h4>' + polyglot.t("featureInfo") + '</h4>' +
			'</div>' +
			'<div class="map-tools-container map-tools-buttons-container">' +
				'<h4>' + polyglot.t("tools") + '</h4>' +
			'</div>');
		this._triggersContainerSelector = this._widgetBodySelector.find(".map-tools-triggers-container");
		this._buttonsContainerSelector = this._widgetBodySelector.find(".map-tools-buttons-container");

		// Area info functionality
		if (this._featureInfo){
			this._triggers.push(this.buildFeatureInfoTrigger());
		}

		// Layer info functionality
		this._layerInfo = this.buildLayerInfo();
		this._triggers.push(this.buildLayerInfoTrigger());

		// Zoom selected functionality
		this._zoomSelected = new ZoomSelected({dispatcher: this._dispatcher});
		this._buttons.push(this.buildZoomSelectedButton());

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
	 * Build tool for info about layers
	 * @returns {LayerInfoTool}
	 */
	MapToolsWidget.prototype.buildLayerInfo = function(){
		return new LayerInfoTool({
			id: 'layer-info',
			dispatcher: this._dispatcher
		})
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
			target: this._triggersContainerSelector,
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
			iconPath: '__new/icons/layers-info.svg',
			dispatcher: this._dispatcher,
			target: this._triggersContainerSelector,
			onDeactivate: this._layerInfo.deactivate.bind(this._layerInfo),
			onActivate: this._layerInfo.activate.bind(this._layerInfo)
		});
	};

	/**
	 * Build button for zooming to selected areas
	 * @returns {Button}
	 */
	MapToolsWidget.prototype.buildZoomSelectedButton = function(){
		return new Button({
			id: "zoom-selected-button",
			containerSelector: this._buttonsContainerSelector,
			title: polyglot.t('zoomSelected'),
			text: polyglot.t('zoomSelected'),
			textCentered: true,
			textSmall: true,
			classes: "w10",
			icon: {
				type: "fa",
				class: "search-plus"
			},
			onClick: this._zoomSelected.zoom.bind(this._zoomSelected)
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
		}
	};

	return MapToolsWidget;
});