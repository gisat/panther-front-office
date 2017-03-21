define(['../../../../error/ArgumentError',
	'../../../../error/NotFoundError',
	'../../../../util/Logger',

	'./LayerToolFloater',
	'./LayerToolIcon',

	'jquery'
], function(ArgumentError,
			NotFoundError,
			Logger,

			LayerToolFloater,
			LayerToolIcon,

			$
){
	/**
	 * Basic class for layer tool
	 * @param options {Object}
	 * @param options.active {boolean} true, if legend window is open
	 * @param options.name {string} name of the window
	 * @param options.layer {WorldWind.Layer}
	 * @param options.target {JQuery} selector of a target element
	 * @constructor
	 */
	var LayerTool = function(options){
		if (!options.layer){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "LayerTool", "constructor", "missingLayer"));
		}
		if (!options.target || options.target.length == 0){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "LayerTool", "constructor", "missingTarget"));
		}

		this._active = options.active || false;
		this._name = options.name || "layer";
		this._layer = options.layer;
		this._target = options.target;
		this._id = this._target.attr("id");
		this._wwd = options.wwd;

		this.build();
	};

	LayerTool.prototype.addEventsListener = function(){
		this.addIconOnClickListener();
		this.addFloaterCloseListener();
	};

	/**
	 * Add tool icon
	 * @params name {string} name of the icon
	 * @params type {string} html class for icon
	 * @params faType {string} html class for Font Awesome icon
	 * @returns {LayerToolsIcon}
	 */
	LayerTool.prototype.buildIcon = function(name, type, faType){
		return new LayerToolIcon({
			active: this._active,
			id: this._id + "-" + type,
			class: type,
			faClass: faType,
			target: this._target,
			title: name
		});
	};

	/**
	 * Add tool floater
	 * @params name {string} name of the floater
	 * @params type {string} html class for floater
	 * @returns {LayerToolsFloater}
	 */
	LayerTool.prototype.buildFloater = function(name, type){
		return new LayerToolFloater({
			active: this._active,
			id: this._id + "-" + name,
			class: type,
			name: name + " - " + this._name,
			target: $("#main")
		});
	};

	/**
	 * Show/hide legend on icon click
	 */
	LayerTool.prototype.addIconOnClickListener = function(){
		var self = this;
		this._iconSelector.on("click", function(){
			var icon = $(this);
			if (icon.hasClass("open")){
				icon.removeClass("open");
				self._floaterSelector.removeClass("open");
			} else {
				icon.addClass("open");
				self._floaterSelector.addClass("open");
			}
		});
	};

	/**
	 * Handle icon state on floater close
	 */
	LayerTool.prototype.addFloaterCloseListener = function(){
		var self = this;
		this._floaterSelector.find(".window-close").on("click", function(){
			setTimeout(function(){
				var floater = self._floaterSelector;
				if (floater.hasClass("open")){
					self._iconSelector.addClass("open");
				} else {
					self._iconSelector.removeClass("open");
				}
			},50);
		});
	};

	return LayerTool;
});