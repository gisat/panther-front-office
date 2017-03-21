define(['../../../../error/ArgumentError',
	'../../../../error/NotFoundError',
	'../../../../util/Logger',

	'jquery',
	'string',
	'text!./LayerToolFloater.html',
	'css!./LayerToolFloater'
], function(ArgumentError,
			NotFoundError,
			Logger,

			$,
			S,
			LayerToolFloater
){
	/**
	 * Class representing floater of a layer tool
	 * @param options {Object}
	 * @param options.id {string} id of the floater
	 * @param options.class {string} optional class of the floater
	 * @param options.name {string} name of the tool floater
	 * @param options.target {JQuery} selector of a target element
	 * @param options.layer {WorldWind.Layer}
	 * @param options.active {boolean} true if the icon should be active
	 * @constructor
	 */
	var LayerToolsFloater = function(options){
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "LayerToolsFloater", "constructor", "missingId"));
		}
		if (!options.target || options.target.length == 0){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "LayerToolsFloater", "constructor", "missingTarget"));
		}

		this._target = options.target;
		this._id = options.id;
		this._name = options.name || "Tool window";
		this._class = options.class || "";
		this._active = options.active || false;

		this.build();
	};

	/**
	 * Build the icon
	 */
	LayerToolsFloater.prototype.build = function(){
		this._class += " layer-tool-floater";
		if (this._active){
			this._class += " open"
		}

		var html = S(LayerToolFloater).template({
			id: this._id,
			cls: this._class,
			name: this._name
		}).toString();

		this._target.append(html);

		this._floaterSelector = $("#" + this._id);
		this._floaterBodySelector = $("#" + this._id + " .layer-tool-floater-body");

		this.addCloseListener();
		this.addDragging();
	};

	/**
	 * @returns {*|jQuery|HTMLElement}
	 */
	LayerToolsFloater.prototype.getElement = function(){
		return this._floaterSelector;
	};

	/**
	 * @returns {*|jQuery|HTMLElement}
	 */
	LayerToolsFloater.prototype.getBody = function(){
		return this._floaterBodySelector;
	};

	/**
	 * Add content to the floater body
	 * @param content {string} HTML
	 */
	LayerToolsFloater.prototype.addContent = function(content){
		this._floaterBodySelector.html('').append(content);
	};

	/**
	 * Close the window
	 */
	LayerToolsFloater.prototype.addCloseListener = function(){
		var self = this;
		$('#' + this._id + ' .window-close').off("click").on("click", self.close.bind(self));
	};

	/**
	 * Enable dragging of settings window
	 */
	LayerToolsFloater.prototype.addDragging = function(){
		$("#" + this._id).draggable({
			containment: "body",
			handle: ".layer-tool-floater-header",
			drag: function (ev, ui) {
				var element = $(this);
				element.css({
					bottom: "auto"
				});
			},
			stop: function (ev, ui) {
				var element = $(this);
				var floaters = $(".layer-tool-floater");
				floaters.css({
					zIndex: "20000"
				});
				element.css({
					zIndex: "20001"
				});
			}
		});
	};

	/**
	 * Close window
	 */
	LayerToolsFloater.prototype.close = function(){
		$('#' + this._id).removeClass("open");
	};

	return LayerToolsFloater;
});