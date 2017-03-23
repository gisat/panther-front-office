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
	 * @augments LayerTool
	 * @constructor
	 */
	var Opacity = function(options){
		LayerTool.apply(this, arguments);
	};

	Opacity.prototype = Object.create(LayerTool.prototype);

	/**
	 * Build an opactiy control
	 */
	Opacity.prototype.build = function(){
		this._icon = this.buildIcon("Opacity", "opacity-icon", "fa-clone");
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
			name: "Opacity",
			target: this._floaterBodySelector,
			isRange: false,
			range: [0,100],
			values: [100]
		});
	};

	/**
	 * Change opacity of the layer on slide
	 */
	Opacity.prototype.onSlideListener = function(){
		var sliderId = this._slider.getSliderId();
		var self = this;

		this._floaterBodySelector.on("slide", "#" + sliderId, function(e, ui){
			self._layer.opacity = ui.value/100;
			self._worldWind.redraw();
		});

		this._floaterBodySelector.on("slidechange", "#" + sliderId, function(e, ui){
			self._layer.opacity = ui.value/100;
			if (self._layer.hasOwnProperty("renderables")){
				self._layer.changeOpacity(ui.value/100);
			}
			self._worldWind.redraw();
		});
	};

	return Opacity;
});