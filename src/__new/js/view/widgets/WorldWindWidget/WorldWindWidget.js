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

		this.build();
		this.deleteFooter(this._widgetSelector);
	};

	WorldWindWidget.prototype = Object.create(Widget.prototype);

	/**
	 * Build basic view of the widget
	 */
	WorldWindWidget.prototype.build = function(){
		this.buildToolIconInHeader("Dock");
		this.buildToolIconInHeader("Undock");
		this.buildBody();
		this.addEventsListeners();
	};

	/**
	 * Build the body of widget
	 */
	WorldWindWidget.prototype.buildBody = function(){
		this.buildCheckboxInput(this._widgetId + "-3Dmap-switch", "Show 3D map", this._widgetBodySelector);

		this._worldWindContainer = this._worldWind.getContainer();
		this._worldWindMap = this._worldWindContainer.find("#world-wind-map");
		this._3DmapSwitcher = $("#" + this._widgetId + "-3Dmap-switch");

		this._panels = this.buildPanels();
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

		if (data.attributes.length != 0){
			this.toggleWarning("none");
			this._worldWind.rebuild(options.config, this._widgetSelector);
			this._panels.rebuild(options.config, data);
			if (this._3DmapSwitcher.hasClass("checked")){
				this.toggleComponents("none");
			}
		} else {
			this.toggleWarning("block", [1,2,3,4]);
		}
		this.handleLoading("hide");
	};

	/**
	 * Add listeners
	 */
	WorldWindWidget.prototype.addEventsListeners = function(){
		this.addMapSwitchListener();
		this.addDockingListener();
	};

	/**
	 * Add listener for docking
	 */
	WorldWindWidget.prototype.addDockingListener = function(){
		var self = this;
		this._widgetSelector.find(".widget-dock").on("click", function(){
			self.dockFloater(self._widgetSelector, self._worldWindContainer);
			self._worldWindMap.addClass("docked");
		});
		this._widgetSelector.find(".widget-undock, .widget-minimise").on("click", function(){
			self.undockFloater(self._widgetSelector, self._target);
			self._worldWindMap.removeClass("docked");
		});
		$("#placeholder-world-wind-widget").on("click", function(){
			self.undockFloater(self._widgetSelector, self._target);
			self._worldWindMap.removeClass("docked");
		});
	};

	/**
	 * Add listener to a "Show 3D map" checkbox
	 */
	WorldWindWidget.prototype.addMapSwitchListener = function(){
		var self = this;
		this._3DmapSwitcher.on("click", function(){
			var checkbox = $(this);
			setTimeout(function(){
				if (checkbox.hasClass("checked")){
					self._worldWindContainer.css("display", "block");
					self._widgetSelector.addClass("dockable");
					self.toggleComponents("none");

					// it fixes the bug with disappearing of globe
					self.rebuild(self._data, self._options);
				} else {
					self._worldWindContainer.css("display", "none");
					self._widgetSelector.removeClass("dockable");
					self.undockFloater(self._widgetSelector, self._target);
					self._worldWindMap.removeClass("docked");
					self.toggleComponents("block");
				}
			}, 50);
		});
	};

	/**
	 * Show/hide components
	 * @param action {string} css display value
	 */
	WorldWindWidget.prototype.toggleComponents = function(action){
		var sidebarTools = $("#sidebar-tools");

		$(".x-closable, #tools-container, #widget-container .placeholder:not(#placeholder-" + this._widgetId + ")")
			.css("display", action);
		$(".x-css-shadow").css("display", "none");

		var self = this;
		$(".floater").each(function(index, floaterr){
			var floater = $(floaterr);
			if (floater.hasClass("open") && floater.attr("id") != "floater-" + self._widgetId){
				floater.css("display", action);
			}
		});

		if (action == "none"){
			sidebarTools.addClass("hidden-complete");
		} else {
			sidebarTools.removeClass("hidden-complete");
		}

		$(".settings-window").css("display", "none");
		$(".tool-window").removeClass("open");
		$(".layer-tool-icon").removeClass("open");
	};

	return WorldWindWidget;
});