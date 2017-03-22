define(['../../../../error/ArgumentError',
	'../../../../error/NotFoundError',
	'../../../../util/Logger',

	'./legend/Legend',
	'./opacity/Opacity',

	'jquery',
	'css!./LayerTools'
], function(ArgumentError,
			NotFoundError,
			Logger,

			Legend,
			Opacity,

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
		$(this._target).append('<div id="layer-tool-box-' + this._id +'" class="layer-tools"></div>');
		this._toolsContainer = $('#layer-tool-box-' + this._id);
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
	 * @param worldWind {WorldWindMap}
	 * @param layerMetadata {Object}
	 * @returns {Legend}
	 */
	LayerTools.prototype.addLegend = function(layerMetadata, worldWind){
		return new Legend({
			active: false,
			name: "layer",
			layerMetadata: layerMetadata,
			target: this._toolsContainer,
			worldWind: worldWind
		});
	};

	/**
	 * Build opacity tool for layer
	 * @param worldWind {WorldWindMap}
	 * @param layerMetadata {Object}
	 * @returns {Opacity}
	 */
	LayerTools.prototype.addOpacity = function(layerMetadata, worldWind){
		return new Opacity({
			active: false,
			name: "layer",
			layerMetadata: layerMetadata,
			worldWind: worldWind,
			target: this._toolsContainer
		});
	};

	return LayerTools;
});