define(['../../actions/Actions',
	'./ChartDescription/ChartDescription',

	'jquery',
	'underscore'
], function(Actions,
			ChartDescription,

			$,
			_){

	/**
	 * Class representing container for all charts. At the moment, it is used as container for hanling with chart descriptions only.
	 * @param options {Object}
	 * @param options.dispatcher {Object} Object for handling events in the application.
	 * @constructor
	 */
	var ChartContainer = function(options){
		this._dispatcher = options.dispatcher;

		this._chartDescriptions = [];
		this._dispatcher.addListener(this.onEvent.bind(this));
	};

	/**
	 * Create/show/hide chart description
	 * @param options {Object}
	 * @param options.chart {Object} Chart data
	 * @param options.icon {Object} JQuery selector of description icon
	 */
	ChartContainer.prototype.onChartDescriptionToggle = function(options){
		var chartData = options.chart;
		var chart = {
			 id: chartData.cfg.chartId,
			 active: options.icon.hasClass("tool-active"),
		     name: chartData.cfg.title,
		     type: chartData.cfg.type,
		     description: chartData.queryCfg.description	
		};

		var description = _.find(this._chartDescriptions, function(description){return description.id === chart.id});

		if (description && chart.active){
			description.show();
		} else if (description && !chart.active){
			description.hide();
		} else {
			var chartDescription = new ChartDescription(chart, options.icon);
			this._chartDescriptions.push(chartDescription);
		}
	};

	/**
	 * @param type {string} type of an action
	 * @param options {Object} data passed with this action
	 */
	ChartContainer.prototype.onEvent = function (type, options) {
		if (type === Actions.chartToggleDescription){
			this.onChartDescriptionToggle(options);
		}
	};

	return ChartContainer;
});