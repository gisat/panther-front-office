define(['../../../../../error/ArgumentError',
	'../../../../../error/NotFoundError',
	'../../../../../util/Logger',

	'../LayerTool',
	'../../../../widgets/inputs/sliderbox/SliderBox',

	'jquery',
	'worldwind',
	'css!./Opacity'
], function(ArgumentError,
			NotFoundError,
			Logger,

			LayerTool,
			SliderBox,

			$
){
	/**
	 * Class representing layer opacity control
	 * TODO join this class with Opacity.js
	 * @param options {Object}
	 * @param options.class {string}
	 * @param options.target {Object} JQuery selector of target element
	 * @param options.layers {Array} List of layers associated with this legend
	 * @param options.maps {Array} List of all active maps
	 * @augments LayerTool
	 * @constructor
	 */
	var LayerOpacity = function(options){
		LayerTool.apply(this, arguments);

		this._class = options.class;
		this._target = options.target;
		this._layers = options.layers;
		this._maps = options.maps;

		// TODO will there be the same legend for each period?
		this._defaultLayer = this._layers[0];
		this._name = this._defaultLayer.name;
		this._id = this._defaultLayer.id;
		this._opacityValue = 70;
		this.build();
	};

	LayerOpacity.prototype = Object.create(LayerTool.prototype);

	/**
	 * Build an opacity control - icon and floater. Attach listeners.
	 */
	LayerOpacity.prototype.build = function(){
		this._icon = this.buildIcon("Opacity", "opacity-icon", "opacity");
		this._floater = this.buildFloater("Opacity", "opacity-floater");

		this._iconSelector = this._icon.getElement();
		this._floaterSelector = this._floater.getElement();
		this._floaterBodySelector = this._floater.getBody();

		this.addContent();
		this.addEventsListener();
		this.onSlideListener();
	};

	/**
	 * Add content to floater tool body
	 */
	LayerOpacity.prototype.addContent = function(){
		this._floaterBodySelector.html('');
		this._slider = this.buildSlider();
	};

	/**
	 * Build slider
	 * @returns {SliderBox}
	 */
	LayerOpacity.prototype.buildSlider = function(){
		return new SliderBox({
			id: this._id + "-slider",
			name: "Opacity",
			target: this._floaterBodySelector,
			isRange: false,
			range: [0,100],
			values: [this._opacityValue]
		});
	};

	/**
	 * Change opacity of all associated layers on slide
	 */
	LayerOpacity.prototype.onSlideListener = function(){
		var sliderId = this._slider.getSliderId();
		var self = this;

		this._floaterBodySelector.on("slide", "#" + sliderId, function(e, ui){
			self._maps.forEach(function(map){
				self._layers.forEach(function(layer){
					var worldWindLayer = map.layers.getLayerById(layer.id);
					if (worldWindLayer){
						worldWindLayer.opacity = ui.value/100;
					}
				});
				map.redraw();
			});
		});

		this._floaterBodySelector.on("slidechange", "#" + sliderId, function(e, ui){
			self._maps.forEach(function(map){
				self._layers.forEach(function(layer){
					var worldWindLayer = map.layers.getLayerById(layer.id);
					if (worldWindLayer){
						worldWindLayer.opacity = ui.value/100;
					}
				});
				map.redraw();
			});
		});
	};

	LayerOpacity.prototype.redrawLayers = function(layers){

	};

	return LayerOpacity;
});