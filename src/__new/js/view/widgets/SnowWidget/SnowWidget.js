define(['../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../Widget',

	'jquery',
	'string'
	//'text!./WorldWindWidget.html',
	//'css!./WorldWindWidget'
], function(ArgumentError,
			NotFoundError,
			Logger,

			Widget,

			$,
			S
			//htmlBody
){
	/**
	 * Class representing widget for handling with saved configurations of snow portal
	 * @param options {Object}
	 * @constructor
	 */
	var SnowWidget = function(options){
		Widget.apply(this, arguments);
		if (!options.iFrame){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "SnowWidget", "constructor", "missingIFrame"));
		}
		this._iFrame = options.iFrame;

		this.build();
		this.deleteFooter(this._widgetSelector);
	};

	SnowWidget.prototype = Object.create(Widget.prototype);

	/**
	 * Build basic view of the widget
	 */
	SnowWidget.prototype.build = function(){
		this.addMinimiseButtonListener();
	};

	SnowWidget.prototype.rebuild = function(){
		this.handleLoading("hide");
	};

	/**
	 * Add listener to the minimise button
	 */
	SnowWidget.prototype.addMinimiseButtonListener = function(){
		var self = this;
		this._widgetSelector.find(".widget-minimise").on("click", function(){
			var id = self._widgetSelector.attr("id");
			self._widgetSelector.removeClass("open");
			$(".item[data-for=" + id + "]").removeClass("open");
		});
	};

	return SnowWidget;
});