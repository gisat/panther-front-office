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
	 * @param options.dispatcher {Object}
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

		this._dispatcher = options.dispatcher;
		this._mapsContainer = options.mapsContainer;
		this._stateStore = options.stateStore;

		if (options.topToolBar){
			this._topToolBar = options.topToolBar;
		}

		this._dispatcher.addListener(this.onEvent.bind(this));

		this.build();
		this.deleteFooter(this._widgetSelector);

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
			this._widgetBodySelector.append('<div id="3d-switch">3D map</div>');
			$("#3d-switch").on("click", this.toggle3DMap.bind(this));
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
			map.rebuild(this._stateStore.current());
			this._panels.rebuild(this._stateChanges);
		}
	};

	/**
	 * Rebuild widget
	 */
	WorldWindWidget.prototype.rebuild = function(){
		// this.rebuildAddMapIcons();
		var isIn3dMode = $("body").hasClass("mode-3d");
		this._stateChanges = this._stateStore.current().changes;

		if (isIn3dMode){
			this._mapsContainer.rebuildMaps();
			this._panels.rebuild(this._stateChanges);
			this._stateChanges = {
				scope: false,
				location: false,
				theme: false,
				period: false,
				level: false,
				visualization: false
			};
		}
		this.handleLoading("hide");
	};

	/**
	 * Rebuild container with buttons for adding a map with specific year
	 */
	WorldWindWidget.prototype.rebuildAddMapIcons = function(){
		var self = this;
		var container = $("#add-map-buttons");
		container.html("");

		Stores.retrieve("scope").filter({id: this._stateStore.current().scope})
			.then(function(datasets){
				return datasets[0].periods;
			}).then(function(periods){
				periods.forEach(function (period) {
					Stores.retrieve("period").byId(period).then(function(periodData){
						container.append('<button class="add-map" data-id="'+ periodData[0].id +'">Add ' + periodData[0].name + '</button>')
					});
				});
			});
	};

	/**
	 * Add thematic maps configuration icon the header
	 */
	WorldWindWidget.prototype.addSettingsIcon = function(){
		this._widgetSelector.find(".floater-tools-container")
			.append('<div id="thematic-layers-configuration" title="Configure thematic maps" class="floater-tool">' +
				'<img title="Configure thematic maps" src="images/icons/settings.png"/>' +
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
	 * Toggle map into 3D mode
	 */
	WorldWindWidget.prototype.toggle3DMap = function(){
		var self = this;
		var body = $("body");

		if (body.hasClass("mode-3d")){
			body.removeClass("mode-3d");
			self._widgetSelector.removeClass("open");
			self.toggleComponents("block");
		} else {
			body.addClass("mode-3d");
			self._widgetSelector.addClass("open");
			self.toggleComponents("none");
			self.rebuild();
		}

		if (this._topToolBar){
			this._topToolBar.build();
		}
	};

	/**
	 * It shows the 3D Map.
	 */
	WorldWindWidget.prototype.show3DMap = function() {
		var self = this;
		var body = $("body");

		body.addClass("mode-3d");
		self._widgetSelector.addClass("open");
		self.toggleComponents("none");
		self.rebuild();

		if (this._topToolBar){
			this._topToolBar.build();
		}

		var places = this._stateStore.current().objects.places;
		if(places.length === 1 ){
			var locations = places[0].get('bbox').split(',');
			var position = new WorldWind.Position((Number(locations[1]) + Number(locations[3])) / 2, (Number(locations[0]) + Number(locations[2])) / 2, 1000000);
			this._mapsContainer.setAllMapsPosition(position);
		}
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
		}
	};

	return WorldWindWidget;
});