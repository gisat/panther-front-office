
import S from 'string';
import _ from 'underscore';

import Actions from '../../../actions/Actions';
import ArgumentError from '../../../error/ArgumentError';
import Logger from '../../../util/Logger';

import Button from '../../components/Button/Button';
import MultiSelect from '../../components/Select/MultiSelect';
import Select from '../../components/Select/Select';

import './PeriodsSelector.css';

let polyglot = window.polyglot;

/**
 * Periods selector component
 * @params options {Object}
 * @params options.containerSelector {Object} JQuery selector of parent element, where will be rendered the PeriodsSelector
 * @params options.dispatcher {Object} Dispatcher, which is used to distribute actions across the application.
 * @params [options.maxSelected] {number} maximal number of selected periods
 * @params options.store {Object}
 * @params options.store.periods {Periods}
 * @params options.store.scopes {Scopes}
 * @params options.store.state {StateStore}
 * @constructor
 */
let $ = window.$;
class PeriodsSelector {
    constructor(options) {
        if (!options.containerSelector){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "PeriodsSelector", "constructor", "missingTarget"));
        }
        if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'PeriodsSelector', 'constructor', 'Stores must be provided'));
        }
        if(!options.store.periods){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'PeriodsSelector', 'constructor', 'Store periods must be provided'));
        }
        if(!options.store.scopes){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'PeriodsSelector', 'constructor', 'Store scopes must be provided'));
        }
        if(!options.store.state){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'PeriodsSelector', 'constructor', 'Store state must be provided'));
        }

        this._containerSelector = options.containerSelector;
        this._dispatcher = options.dispatcher;
        this._maxSelected = options.maxSelected || 16;
        this._defaultPeriod = null;

        this._id = "selector-periods";

        this._periodStore = options.store.periods;
        this._scopeStore = options.store.scopes;
        this._stateStore = options.store.state;

        this._periodStore.addListener(this.onEvent.bind(this));

        this._selectedPeriods = [];
        this._disabledPeriods = [];
    };

    /**
     * Rebuild periods selector if scope or period has been changed. It should redraw the periods selector with all periods
     * asociated with current scope.
     */
    rebuild() {
        let currentState = this._stateStore.current();
        if (currentState.changes.scope || currentState.changes.period) {
            this.updateSelectedPeriods();
            this.updateDisabledPeriods();

            let self = this;
            this._scopeStore.byId(currentState.scope).then(function (datasets) {
                let periods = datasets[0].periods;
                return self._periodStore.filter({id: periods});
            }).then(self.render.bind(self));
        }
    };

    /**
     * Render the selector
     * @param periods {Array} list of periods with metadata
     */
    render(periods) {
        let state = this._stateStore.current();

        if (this._periodsContainerSelector) {
            this._periodsContainerSelector.remove();
        }

        let html = S(`
        <div class="selector" id="{{id}}">
            <span class="selector-label">{{period}}</span>
        </div>
        `).template({
            id: this._id,
            period: polyglot.t('period')
        }).toString();

        this._containerSelector.append(html);
        this._periodsContainerSelector = $("#" + this._id);

        this._basicSelect = this.renderBasicPeriodSelection(periods);

        if (periods.length > 1 && !state.isMapIndependentOfPeriod){
            this._compareButton = this.renderCompareButton();
            this._multiSelect = this.renderMultiplePeriodSelection(periods);
        }

        if(state.scopeFull.removedTools && state.scopeFull.removedTools.indexOf('period') !== -1) {
            $('#'+this._id).hide();
        }
    };

    /**
     * Update a list of selected periods
     */
    updateSelectedPeriods() {
        this._selectedPeriods = this._stateStore.current().periods;
        if (this._selectedPeriods.length === 1) {
            this._defaultPeriod = this._selectedPeriods[0];
        } else {
            this._defaultPeriod = null;
        }
    };

    /**
     * Update a list for diasabled periods for multiselect. Currently only period selected by default should be disabled in MultiSelect or if the number of selected maps equals max allowed number, all other options are disabled
     */
    updateDisabledPeriods() {
        this._disabledPeriods = [];
        let periods = this._stateStore.current().periods;
        if (periods.length < 2) {
            this._disabledPeriods = periods;
        } else if (periods.length === this._maxSelected && this._multiSelect) {
            let adjustedPeriods = this._multiSelect.getAllOptions().map(function (item) {
                if (typeof item === "string") {
                    return Number(item);
                } else if (typeof item === "number") {
                    return item;
                } else {
                    return null;
                }
            });
            this._disabledPeriods = _.union([this._defaultPeriod], _.difference(adjustedPeriods, periods));
        }

        return null;
    };

    /**
     * Render the selector for basic period selection
     * @param periods {Array} list of periods with metadata
     * @returns {Select}
     */
    renderBasicPeriodSelection(periods) {
        let selected = this._selectedPeriods;
        if (this._selectedPeriods.length > 1) {
            selected = [];
        }

        return new Select({
            id: this._id + "-select",
            title: polyglot.t("selectPeriod"),
            options: periods,
            placeholder: "...",
            sorting: {
                type: 'string'
            },
            selectedOptions: selected,
            containerSelector: this._periodsContainerSelector,
            classes: "top-bar-select",
            onChange: this.updatePeriod.bind(this)
        });
    };

    /**
     * Render the selector for multiple period selection
     * @param periods {Array} list of periods with metadata
     * @returns {MultiSelect}
     */
    renderMultiplePeriodSelection(periods) {
        return new MultiSelect({
            id: this._id + "-multiselect",
            title: polyglot.t("selectPeriodsToCompare"),
            options: periods,
            sorting: {
                type: 'string'
            },
            hidePillbox: true,
            selectedOptions: this._selectedPeriods,
            disabledOptions: this._disabledPeriods,
            containerSelector: this._periodsContainerSelector,
            classes: "top-bar-multiselect",
            onChange: this.selectPeriods.bind(this)
        });
    };

    /**
     * Render button for periods comparison
     * @returns {Button}
     */
    renderCompareButton() {
        return new Button({
            id: this._id + "-compare-button",
            text: polyglot.t("compare"),
            title: polyglot.t("comparePeriods"),
            containerSelector: this._periodsContainerSelector,
            classes: "compare-button w5",
            textCentered: true,
            textSmall: true,
            onClick: this.selectAllPeriods.bind(this)
        });
    }

    /**
     * @param type {string} type of event
     */
    onEvent(type) {
        if (type === Actions.periodsRebuild){
            this.rebuild();
        } else if (type === Actions.periodsDefault){
            this.rebuild();
        }
    }

    /**
     * If a change in basic selector of period occured, get selected period and notify Ext DiscreteTimeline.js
     */
    updatePeriod() {
        let selected = this._basicSelect.getSelected()[0];
        let periods = [Number(selected.id)];
        this._dispatcher.notify(Actions.periodsChange, periods);
    };

    /**
     * If a change in multiselect occured, get selected periods and notify Ext DiscreteTimeline.js
     */
    selectPeriods() {
        let self = this;
        setTimeout(function () {
            let selected = self._multiSelect.getSelectedOptions();
            let periods = selected.map(function (item) {
                if (typeof item === "string") {
                    return Number(item);
                } else if (typeof item === "number") {
                    return item;
                } else {
                    return null;
                }
            });
            if (self._defaultPeriod) {
                periods.push(self._defaultPeriod);
            }
            self._dispatcher.notify(Actions.periodsChange, periods);
        }, 50);
    };

    /**
     * Select all periods available in multiselect and notify Ext DiscreteTimeline.js
     */
    selectAllPeriods() {
        if (this._multiSelect) {
            let periods = this.checkMaxNumberOfSelectedPeriods(this._multiSelect.getAllOptions());
            this._dispatcher.notify(Actions.periodsChange, periods);
        }
    };

    /**
     * Check if number of selected periods is equal or less than the max allowed number.
     * @param periods {Array}
     * @returns {Array}
     */
    checkMaxNumberOfSelectedPeriods(periods) {
        let selectedPeriods = [];
        let adjustedPeriods = periods.map(function (item) {
            if (typeof item === "string") {
                return Number(item);
            } else if (typeof item === "number") {
                return item;
            } else {
                return null;
            }
        });

        // go through list of previously selected periods. For each period, check if period is up to be selected again
        this._selectedPeriods.forEach(function (selectedPeriod) {
            let wasSelected = _.indexOf(adjustedPeriods, selectedPeriod);
            if (wasSelected > -1) {
                selectedPeriods.push(selectedPeriod);
            }
        });

        let periodsLeftToLimit = this._maxSelected - selectedPeriods.length;

        adjustedPeriods.forEach(function (period) {
            if (periodsLeftToLimit > 0) {
                let isSelected = _.indexOf(selectedPeriods, period);
                if (isSelected === -1) {
                    selectedPeriods.push(period);
                    periodsLeftToLimit--;
                }
            }
        });

        return selectedPeriods;
    }
}

export default PeriodsSelector;