define([
	'../../../actions/Actions',
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../../components/Button/Button',
	'../../components/Select/MultiSelect',
	'../../components/Select/Select',
	'../../../stores/Stores',

	'jquery',
	'string',
	'text!./PeriodsSelector.html',
	'css!./PeriodsSelector'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,

			Button,
			MultiSelect,
			Select,
			Stores,

			$,
			S,
			PeriodsSelectorHtml
){
	/**
	 * Periods selector component
	 * @params options {Object}
	 * @params options.containerSelector {Object} JQuery selector of parent element, where will be rendered the PeriodsSelector
	 * @params options.dispatcher {Object} Dispatcher, which is used to distribute actions across the application.
	 * @constructor
	 */
	var PeriodsSelector = function(options){
		if (!options.containerSelector){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "PeriodsSelector", "constructor", "missingTarget"));
		}
		this._containerSelector = options.containerSelector;
		this._dispatcher = options.dispatcher;

		this._id = "selector-periods";

		this._periodStore = Stores.retrieve("period");
		this._scopeStore = Stores.retrieve("scope");
		this._stateStore = Stores.retrieve("state");

		this._periodStore.addListener(this.onEvent.bind(this));

		this._selectedPeriods = [];
		this._disabledPeriods = [];
	};

	/**
	 * Rebuild periods selector if scope or period has been changed. It should redraw the periods selector with all periods
	 * asociated with current scope.
	 */
	PeriodsSelector.prototype.rebuild = function(){
		var currentState = this._stateStore.current();
		if (currentState.changes.scope || currentState.changes.period){
			this.updateSelectedPeriods();
			this.updateDisabledPeriods();

			var self = this;
			this._scopeStore.byId(currentState.scope).then(function(datasets){
				var periods = datasets[0].periods;
				return self._periodStore.filter({id: periods});
			}).then(self.render.bind(self));
		}
	};

	/**
	 * Render the selector
	 * @param periods {Array} list of periods with metadata
	 */
	PeriodsSelector.prototype.render = function(periods){
		if (this._periodsContainerSelector){
			this._periodsContainerSelector.remove();
		}

		var html = S(PeriodsSelectorHtml).template({
			id: this._id
		}).toString();

		this._containerSelector.append(html);
		this._periodsContainerSelector = $("#" + this._id);

		this._basicSelect = this.renderBasicPeriodSelection(periods);

		if (periods.length > 1){
			this._compareButton = this.renderCompareButton();
			this._multiSelect = this.renderMultiplePeriodSelection(periods);
		}
	};

	/**
	 * Update a list of selected periods
	 */
	PeriodsSelector.prototype.updateSelectedPeriods = function(){
		this._selectedPeriods = this._stateStore.current().periods;
	};

	/**
	 * Update a list for diasabled periods for multiselect. Currently only period selected by default should be disabled in MultiSelect.
	 */
	PeriodsSelector.prototype.updateDisabledPeriods = function(){
		var periods = this._stateStore.current().periods;
		if (periods.length < 2){
			this._disabledPeriods = periods;
		}
	};

	/**
	 * Render the selector for basic period selection
	 * @param periods {Array} list of periods with metadata
	 * @returns {Select}
	 */
	PeriodsSelector.prototype.renderBasicPeriodSelection = function (periods) {
		return new Select({
			id: this._id + "-select",
			title: "Select period",
			options: periods,
			sorting: {
				type: 'string'
			},
			selectedOptions: this._disabledPeriods,
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
	PeriodsSelector.prototype.renderMultiplePeriodSelection = function (periods) {
		return new MultiSelect({
			id: this._id + "-multiselect",
			title: "Select periods to compare",
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
	PeriodsSelector.prototype.renderCompareButton = function(){
		return new Button({
			id: this._id + "-compare-button",
			text: "Compare",
			title: "Compare periods",
			containerSelector: this._periodsContainerSelector,
			classes: "compare-button w5",
			textCentered: true,
			textSmall: true,
			onClick: this.selectAllPeriods.bind(this)
		});
	};

	/**
	 * @param type {string} type of event
	 */
	PeriodsSelector.prototype.onEvent = function(type){
		if (type === Actions.periodsRebuild){
			this.rebuild();
		}
	};

	/**
	 * If a change in basic selector of period occured, get selected period and notify Ext DiscreteTimeline.js
	 */
	PeriodsSelector.prototype.updatePeriod = function(){
		var selected = this._basicSelect.getSelected()[0];
		var periods = [Number(selected.id)];
		this._dispatcher.notify(Actions.periodsChange, periods);
	};

	/**
	 * If a change in multiselect occured, get selected periods and notify Ext DiscreteTimeline.js
	 */
	PeriodsSelector.prototype.selectPeriods = function(){
		var self = this;
		setTimeout(function(){
			var selected = self._multiSelect.getSelectedOptions();
			var periods = selected.map(function(item){
				if (typeof item === "string"){
					return Number(item);
				} else if (typeof item === "number"){
					return item;
				}
			});
			if (self._disabledPeriods){
				periods = periods.concat(self._disabledPeriods);
			}
			self._dispatcher.notify(Actions.periodsChange, periods);
		}, 50);
	};

	/**
	 * Select all periods available in multiselect and notify Ext DiscreteTimeline.js
	 */
	PeriodsSelector.prototype.selectAllPeriods = function(){
		if (this._multiSelect){
			var selected = this._multiSelect.getAllOptions();
			var periods = selected.map(function(item){
				if (typeof item === "string"){
					return Number(item);
				} else if (typeof item === "number"){
					return item;
				}
			});
			this._dispatcher.notify(Actions.periodsChange, periods);
		}
	};

	return PeriodsSelector;
});