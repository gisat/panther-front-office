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
	 * Build the body of widget
	 */
	WorldWindWidget.prototype.buildBody = function(){
		this.buildCheckboxInput(this._widgetId + "-3Dmap-switch", "Show 3D map", this._widgetBodySelector);

		this._worldWindContainer = this._worldWind.getContainer();
		this._worldWindMap = this._worldWindContainer.find("#world-wind-map");
		this._3DmapSwitcher = $("#" + this._widgetId + "-3Dmap-switch");

		var html = S(htmlBody).template({
			panelsId: this._widgetId + "-panels"
		}).toString();
		this._widgetBodySelector.append(html);
		this._panelsSelector = $("#" + this._widgetId + "-panels");
	};

	/**
	 * Rebuild with current configuration
	 * @param attributes {Array}
	 * @param options {Object}
	 */
	WorldWindWidget.prototype.rebuild = function(attributes, options){
		if (attributes.length != 0){
			this.toggleWarning("none");
			this._worldWind.rebuild(options.config, this._widgetSelector);
			if (this._3DmapSwitcher.hasClass("checked")){
				this.toggleComponents("none");
			}
		} else {
			this.toggleWarning("block", [1,2,3,4]);
		}
	};

	/**
	 * Add listeners
	 */
	WorldWindWidget.prototype.addEventListeners = function(){
		this.addMapSwitchListener();
		this.addDockingListener();
		this.addPanelsListener();
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
	 * Toggle panels
	 */
	WorldWindWidget.prototype.addPanelsListener = function(){
		this._panelsSelector.find(".panel-header").click(function() {
			$(this).next().toggle('slow');
			return false;
		});
	};

	/**
	 * Show/hide components
	 * @param action {string} css display value
	 */
	WorldWindWidget.prototype.toggleComponents = function(action){
		var sidebarTools = $("#sidebar-tools");

		$(".x-closable, #sidebar-reports, #tools-container, #widget-container .placeholder:not(#placeholder-" + this._widgetId + ")")
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
			sidebarTools.css({left: -1000});
		} else {
			sidebarTools.css({left: 0});
		}
	};

	return WorldWindWidget;
});