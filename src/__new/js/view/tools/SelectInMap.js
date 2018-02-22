define([
	'../../error/ArgumentError',
	'../../util/Logger',
	'../../util/RemoteJQ',

	'jquery',
	'underscore'
], function(ArgumentError,
			Logger,
			RemoteJQ,

			$,
			_){

	/**
	 * @param options {Object}
	 * @param options.dispatcher {Object} Object for handling events in the application.
	 * @param options.store {Object}
	 * @param options.store.state {StateStore}
	 * @constructor
	 */
	var SelectInMap  = function(options){
		if(!options.store){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'SelectInMap', 'constructor', 'Stores must be provided'));
		}
		if(!options.store.state){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'SelectInMap', 'constructor', 'Store state must be provided'));
		}
		this._dispatcher = options.dispatcher;

		this._store = options.store;
	};

	SelectInMap.prototype.activate = function(){
		// TODO add logic
	};

	SelectInMap.prototype.deactivate = function(){
		// TODO add logic
	};

	return SelectInMap;
});