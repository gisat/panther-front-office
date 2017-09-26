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
	 * @param options.class {string}
	 * @param options.target {Object} JQuery selector of target element
	 * @param options.layers {Array} List of layers associated with this legend
	 * @augments LayerTool
	 * @constructor
	 */
	var LayerLegend = function(options){
		LayerTool.apply(this, arguments);

		this._class = options.class;
		this._target = options.target;
		this._layers = options.layers;

		// TODO will there be the same legend for each period?
		this._defaultLayer = this._layers[0];
		this._name = this._defaultLayer.name;
		this._id = this._defaultLayer.id;
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
		if (this._defaultLayer.styles.length > 0){
			style = this._defaultLayer.styles[0].path;
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