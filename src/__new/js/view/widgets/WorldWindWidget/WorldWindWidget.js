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
	 * Rebuild with current configuration
	 * @param data {Object}
	 * @param options {Object}
	 * @param options.config {Object} current configuration
	 * @param options.changes {Object} changes in configuration
	 */
	WorldWindWidget.prototype.rebuild = function(data, options){
		this._options = jQuery.extend(true, {}, options);
		var isIn3dMode = $("body").hasClass("mode-3d");

		if (isIn3dMode){
			if (this._options.changes.location){
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
		}
	};

	/**
	 * Rebuild map
	 */
	WorldWindWidget.prototype.rebuildWorldWindWindow = function(){
		this._worldWind.rebuild(this._options.config, this._widgetSelector);
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
			worldWind: this._worldWind
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
	 * Show/hide components
	 * @param action {string} css display value
	 */
	WorldWindWidget.prototype.toggleComponents = function(action){

		if (!Config.toggles.useTopToolbar) {
			var sidebarTools = $("#sidebar-tools");
			if (action == "none") {
				sidebarTools.addClass("hidden-complete");
				sidebarTools.css("display", "none");
			} else {
				sidebarTools.removeClass("hidden-complete");
				sidebarTools.css("display", "block");
			}
		}

		//$(".x-css-shadow").css("display", "none");

		$(".x-window:not(.thematic-maps-settings, .x-window-ghost, #window-areatree, #window-colourSelection), #tools-container, #widget-container .placeholder:not(#placeholder-" + this._widgetId + ")")
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
			self._widgetSelector.removeClass("open");
		});
	};

	return WorldWindWidget;
});