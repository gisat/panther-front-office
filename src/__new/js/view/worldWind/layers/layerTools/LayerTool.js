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
	 * @constructor
	 */
	var LayerTool = function(options){
	};

	LayerTool.prototype.addEventsListener = function(){
		this.addIconOnClickListener();
		this.addFloaterCloseListener();
	};

	/**
	 * Add tool icon
	 * @params name {string} name of the icon
	 * @params type {string} html class for icon
	 * @returns {LayerToolsIcon}
	 */
	LayerTool.prototype.buildIcon = function(name, type){
		return new LayerToolIcon({
			active: this._active,
			id: this._id + "-icon",
			class: type,
			faClass: "fa-list",
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
			id: this._id + "-floater",
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