define(['../../../actions/Actions',
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',
	'../../../util/RemoteJQ',

	'../Widget',

	'jquery',
	'css!./MapToolsWidget'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,
			RemoteJQ,

			Widget,

			$){

	var MapToolsWidget = function(options){
		Widget.apply(this, arguments);

		this.build();
		this.deleteFooter(this._widgetSelector);
	};

	MapToolsWidget.prototype = Object.create(Widget.prototype);

	/**
	 * Build basic view of the widget
	 */
	MapToolsWidget.prototype.build = function(){
		this.handleLoading("hide");
	};

	/**
	 * Rebuild widget
	 */
	MapToolsWidget.prototype.rebuild = function(){

	};

	return MapToolsWidget;
});