define([
	'../../../actions/Actions',
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../../../stores/Stores',
	'../Widget',


	'jquery',
	'string',
	// 'text!./WorldWindWidget.html'
	'css!./PeriodsWidget'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,

			Stores,
			Widget,

			$,
			S
){
	/**
	 * Class representing widget for periods
	 * @param options {Object}
	 * @constructor
	 */
	var PeriodsWidget = function(options){
		Widget.apply(this, arguments);
		this._dispatcher = options.dispatcher;
	};

	PeriodsWidget.prototype = Object.create(Widget.prototype);

	PeriodsWidget.prototype.rebuild = function(){
		this.handleLoading("hide");
	};

	return PeriodsWidget;
});