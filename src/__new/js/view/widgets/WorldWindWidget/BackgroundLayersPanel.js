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

	return BackgroundLayersPanel;
});