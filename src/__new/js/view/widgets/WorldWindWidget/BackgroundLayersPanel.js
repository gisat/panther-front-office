define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'./WorldWindWidgetPanel',

	'jquery',
	'string'
], function(ArgumentError,
			NotFoundError,
			Logger,

			WorldWindWidgetPanel,

			$,
			S
){
	/**
	 * Class representing Background Layers Panel of WorldWindWidget
	 * @param options {Object}
	 * @constructor
	 */
	var BackgroundLayersPanel = function(options){
		WorldWindWidgetPanel.apply(this, arguments);
	};

	BackgroundLayersPanel.prototype = Object.create(WorldWindWidgetPanel.prototype);

	BackgroundLayersPanel.prototype.addLayers = function(){
		this.addRadio("aaa", "Test aaa", this._panelBodySelector, true);
		this.addRadio("bbb", "Test bbb", this._panelBodySelector, false);
		this.addRadio("ccc", "Test ccc", this._panelBodySelector, false);
	};

	return BackgroundLayersPanel;
});