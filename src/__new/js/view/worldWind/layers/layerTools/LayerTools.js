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
	 * @param options.class {string}
	 * @param options.target {JQuery} selector of target element
	 * @constructor
	 */
	var LayerTools = function(options){
		if (!options.id){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "LayerTools", "constructor", "missingId"));
		}
		if (!options.class){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "LayerTools", "constructor", "missingClass"));
		}
		if (!options.target || options.target.length == 0){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "LayerTools", "constructor", "missingTarget"));
		}

		this._target = options.target;
		this._id = options.id;
		this._class = options.class;

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
			class: this._class,
			name: layerMetadata.name,
			layerMetadata: layerMetadata,
			target: this._toolsContainer,
			worldWind: worldWind
		});
	};

	/**
	 * Build opacity tool for layer
	 * @param worldWind {WorldWindMap}
	 * @param layerMetadata {Object}
	 * @param value {number} Opacity value (from 0 to 100)
	 * @returns {Opacity}
	 */
	LayerTools.prototype.addOpacity = function(layerMetadata, worldWind, value){
		return new Opacity({
			active: false,
			class: this._class,
			name: layerMetadata.name,
			opacityValue: value,
			layerMetadata: layerMetadata,
			worldWind: worldWind,
			target: this._toolsContainer
		});
	};

	return LayerTools;
});