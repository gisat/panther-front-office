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
	 * @param options {Object}
	 * @param options.opacityValue {number} value from 0 to 100
	 * @augments LayerTool
	 * @constructor
	 */
	var Opacity = function(options){
		LayerTool.apply(this, arguments);

		this._opacityValue = 100;
		if (this._layerMetadata.opacity){
			this._opacityValue = this._layerMetadata.opacity;
		}
		this.build();
	};

	Opacity.prototype = Object.create(LayerTool.prototype);

	/**
	 * Build an opactiy control
	 */
	Opacity.prototype.build = function(){
		this._icon = this.buildIcon(polyglot.t("opacity"), "opacity-icon", "opacity");
		this._floater = this.buildFloater(polyglot.t("opacity"), "opacity-floater");

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
	Opacity.prototype.addContent = function(){
		this._floaterBodySelector.html('');
		this._slider = this.buildSlider();
	};

	/**
	 * Build slider
	 * @returns {SliderBox}
	 */
	Opacity.prototype.buildSlider = function(){
		return new SliderBox({
			id: this._id + "-slider",
			name: polyglot.t("opacity"),
			target: this._floaterBodySelector,
			isRange: false,
			range: [0,100],
			values: [this._opacityValue]
		});
	};

	/**
	 * Change opacity of the layer on slide
	 */
	Opacity.prototype.onSlideListener = function(){
		var sliderId = this._slider.getSliderId();
		var self = this;

		this._floaterBodySelector.on("slide", "#" + sliderId, function(e, ui){
			self.setOpacity(ui.value/100);
		});

		this._floaterBodySelector.on("slidechange", "#" + sliderId, function(e, ui){
			// todo find out in which case this is used
			if (self._layer.hasOwnProperty("renderables")){
				self._layer.changeOpacity(ui.value/100);
			}
			self.setOpacity(ui.value/100);
		});
	};

	/**
	 * Set opacity for this layer in all maps
	 * @param opacity
	 */
	Opacity.prototype.setOpacity = function(opacity){
		this._opacityValue = opacity*100;

		var self = this;
		this._maps.forEach(function(map){
			map.layers._layers.forEach(function(layer){
				if (layer.metadata && layer.metadata.id === self._layerMetadata.id){
					layer.opacity = opacity;
				}
			});
			map.redraw();
		});

	};

	return Opacity;
});