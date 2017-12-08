define(['../../../actions/Actions',
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',
	'../../../util/RemoteJQ',

	'../../../stores/Stores',
	'../Widget',

	'jquery',
	'text!./CustomViewsWidget.html',
	'css!./CustomViewsWidget'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,
			RemoteJQ,

			Stores,
			Widget,

			$,
			CustomViewsHtml){

	/**
	 *
	 * @param options {Object}
	 * @constructor
	 * @augments Widget
	 */
	var CustomViewsWidget = function(options){
		Widget.apply(this, arguments);

		this._dispatcher = options.dispatcher;
		this._dispatcher.addListener(this.onEvent.bind(this));
		this.build();
	};

	CustomViewsWidget.prototype = Object.create(Widget.prototype);

	CustomViewsWidget.prototype.build = function(){
	};

	/**
	 * Get dataviews and redraw widget
	 */
	CustomViewsWidget.prototype.rebuild = function(){
		this.handleLoading("show");
		Stores.retrieve('dataview').all().then(this.redraw.bind(this));
	};

	/**
	 * Redraw widget with dataviews
	 * @param data
	 */
	CustomViewsWidget.prototype.redraw = function(data){
		this.handleLoading("hide");
	};

	/**
	 * @param type {string} type of event
	 */
	CustomViewsWidget.prototype.onEvent = function(type){
		if (type === Actions.userChanged){
			this.handleLoading("show");
			Stores.retrieve('dataview').load().then(this.redraw.bind(this));
		}
	};

	return CustomViewsWidget;
});