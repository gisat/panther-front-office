define(['../../../../../error/ArgumentError',
	'../../../../../error/NotFoundError',
	'../../../../../util/Logger',

	'../LayerTool',
	'../../../../../util/stringUtils',

	'jquery',
	'worldwind',
	'css!./Legend'
], function(ArgumentError,
			NotFoundError,
			Logger,

			LayerTool,
			stringUtils,

			$
){
	/**
	 * Class representing layer legend
	 * @param options {Object}
	 * @param options.active {boolean} true, if legend window is open
	 * @param options.name {string} name of the window
	 * @param options.layer {WorldWind.Layer}
	 * @param options.target {JQuery} selector of a target element
	 * @augments LayerTool
	 * @constructor
	 */
	var Legend = function(options){
		LayerTool.apply(this, arguments);

		if (!options.layer){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Legend", "constructor", "missingLayer"));
		}
		if (!options.target || options.target.length == 0){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Legend", "constructor", "missingTarget"));
		}

		this._active = options.active || false;
		this._name = options.name || "layer";
		this._layer = options.layer;
		this._target = options.target;
		this._id = this._target.attr("id") + "-legend";

		this.build();
	};

	Legend.prototype = Object.create(LayerTool.prototype);

	/**
	 * Build a legend
	 */
	Legend.prototype.build = function(){
		this._icon = this.buildIcon("Legend", "legend-icon");
		this._floater = this.buildFloater("Legend", "legend-floater");

		this._iconSelector = this._icon.getElement();
		this._floaterSelector = this._floater.getElement();

		this.addContent();
		this.addEventsListener();
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

	return Legend;
});