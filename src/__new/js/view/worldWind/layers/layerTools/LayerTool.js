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
	 * @param options.class {string}
	 * @param options.name {string} name of the window
	 * @param options.layerMetadata {Object}
	 * @param options.target {JQuery} selector of a target element
	 * @constructor
	 */
	var LayerTool = function(options){
		if (!options.target || options.target.length === 0){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "LayerTool", "constructor", "missingTarget"));
		}

		this._active = options.active || false;
		this._name = options.name || "layer";
		this._target = options.target;
		this._class = options.class || "";
		this._maps = options.maps || null;

		this._layerMetadata = options.layerMetadata;

		// todo do it better, now it is just for default map
		var map = _.filter(this._maps, function(map){ return map.id === 'default-map'; })[0];

		if (this._layerMetadata){
			this._layer = map.layers.getLayerById(this._layerMetadata.id);
			this._id = "layer-tool-" + this._layerMetadata.id;
		}
	};

	LayerTool.prototype.addEventsListener = function(){
		this.addIconOnClickListener();
		this.addFloaterCloseListener();
	};

	/**
	 * Add tool icon
	 * @params name {string} name of the icon
	 * @params type {string} html class for icon
	 * @params fileName {string} name of the icon file
	 * @returns {LayerToolsIcon}
	 */
	LayerTool.prototype.buildIcon = function(name, type, fileName){
		return new LayerToolIcon({
			active: this._active,
			id: type + "-" + this._id,
			class: type,
			fileName: fileName,
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
			id: type + "-" + this._id,
			class: this._class + "-floater " + type,
			name: this._name,
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
				$(".floater, .tool-window").removeClass("active");
				self._floaterSelector.addClass("open");
				if ($("#sidebar-reports").hasClass("hidden")){
					self._floaterSelector.css({
						right: "48px"
					})
				}
				self.addContent();
				setTimeout(function(){
					self._floaterSelector.addClass("active");
				}, 50);
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