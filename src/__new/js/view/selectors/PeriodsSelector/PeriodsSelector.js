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
	};

	/**
	 * Rebuild periods selector if scope or period has been changed. It should redraw the periods selector with all periods
	 * asociated with current scope.
	 */
	PeriodsSelector.prototype.rebuild = function(){
		var currentState = this._stateStore.current();
		if (currentState.changes.scope || currentState.changes.period){
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
		}

		if (periods.length > 2){
			this._multiSelect = this.renderMultiplePeriodSelection(periods);
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
			selectedOptions: this._stateStore.current().periods,
			containerSelector: this._periodsContainerSelector,
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
			disabledOptions: this._stateStore.current().periods,
			containerSelector: this._periodsContainerSelector
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
			classes: "compare-button",
			onClick: this.selectAllPeriods.bind(this)
		});
	};

	/**
	 * @param type {string} type of event
	 */
	PeriodsSelector.prototype.onEvent = function(type){
		if (type === Actions.periodsUpdate){
			this.rebuild();
		}
	};

	/**
	 * If there has been a change in basic selector of period, update multiselect (if exists)
	 */
	PeriodsSelector.prototype.updatePeriod = function(){
		var selected = this._basicSelect.getSelected()[0];
		var period = Number(selected.id);
		this._dispatcher.notify("period#change", period);
		if (this._multiSelect){
			this._multiSelect.updateWithCurrentlySelected(period);
		}
	};

	/**
	 * Select all periods available in multiselect
	 */
	PeriodsSelector.prototype.selectAllPeriods = function(){
		if (this._multiSelect){
			this._multiSelect.selectAll();
		}
	};

	return PeriodsSelector;
});