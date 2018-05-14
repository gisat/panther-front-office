import _ from 'underscore';

import Actions from '../../actions/Actions';
import ChartDescription from './ChartDescription/ChartDescription';

/**
 * Class representing container for all charts. At the moment, it is used as container for hanling with chart descriptions only.
 * @param options {Object}
 * @param options.dispatcher {Object} Object for handling events in the application.
 * @constructor
 */
class ChartContainer {
    constructor(options) {
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
    onChartDescriptionToggle(options) {
        let chartData = options.chart;
        let chart = {
            id: chartData.cfg.chartId,
            active: options.icon.hasClass("tool-active"),
            name: chartData.cfg.title,
            type: chartData.cfg.type,
            description: chartData.queryCfg.description
        };

        let description = _.find(this._chartDescriptions, function (description) {
            return description.id === chart.id
        });

        if (description && chart.active) {
            description.show();
        } else if (description && !chart.active) {
            description.hide();
        } else {
            let chartDescription = new ChartDescription(chart, options.icon);
            this._chartDescriptions.push(chartDescription);
        }
    };

    /**
     * @param type {string} type of an action
     * @param options {Object} data passed with this action
     */
    onEvent(type, options) {
        if (type === Actions.chartToggleDescription) {
            this.onChartDescriptionToggle(options);
        }
    };
}

export default ChartContainer;