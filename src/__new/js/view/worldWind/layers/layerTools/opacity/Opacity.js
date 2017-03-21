define(['../../../../../error/ArgumentError',
	'../../../../../error/NotFoundError',
	'../../../../../util/Logger',

	'../LayerTool',

	'jquery',
	'worldwind',
	'css!./Opacity'
], function(ArgumentError,
			NotFoundError,
			Logger,

			LayerTool,

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

		//this.addContent();
		this.addEventsListener();
	};

	return Opacity;
});