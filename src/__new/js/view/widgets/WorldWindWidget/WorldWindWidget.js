define([
	'../../../actions/Actions',
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../../../stores/internal/MapStore',
	'../../../stores/Stores',
	'../Widget',
	'../../worldWind/WorldWindMap',
	'./WorldWindWidgetPanels',

	'jquery',
	'string',
	'text!./WorldWindWidget.html',
	'css!./WorldWindWidget'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,

			MapStore,
			Stores,
			Widget,
			WorldWindMap,
			WorldWindWidgetPanels,

			$,
			S,
			htmlBody
){
	/**
	 * Class representing widget for 3D map
	 * @param options {Object}
	 * @constructor
	 */
	var WorldWindWidget = function(options){
		Widget.apply(this, arguments);

		if (!options.mapsContainer){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidget", "constructor", "missingMapsContainer"));
		}
		this._mapsContainer = options.mapsContainer;
		this._stateStore = options.stateStore;
		if (options.topToolBar){
			this._topToolBar = options.topToolBar;
		}

		this._currentMap = this.buildWorldWindMap('default-map', this._mapsContainer);
		this._maps = [this._currentMap];

		var self = this;
		$("#add-map").on("click", function(){
			var id = Math.floor(Math.random()*100);
			self._currentMap = self.buildWorldWindMap("map-" + id, self._mapsContainer);
			self._maps.push(self._currentMap);
			self._panels.addLayersToMap(self._currentMap);
			self._options.changes.location = true;
			self.rebuild(self._data, self._options);
		});


		Stores.register('map', new MapStore({
			dispatcher: window.Stores,
			maps: this._maps
		}));

		this.build();
		this.deleteFooter(this._widgetSelector);

		options.dispatcher.addListener(this.onEvent.bind(this));
	};

	WorldWindWidget.prototype = Object.create(Widget.prototype);

	/**
	 * Rebuild with current configuration
	 * @param data {Object}
	 * @param options {Object}
	 * @param options.config {Object} current configuration
	 * @param options.changes {Object} changes in configuration
	 */
	WorldWindWidget.prototype.rebuild = function(data, options){
		this._options = jQuery.extend(true, {}, options);

		// todo only for testing
		this._data = data;

		var isIn3dMode = $("body").hasClass("mode-3d");
		if (isIn3dMode && Object.keys(this._options).length){
			if (this._options.changes && this._options.changes.location){
				this.rebuildWorldWindWindow();
			}
			this.rebuildWidgetBody();
			this._options.changes = {
				scope: false,
				location: false,
				theme: false,
				period: false,
				level: false,
				visualization: false
			};
		} else {
			console.warn("No data detected!");
			this.handleLoading("hide");
		}
	};

	/**
	 * Rebuild maps
	 */
	WorldWindWidget.prototype.rebuildWorldWindWindow = function(){
		var self = this;
		this._maps.forEach(function(map){
			map.rebuild(self._options.config, self._widgetSelector);
		});
	};

	/**
	 * Rebuild content of the widget
	 */
	WorldWindWidget.prototype.rebuildWidgetBody = function(){
		this.toggleWarning("none", null);
		this._panels.rebuild(this._options);
		this.handleLoading("hide");
	};

	/**
	 * Build basic view of the widget
	 */
	WorldWindWidget.prototype.build = function(){
		this.addSettingsIcon();
		this.addSettingsOnClickListener();

		if (!Config.toggles.useNewViewSelector){
			this._widgetBodySelector.append('<div id="3d-switch">' +
				'3D map' +
				'</div>');

			var self = this;
			$("#3d-switch").on("click", self.toggle3DMap.bind(self));
		} else {
			this.addMinimiseButtonListener();
		}

		this._widgetSelector.css({
			height: widgets.layerpanel.height + 40,
			top: widgets.layerpanel.ptrWindow.y,
			left: widgets.layerpanel.ptrWindow.x
		});
		this._panels = this.buildPanels();
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
			target: this._widgetBodySelector,
			currentMap: this._currentMap,
			maps: this._maps
		})
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
			self.rebuild(null, self._options);
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
		self.rebuild(null, self._options);

		if (this._topToolBar){
			this._topToolBar.build();
		}

		var places = this._stateStore.current().objects.places;
		if(places.length === 1 ){
			var locations = places[0].get('bbox').split(',');
			self._maps.forEach(function(map){
				map.goTo(new WorldWind.Position((Number(locations[1]) + Number(locations[3])) / 2, (Number(locations[0]) + Number(locations[2])) / 2, 1000000));
			});
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
		}
	};

	/**
	 * Build a World Wind Map
	 * @param id {string} Id of the map which should distinguish one map from another
	 * @param mapsContainer {MapsContainer} Container where the map will be rendered
	 * @returns {WorldWindMap}
	 */
	WorldWindWidget.prototype.buildWorldWindMap = function(id, mapsContainer){
		return new WorldWindMap({
			dispatcher: window.Stores,
			id: id,
			mapsContainer: mapsContainer
		});
	};

	return WorldWindWidget;
});