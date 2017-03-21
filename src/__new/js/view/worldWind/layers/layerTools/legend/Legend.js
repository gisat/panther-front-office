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
	 * @augments LayerTool
	 * @constructor
	 */
	var Legend = function(options){
		LayerTool.apply(this, arguments);
	};

	Legend.prototype = Object.create(LayerTool.prototype);

	/**
	 * Build a legend
	 */
	Legend.prototype.build = function(){
		this._icon = this.buildIcon("Legend", "legend-icon", "fa-list");
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