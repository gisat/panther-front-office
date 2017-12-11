define(['../../../actions/Actions',
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',
	'../../../util/RemoteJQ',
	'../../../util/viewUtils',

	'./DataviewCard/DataviewCard',
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
			viewUtils,

			DataviewCard,
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
	 * @param data {Array}
	 */
	CustomViewsWidget.prototype.redraw = function(data){
		this.handleLoading("hide");
		this._widgetBodySelector.html('<div class="custom-views-content"></div>');
		var self = this;
		data.forEach(function(dataview){
			var data = self.prepareDataForCard(dataview);
			new DataviewCard({
				id: data.id,
				url: data.url,
				name: data.name,
				description: data.description,
				dispatcher: self._dispatcher,
				preview: data.preview,
				target: self._widgetBodySelector.find(".custom-views-content")
			});
		});
		if (data.length === 0){
			this._widgetSelector.find(".widget-minimise").trigger("click");
		}
	};

	/**
	 * @param type {string} type of event
	 */
	CustomViewsWidget.prototype.onEvent = function(type){
		if (type === Actions.userChanged){
			this.handleLoading("show");
			Stores.retrieve('dataview').load().then(this.redraw.bind(this));
		} else if (type === Actions.dataviewShow){
			this._widgetSelector.find(".widget-minimise").trigger("click");
		}
	};

	/**
	 * Prepare data for dataview card
	 * @param d {Object} original data about dataview
	 * @return {Object} prepared data about dataview
	 */
	CustomViewsWidget.prototype.prepareDataForCard = function(d){
		var language = d.data.language || "en";

		var prepared = {
			id: d.id,
			url: window.location.origin + window.location.pathname + "?id=" + d.id + "&needLogin=true&lang=" + language
		};

		if (d.data.name && d.data.name.length > 0){
			prepared.name = d.data.name;
		} else {
			prepared.name = "Dataview " + d.id;
		}

		if (d.data.description && d.data.description.length > 0){
			prepared.description = d.data.description;
		} else {
			prepared.description = "Dataview " + d.id;
		}

		prepared.preview = {
			color: viewUtils.getPseudorandomColor()
		};

		return prepared;
	};

	return CustomViewsWidget;
});