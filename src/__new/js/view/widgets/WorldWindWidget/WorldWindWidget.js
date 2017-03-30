define(['../../../error/ArgumentError',
		'../../../error/NotFoundError',
		'../../../util/Logger',

		'../Widget',
		'./WorldWindWidgetPanels',

		'jquery',
		'string',
		'text!./WorldWindWidget.html',
		'css!./WorldWindWidget'
], function(ArgumentError,
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
	 * @constructor
	 */
	var WorldWindWidget = function(options){
		Widget.apply(this, arguments);

		if (!options.worldWind){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindWidget", "constructor", "missingWorldWind"));
		}
		this._worldWind = options.worldWind;

		if (options.topToolBar){
			this._topToolBar = options.topToolBar;
		}

		this.build();
		this.deleteFooter(this._widgetSelector);
	};

	WorldWindWidget.prototype = Object.create(Widget.prototype);

	/**
	 * Build basic view of the widget
	 */
	WorldWindWidget.prototype.build = function(){
		//this.buildToolIconInHeader("Dock");
		//this.buildToolIconInHeader("Undock");
		this.buildBody();
	};

	/**
	 * Build the body of widget
	 */
	WorldWindWidget.prototype.buildBody = function(){
		this.buildFakeHeader();

		this._worldWindContainer = this._worldWind.getContainer();
		this._worldWindMap = this._worldWindContainer.find("#world-wind-map");

		this._panels = this.buildPanels();
	};

	WorldWindWidget.prototype.buildFakeHeader = function(){
		this._widgetHeaderSelector.append('<div class="floater-fake-header">' +
				'<span>Layers</span>' +
				'<div class="floater-fake-header-tool" id="thematic-layers-configuration"><img title="Configure thematic maps" src="../src/images/new/settings.png"/></div>' +
			'</div>');

		this.addSettingsOnClickListener();
	};

	/**
	 * Build particular panels
	 */
	WorldWindWidget.prototype.buildPanels = function(){
		return new WorldWindWidgetPanels({
			id: this._widgetId + "-panels",
			target: this._widgetBodySelector,
			worldWind: this._worldWind
		})
	};

	/**
	 * Rebuild with current configuration
	 * @param data {Object}
	 * @param options {Object}
	 */
	WorldWindWidget.prototype.rebuild = function(data, options){
		this._data = data;
		this._options = options;

		this.toggleWarning("none");
		this._worldWind.rebuild(options.config, this._widgetSelector);
		this._panels.rebuild(options.config, data);

		this.handleLoading("hide");
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
			self.rebuild(self._data, self._options);
		}

		if (this._topToolBar){
			this._topToolBar.build();
		}
	};

	/**
	 * Show/hide components
	 * @param action {string} css display value
	 */
	WorldWindWidget.prototype.toggleComponents = function(action){
		var sidebarTools = $("#sidebar-tools");

		if (action == "none"){
			sidebarTools.addClass("hidden-complete");
			sidebarTools.css("display", "none");
		} else {
			sidebarTools.removeClass("hidden-complete");
			sidebarTools.css("display", "block");
		}

		//$(".x-css-shadow").css("display", "none");

		$(".x-window:not(.thematic-maps-settings, .x-window-ghost), #tools-container, #widget-container .placeholder:not(#placeholder-" + this._widgetId + ")")
			.css("display", action);

	};

	WorldWindWidget.prototype.addSettingsOnClickListener = function(){
		$("#thematic-layers-configuration").on("click", function(){
			Observer.notify("thematicMapsSettings");
		});
	};

	return WorldWindWidget;
});