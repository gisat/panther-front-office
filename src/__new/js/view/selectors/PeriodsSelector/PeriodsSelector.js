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
	'underscore',
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
			_,
			PeriodsSelectorHtml
){
	/**
	 * Periods selector component
	 * @params options {Object}
	 * @params options.containerSelector {Object} JQuery selector of parent element, where will be rendered the PeriodsSelector
	 * @params options.dispatcher {Object} Dispatcher, which is used to distribute actions across the application.
	 * @params [options.maxSelected] {number} maximal number of selected periods
	 * @constructor
	 */
	var PeriodsSelector = function(options){
		if (!options.containerSelector){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "PeriodsSelector", "constructor", "missingTarget"));
		}
		this._containerSelector = options.containerSelector;
		this._dispatcher = options.dispatcher;
		this._maxSelected = options.maxSelected || 16;
		this._defaultPeriod = null;

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
			id: this._id,
			period: polyglot.t('period')
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
		if (this._selectedPeriods.length === 1){
			this._defaultPeriod = this._selectedPeriods[0];
		}
	};

	/**
	 * Update a list for diasabled periods for multiselect. Currently only period selected by default should be disabled in MultiSelect or if the number of slected maps equals mx allowed number, all other options are disabled
	 */
	PeriodsSelector.prototype.updateDisabledPeriods = function(){
		this._disabledPeriods = [];
		var periods = this._stateStore.current().periods;
		if (periods.length < 2){
			this._disabledPeriods = periods;
		}
		else if (periods.length === this._maxSelected && this._multiSelect){
			var adjustedPeriods = this._multiSelect.getAllOptions().map(function(item){
				if (typeof item === "string"){
					return Number(item);
				} else if (typeof item === "number"){
					return item;
				}
			});
			this._disabledPeriods = _.union([this._defaultPeriod], _.difference(adjustedPeriods, periods));
		} else {
			this._disabledPeriods.push(this._defaultPeriod);
		}
	};

	/**
	 * Render the selector for basic period selection
	 * @param periods {Array} list of periods with metadata
	 * @returns {Select}
	 */
	PeriodsSelector.prototype.renderBasicPeriodSelection = function (periods) {
		var selected = this._selectedPeriods;
		if (this._selectedPeriods.length > 1){
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
	PeriodsSelector.prototype.renderMultiplePeriodSelection = function (periods) {
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
	PeriodsSelector.prototype.renderCompareButton = function(){
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
			periods.push(self._defaultPeriod);
			self._dispatcher.notify(Actions.periodsChange, periods);
		}, 50);
	};

	/**
	 * Select all periods available in multiselect and notify Ext DiscreteTimeline.js
	 */
	PeriodsSelector.prototype.selectAllPeriods = function(){
		if (this._multiSelect){
			var periods = this.checkMaxNumberOfSelectedPeriods(this._multiSelect.getAllOptions());
			this._dispatcher.notify(Actions.periodsChange, periods);
		}
	};

	/**
	 * Check if number of selected periods is equal or less than the max allowed number.
	 * @param periods {Array}
	 * @returns {Array}
	 */
	PeriodsSelector.prototype.checkMaxNumberOfSelectedPeriods = function(periods){
		var selectedPeriods = [];
		var adjustedPeriods = periods.map(function(item){
			if (typeof item === "string"){
				return Number(item);
			} else if (typeof item === "number"){
				return item;
			}
		});

		// go through list of previously selected periods. For each period, check if period is up to be selected again
		this._selectedPeriods.forEach(function(selectedPeriod){
			var wasSelected = _.indexOf(adjustedPeriods, selectedPeriod);
			if (wasSelected > -1){
				selectedPeriods.push(selectedPeriod);
			}
		});

		var periodsLeftToLimit = this._maxSelected - selectedPeriods.length;

		adjustedPeriods.forEach(function(period){
			if (periodsLeftToLimit > 0){
				var isSelected = _.indexOf(selectedPeriods, period);
				if (isSelected === -1){
					selectedPeriods.push(period);
					periodsLeftToLimit--;
				}
			}
		});

		return selectedPeriods;
	};

	return PeriodsSelector;
});