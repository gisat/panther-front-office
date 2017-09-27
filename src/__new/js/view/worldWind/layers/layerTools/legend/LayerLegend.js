define(['../../../../../error/ArgumentError',
	'../../../../../error/NotFoundError',
	'../../../../../util/Logger',

	'../LayerTool',
	'../../../../../util/stringUtils',

	'jquery',
	'worldwind'
], function(ArgumentError,
			NotFoundError,
			Logger,

			LayerTool,
			stringUtils,

			$
){
	/**
	 * Class representing layer legend
	 * TODO join this class with Legend.js
	 * @param options {Object}
	 * @param options.id {string} Id of the tool
	 * @param options.name {string} Name of the tool
	 * @param options.class {string}
	 * @param options.target {Object} JQuery selector of target element
	 * @param options.layers {Array} List of layers associated with this legend
	 * @param options.style {Object} Associated style
	 * @augments LayerTool
	 * @constructor
	 */
	var LayerLegend = function(options){
		LayerTool.apply(this, arguments);

		this._class = options.class;
		this._target = options.target;
		this._layers = options.layers;
		this._style = options.style;
		this._name = options.name;
		this._id = options.id;

		// TODO will there be the same legend for each period?
		this._defaultLayer = this._layers[0];

		this.build();
	};

	LayerLegend.prototype = Object.create(LayerTool.prototype);

	/**
	 * Build a legend
	 */
	LayerLegend.prototype.build = function(){
		this._icon = this.buildIcon("Legend", "legend-icon", "legend");
		this._floater = this.buildFloater("Legend", "legend-floater");

		this._iconSelector = this._icon.getElement();
		this._floaterSelector = this._floater.getElement();

		this.addContent();
		this.addEventsListener();
	};

	/**
	 * Add content to a legend floater
	 */
	LayerLegend.prototype.addContent = function(){
		var style = "";
		if (this._style){
			style = this._style.path;
		}

		var params = {
			'LAYER': this._defaultLayer.path,
			'REQUEST': 'GetLegendGraphic',
			'FORMAT': 'image/png',
			'WIDTH': 50,
			'STYLE': style
		};
		if (this._defaultLayer.hasOwnProperty('sldId')){
			params['SLD_ID'] = this._defaultLayer.sldId;
		}

		var imgSrc = Config.url + "api/proxy/wms?" + stringUtils.makeUriComponent(params);
		this._floater.addContent('<img src="' + imgSrc + '">');
	};


	return LayerLegend;
});