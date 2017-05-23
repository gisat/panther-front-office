define(['../../../../error/ArgumentError',
	'../../../../error/NotFoundError',
	'../../../../util/Logger',

	'jquery',
	'css!./LayerToolIcon'
], function(ArgumentError,
			NotFoundError,
			Logger,

			$
){
	/**
	 * Class representing icon of a layer tool
	 * @param options {Object}
	 * @param options.id {string} id of the icon
	 * @param options.class {string} optional class of the icon
	 * @param options.fileName {string} name of the icon file
	 * @param options.target {JQuery} selector of a target element
	 * @param options.active {boolean} true if the icon should be active
	 * @constructor
	 */
	var LayerToolsIcon = function(options){
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "LayerToolsIcon", "constructor", "missingId"));
		}
		if (!options.target || options.target.length == 0){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "LayerToolsIcon", "constructor", "missingTarget"));
		}

		this._target = options.target;
		this._id = options.id;
		this._class = options.class || "";
		this._fileName = options.fileName;
		this._active = options.active || false;
		this._title = options.title || "";

		this.build();
	};

	/**
	 * Build the icon
	 */
	LayerToolsIcon.prototype.build = function(){
		var icon = '<img src="__new/img/' + this._fileName + '.png"/>';
		if (this._class == "legend-icon"){
			icon += '<img class="active" src="__new/img/' + this._fileName + '-active.png"/>';
		}

		this._class += " layer-tool-icon";
		if (this._active){
			this._class += " open"
		}
		this._target.append('<div title="' + this._title + '" class="' + this._class + '" id="' + this._id + '">' +
				icon +
			'</div>');

		this._iconSelector = $("#" + this._id);
	};

	/**
	 * @returns {*|jQuery|HTMLElement}
	 */
	LayerToolsIcon.prototype.getElement = function(){
		return this._iconSelector;
	};

	return LayerToolsIcon;
});