define([
	'../../../actions/Actions',
	'../../../error/ArgumentError',
	'../../../error/NotFoundError',
	'../../../util/Logger',

	'../Widget',

	'jquery',
	'string',
	'css!./PeriodsWidget'
], function(Actions,
			ArgumentError,
			NotFoundError,
			Logger,

			Widget,

			$,
			S
){
	/**
	 * Class representing widget for periods
	 * @param options {Object}
	 * @param options.mapsContainer {MapsContainer}
	 * @param options.store {Object}
	 * @param options.store.scopes {Scopes}
	 * @param options.store.state {StateStore}
	 * @param options.store.periods {Periods}
	 * @constructor
	 */
	var PeriodsWidget = function(options){
		Widget.apply(this, arguments);

		if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'PeriodsWidget', 'constructor', 'Stores must be provided'));
        }
        if(!options.store.scopes){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'PeriodsWidget', 'constructor', 'Store scopes must be provided'));
        }
        if(!options.store.state){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'PeriodsWidget', 'constructor', 'Store state must be provided'));
        }
        if(!options.store.periods){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'PeriodsWidget', 'constructor', 'Store periods must be provided'));
        }

		this._mapsContainer = options.mapsContainer;

		this._scopeStore = options.store.scopes;
		this._stateStore = options.store.state;
		this._periodStore = options.store.periods;

		this.addEventListeners();
	};

	PeriodsWidget.prototype = Object.create(Widget.prototype);

	/**
	 * Rebuild widget. If period or scope has been changed, redraw widget. The change of scope basicaly means the change 
	 * in a Scope select in a top bar (or an initial selection of scope). It is the same for the selection of period or any
	 * other change visualization/theme/place/level
	 * 
	 * For info about detection of changes see: FrontOffice.js#rebuild
	 */
	PeriodsWidget.prototype.rebuild = function(){
		var stateChanges = this._stateStore.current().changes;
        if (stateChanges.period || stateChanges.scope){
        	this.redraw();
		}
		this.handleLoading("hide");
	};

	/**
	 * Redraw widget body with data relevant for current configuration
	 */
	PeriodsWidget.prototype.redraw = function () {
		this._widgetBodySelector.html("");

		var currentScope = this._stateStore.current().scope;
		var self = this;
		this._scopeStore.filter({id: currentScope})
			.then(function(datasets){
				return datasets[0].periods;
			}).then(function(periods){
			periods.forEach(function (period) {
				self._periodStore.byId(period).then(function(periodData){
					self._widgetBodySelector.append('<button class="add-map" data-id="'+ periodData[0].id +'">Add ' + periodData[0].name + '</button>')
				});
			});
		});
	};

	PeriodsWidget.prototype.addEventListeners = function () {
		// todo temporary for testing
		var self = this;
		this._widgetBodySelector.on("click", ".add-map", function(){
			var yearId = Number($(this).attr("data-id"));
			self._mapsContainer.addMap(null, yearId);
		});
	};

	return PeriodsWidget;
});