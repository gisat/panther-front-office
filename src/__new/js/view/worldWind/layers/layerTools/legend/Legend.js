define(['../../../../../error/ArgumentError',
	'../../../../../error/NotFoundError',
	'../../../../../util/Logger',

	'../LayerToolFloater',
	'../LayerToolIcon',
	'../../../../../util/stringUtils',

	'jquery',
	'worldwind',
	'css!./Legend'
], function(ArgumentError,
			NotFoundError,
			Logger,

			LayerToolFloater,
			LayerToolIcon,
			stringUtils,

			$
){
	/**
	 * Class representing layer legend
	 * @param options {Object}
	 * @constructor
	 */
	var Legend = function(options){
		if (!options.layer){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Legend", "constructor", "missingLayer"));
		}
		if (!options.target || options.target.length == 0){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Legend", "constructor", "missingTarget"));
		}

		this._active = options.active || false;
		this._layer = options.layer;
		this._target = options.target;
		this._id = this._target.attr("id") + "-legend";

		this.build();
	};

	/**
	 * Build a legend
	 */
	Legend.prototype.build = function(){
		this._icon = this.buildIcon();
		this._floater = this.buildFloater();

		this.addContent();

		//this.addEventsListener();
	};

	/**
	 * Add content to legend floater
	 */
	Legend.prototype.addContent = function(){
		var imgSrc = Config.url + "api/proxy/wms?" + stringUtils.makeUriComponent({
				'LAYER': this._layer.name,
				'REQUEST': 'GetLegendGraphic',
				'FORMAT': 'image/png',
				'WIDTH': 50
			});
		this._floater.addContent('<img src="' + imgSrc + '">');
	};

	/**
	 * Add legend icon
	 * @returns {LayerToolsIcon}
	 */
	Legend.prototype.buildIcon = function(){
		return new LayerToolIcon({
			active: this._active,
			id: this._id + "-icon",
			class: "legend-icon",
			faClass: "fa-list",
			target: this._target,
			title: "Legend"
		});
	};

	/**
	 * Add legend floater
	 * @returns {LayerToolsFloater}
	 */
	Legend.prototype.buildFloater = function(){
		return new LayerToolFloater({
			active: this._active,
			id: this._id + "-floater",
			class: "legend-floater",
			target: $("#main")
		});
	};

	return Legend;
});