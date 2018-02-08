define([
	'../../../actions/Actions',
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../../../stores/Stores',
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

			Stores,
			Widget,
			WorldWindWidgetPanels,

			$,
			S,
			htmlBody
){
	/**
	 * Class representing widget for 3D map
	 * @param options {Object}
	 * @param options.mapsContainer {MapsContainer} Container where should be all maps rendered
	 * @param options.stateStore {StateStore}
	 * @param options.topToolBar {TopToolBar}
	 * @constructor
	 */
	var WorldWindWidget = function(options){
		Widget.apply(this, arguments);

		if (!options.mapsContainer){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidget", "constructor", "missingMapsContainer"));
		}
		if (!options.stateStore){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidget", "constructor", "missingStateStore"));
		}

		this._mapsContainer = options.mapsContainer;
		this._stateStore = options.stateStore;

		if (options.topToolBar){
			this._topToolBar = options.topToolBar;
		}

		this._dispatcher.addListener(this.onEvent.bind(this));

		this.build();

		this._mapsContainer.addMap('default-map');
		this._stateChanges = {};
	};

	WorldWindWidget.prototype = Object.create(Widget.prototype);

	/**
	 * Build basic view of the widget
	 */
	WorldWindWidget.prototype.build = function(){
		this.addSettingsIcon();
		this.addSettingsOnClickListener();

		this._panels = this.buildPanels();

		// config for new/old view
		if (!Config.toggles.useNewViewSelector){
			this._widgetBodySelector.append('<div id="3d-switch">'+polyglot.t('map3d')+'</div>');
			$("#3d-switch").on("click", this.switchMapFramework.bind(this));
		} else {
			this.addMinimiseButtonListener();
		}

		// set position in context of other widgets
		this._widgetSelector.css({
			height: widgets.layerpanel.height + 40,
			top: widgets.layerpanel.ptrWindow.y,
			left: widgets.layerpanel.ptrWindow.x
		});
	};

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
	 * Rebuild widget. Rebuild all maps in container and panels.
	 */
	WorldWindWidget.prototype.rebuild = function(){
		this._mapsContainer.rebuildMaps();
		this._panels.rebuild();
		this.handleLoading("hide");
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
	 * Build panels
	 */
	WorldWindWidget.prototype.buildPanels = function(){
		return new WorldWindWidgetPanels({
			id: this._widgetId + "-panels",
			target: this._widgetBodySelector
		});
	};

	/**
	 * Switch projection from 3D to 2D and vice versa
	 */
	WorldWindWidget.prototype.switchProjection = function(){
		this._mapsContainer.switchProjection();
	};

	/**
	 * Toggle map into 3D mode
	 */
	WorldWindWidget.prototype.switchMapFramework = function(){
		var self = this;
		var body = $("body");

		var state = Stores.retrieve("state");
		state.setChanges({
			scope: true,
			location: true,
			dataview: false
		});

		if (body.hasClass("mode-3d")){
			body.removeClass("mode-3d");
			self._widgetSelector.removeClass("open");
			self.toggleComponents("block");
		} else {
			body.addClass("mode-3d");
			// self._widgetSelector.addClass("open");
			self.toggleComponents("none");
			self.rebuild();
		}
		if (this._topToolBar){
			this._topToolBar.build();
		}
	};

	/**
	 * It shows the 3D Map.
	 * @param [options] {Object} Optional. Settings from dataview
	 */
	WorldWindWidget.prototype.show3DMap = function(options) {
		var self = this;
		var body = $("body");

		body.addClass("mode-3d");
		self.toggleComponents("none");
		self.rebuild();

		if (this._topToolBar){
			this._topToolBar.build();
		}

		// set default position of the map
		var position = this.getPosition(options);
		this._mapsContainer.setAllMapsPosition(position);

		// execute if there are settings from dataview
		if (options){
			this.adjustAppConfiguration(options);
		}
	};

	/**
	 * Use dataview options and adjust configuration
	 * @param options {Object}
	 */
	WorldWindWidget.prototype.adjustAppConfiguration = function(options){
		if (options.worldWindState){
			this._mapsContainer.setAllMapsRange(options.worldWindState.range);
		}
		if (options.widgets){
			this._topToolBar.handleDataview(options.widgets);
		}
	};

	/**
	 * Get  default position in the map according to configuration
	 * @param [options] {Object} Optional. Settings from dataview
	 * @return position {WorldWind.Position}
	 */
	WorldWindWidget.prototype.getPosition = function(options){
		if (options && options.worldWindState){
			console.log('WorldWindWidget#getPosition Position from Dataview: ', options.worldWindState.location);
			return options.worldWindState.location;
		} else {
			var places = this._stateStore.current().objects.places;
			var locations;
			if(places.length === 1 && places[0]){
				locations = places[0].get('bbox').split(',');
				console.log('WorldWindWidget#getPosition Place: ', places[0]);
			} else {
				places = this._stateStore.current().allPlaces.map(function(place) {
					return Ext.StoreMgr.lookup('location').getById(place);
				});
				locations = this.getBboxForMultiplePlaces(places);
				console.log('WorldWindWidget#getPosition Locations: ', locations);
			}

			if(locations.length != 4) {
				console.warn('WorldWindWidget#getPosition Incorrect locations: ', locations);
				return;
			}
			var position = new WorldWind.Position((Number(locations[1]) + Number(locations[3])) / 2, (Number(locations[0]) + Number(locations[2])) / 2, 1000000);

			console.log('WorldWindWidget#getPosition Position: ', position);
			return position;
		}
	};

    /**
	 * It combines bboxes of all places to get an extent, which will show all of them.
     * @param places
     * @returns {*}
     */
	WorldWindWidget.prototype.getBboxForMultiplePlaces = function(places) {
		if(places.length == 0) {
			return [];
		}

		var minLongitude = 180;
		var maxLongitude = -180;
		var minLatitude = 90;
		var maxLatitude = -90;

		var locations;
		places.forEach(function(place){
            console.log('WorldWindWidget#getBboxForMultiplePlaces Place: ', place);
            locations = place.get('bbox').split(',');
			if(locations[0] < minLongitude) {
				minLongitude = locations[0];
			}

			if(locations[1] < minLatitude) {
                minLatitude = locations[1];
			}

			if(locations[2] > maxLongitude) {
				maxLongitude = locations[2];
			}

			if(locations[3] > maxLatitude) {
				maxLatitude = locations[3];
			}
		});

		return [minLongitude, maxLatitude, maxLongitude, minLatitude];
	};

	/**
	 * Show/hide components
	 * @param action {string} css display value
	 */
	WorldWindWidget.prototype.toggleComponents = function(action){

		if (!Config.toggles.useTopToolbar) {
			var sidebarTools = $("#sidebar-tools");
			if (action === "none") {
				sidebarTools.addClass("hidden-complete");
				sidebarTools.css("display", "none");
			} else {
				sidebarTools.removeClass("hidden-complete");
				sidebarTools.css("display", "block");
			}
		}
		$(".x-window:not(.thematic-maps-settings, .x-window-ghost, .metadata-window, .window-savevisualization, .window-savedataview, #loginwindow, #window-managevisualization, #window-areatree, #window-colourSelection, #window-legacyAdvancedFilters), #tools-container, #widget-container .placeholder:not(#placeholder-" + this._widgetId + ")")
			.css("display", action);

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


	WorldWindWidget.prototype.onEvent = function(type, options) {
		if(type === Actions.mapShow3D) {
			this.show3DMap();
		} else if(type === Actions.mapAdd){
			this.addDataToMap(options.map);
		} else if(type === Actions.mapSwitchFramework){
			this.switchMapFramework();
		} else if(type === Actions.mapSwitchProjection){
			this.switchProjection();
		} else if(type === Actions.mapShow3DFromDataview){
			this.show3DMap(options);
		}
	};

	return WorldWindWidget;
});