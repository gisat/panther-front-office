define([
	'../../actions/Actions',
	'../../error/ArgumentError',
	'../../error/NotFoundError',
	'../../util/Logger',

	'../../stores/Stores',

	'jquery'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,

			Stores,

			$
){
	/**
	 * Periods selector component
	 * @constructor
	 */
	var PeriodsSelector = function(options){
		this._periodStore = Stores.retrieve("period");
		this._scopeStore = Stores.retrieve("scope");
		this._stateStore = Stores.retrieve("state");

		this._periodStore.addListener(this.onEvent.bind(this));
	};

	/**
	 * Rebuild selector if scope has been changed.
	 */
	PeriodsSelector.prototype.rebuild = function(){
		var currentState = this._stateStore.current();
		if (currentState.changes.scope){
			var self = this;
			this._scopeStore.byId(currentState.scope).then(function(datasets){
				var periods = datasets[0].periods;
				self.render(periods);
			});
		}
	};

	/*
	 * @param periods {Array} list of IDs of periods
	 */
	PeriodsSelector.prototype.render = function(periods){
		debugger;
	};

	/**
	 * @param type {string} type of event
	 */
	PeriodsSelector.prototype.onEvent = function(type){
		if (type === Actions.periodsUpdate){
			this.rebuild();
		}
	};

	return PeriodsSelector;
});