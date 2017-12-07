define(['../../../actions/Actions',
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',
	'../../../util/RemoteJQ',

	'../Widget',

	'jquery',
	'css!./CustomViewsWidget'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,
			RemoteJQ,

			Widget,

			$){


	var CustomViewsWidget = function(options){
		Widget.apply(this, arguments);

		this._dispatcher = options.dispatcher;

		this.build();
	};

	CustomViewsWidget.prototype = Object.create(Widget.prototype);

	CustomViewsWidget.prototype.build = function(){
		this.handleLoading("hide");
	};

	CustomViewsWidget.prototype.rebuild = function(){
		debugger;
	};

	return CustomViewsWidget;
});