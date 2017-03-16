define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../../../stores/Stores',
	'./WorldWindWidgetPanel',

	'jquery',
	'string'
], function(ArgumentError,
			NotFoundError,
			Logger,

			Stores,
			WorldWindWidgetPanel,

			$,
			S
){
	/**
	 * Class representing Info Layers Panel of WorldWindWidget
	 * @param options {Object}
	 * @constructor
	 */
	var InfoLayersPanel = function(options){
		WorldWindWidgetPanel.apply(this, arguments);
	};

	InfoLayersPanel.prototype = Object.create(WorldWindWidgetPanel.prototype);

	/**
	 * Add content to panel
	 */
	InfoLayersPanel.prototype.addContent = function(){
		//this.addEventsListeners();
	};

	/**
	 * Rebuild panel with current configuration
	 * @param configuration {Object} configuration from global object ThemeYearConfParams
	 */
	InfoLayersPanel.prototype.rebuild = function(configuration){
		if (!configuration){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "InfoLayersPanel", "constructor", "missingParameter"));
		}
		this.clear();

		this.displayPanel("none");

		//var self = this;
		//Stores.retrieve('wmsLayer').filter(filter).then(function(layers){
		//	if (layers.length > 0){
		//		layers.forEach(function(layer){
		//			self.addLayer(layer);
		//		});
		//	}
		//}).catch(function(err){
		//	throw new Error(err);
		//});
	};


	return InfoLayersPanel;
});