define(['../../../../error/ArgumentError',
	'../../../../error/NotFoundError',
	'../../../../util/Logger',

	'./legend/Legend',

	'jquery'
], function(ArgumentError,
			NotFoundError,
			Logger,

			Legend,

			$
){
	/**
	 * Class representing layer tools
	 * @param options {Object}
	 * @param options.id {string} id of the element
	 * @param options.target {JQuery} selector of target element
	 * @constructor
	 */
	var LayerTools = function(options){
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Legend", "constructor", "missingId"));
		}
		if (!options.target || options.target.length == 0){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Legend", "constructor", "missingTarget"));
		}

		this._target = options.target;
		this._id = options.id;

		this.build();
	};

	/**
	 * Build tools container
	 */
	LayerTools.prototype.build = function(){
		this._target.append('<div id="' + this._id + '-layer-tools" class="layer-tools"></div>');
		this._toolsContainer = $('#' + this._id + '-layer-tools');
	};

	/**
	 * Return tools container
	 * @returns {*|jQuery|HTMLElement}
	 */
	LayerTools.prototype.getContainer = function(){
		return this._toolsContainer;
	};

	/**
	 * Build legend for layer
	 * @param layer {WorldWind.Layer}
	 * @returns {Legend}
	 */
	LayerTools.prototype.addLegend = function(layer){
		return new Legend({
			active: false,
			layer: layer,
			target: this._toolsContainer
		});
	};

	return LayerTools;
});