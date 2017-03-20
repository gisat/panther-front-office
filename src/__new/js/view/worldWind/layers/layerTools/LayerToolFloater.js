define(['../../../../error/ArgumentError',
	'../../../../error/NotFoundError',
	'../../../../util/Logger',

	'jquery',
	'css!./LayerToolFloater'
], function(ArgumentError,
			NotFoundError,
			Logger,

			$
){
	/**
	 * Class representing floater of a layer tool
	 * @param options {Object}
	 * @param options.id {string} id of the floater
	 * @param options.class {string} optional class of the floater
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
		this._target.append('<div class="' + this._class + '" id="' + this._id + '"></div>');
		this._floaterSelector = $("#" + this._id);
	};

	/**
	 * Add content to the floater body
	 * @param content {string} HTML
	 */
	LayerToolsFloater.prototype.addContent = function(content){
		this._floaterSelector.append(content);
	};

	return LayerToolsFloater;
});