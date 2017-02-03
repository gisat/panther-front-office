define(['../../../error/ArgumentError',
		'../../../error/NotFoundError',
		'../../../util/Logger',

		'../Widget',

		'jquery',
		'string',
		'text!./WorldWindWidget.html',
		'css!./WorldWindWidget'
], function(ArgumentError,
			NotFoundError,
			Logger,

			Widget,

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
		this.addEventListeners();
	};

	/**
	 * Build the bodz of widget
	 */
	WorldWindWidget.prototype.buildBody = function(){
		this.buildCheckboxInput(this._widgetId + "-3Dmap-switch", "Show 3D map", this._widgetBodySelector);

		this._worldWindContainer = this._worldWind.getContainer();
		this._3DmapSwitcher = $("#" + this._widgetId + "-3Dmap-switch");
	};

	/**
	 * Rebuild with current configuration
	 * @param attributes {Array}
	 * @param options {Object}
	 */
	WorldWindWidget.prototype.rebuild = function(attributes, options){
		this._worldWind.rebuild(options.config);
	};

	/**
	 * Add listeners
	 */
	WorldWindWidget.prototype.addEventListeners = function(){
		this.addMapSwitchListener();
		this.addDockingListener();
	};

	/**
	 * Add listener for docking
	 */
	WorldWindWidget.prototype.addDockingListener = function(){
		var self = this;
		this._widgetSelector.find(".widget-dock").on("click", function(){
			self._widgetSelector.appendTo(self._worldWindContainer)
				.addClass("docked")
				.css({
					left: 0,
					top: 0
				})
				.draggable("disable");
		});

		this._widgetSelector.find(".widget-undock").on("click", function(){
			self._widgetSelector.appendTo(self._target)
				.removeClass("docked")
				.css({
					left: 100,
					top: 100
				})
				.draggable("enable");
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
					self.toggleComponents("none");
				} else {
					self._worldWindContainer.css("display", "none");
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
		$(".x-closable, #sidebar-tools, #sidebar-reports, #tools-container, #widget-container .placeholder:not(#placeholder-" + this._widgetId + "), .floater:not(#floater-" + this._widgetId + ")")
			.css("display", action);
		$(".x-css-shadow").css("display", "none");
	};

	return WorldWindWidget;
});