define([], function () {
	"use strict";

	/**
	 * Singleton containing information about the stores.
	 * @constructor
	 * @alias Stores
	 */
	var Stores = function() {
		this._stores = {};
	};

	/**
	 * Registers store with given name. If there is already a store with given name, it is replaced with the new one.
	 * @param name {String} Name of the store. Should be equal to the name of the model in plural.
	 * @param store {BaseStore} Store to register.
	 */
	Stores.prototype.register = function(name, store) {
		this._stores[name] = store;
	};

	/**
	 * Retrieve correct store based on the name.
	 * @param name {String} Name of the store
	 * @returns {BaseStore|null} Store under given name if such store exists.
	 */
	Stores.prototype.retrieve = function(name) {
		return this._stores[name];
	};

	var stores;
	if(!stores) {
		stores = new Stores();
	}
	return stores;
});