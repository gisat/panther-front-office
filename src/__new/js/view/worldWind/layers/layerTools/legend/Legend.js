define(['../../../../../error/ArgumentError',
	'../../../../../error/NotFoundError',
	'../../../../../util/Logger',

	'../../../../../util/stringUtils',

	'jquery',
	'worldwind'
], function(ArgumentError,
			NotFoundError,
			Logger,

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
		this._id = this._target.attr("id");

		this.build();
	};

	/**
	 * Build a legend
	 */
	Legend.prototype.build = function(){
		this.buildIcon();
		this.buildFloater();
		//this.addEventsListener();
	};

	Legend.prototype.buildIcon = function(){
		var cls = "";
		if (this._active){
			cls = "open"
		}
		this._target.append('<div class="layer-legend-icon ' + cls + '" id="' + this._id + '">A</div>')
	};

	Legend.prototype.buildFloater = function(){
		var cls = "";
		if (this._active){
			cls = "open"
		}
		var imgSrc = Config.url + "api/proxy/wms?" + stringUtils.makeUriComponent({
				'LAYER': this._layer.name,
				'REQUEST': 'GetLegendGraphic',
				'FORMAT': 'image/png',
				'WIDTH': 50
			});
		this._target.append('<div class="layer-tools-floater layer-legend-floater ' + cls + '"><img src="' + imgSrc + '"></div>');
	};

	return Legend;
});