define([
	'../BaseStore',
	'../../data/Scope'
], function(BaseStore,
			Scope){
	"use strict";

	/**
	 * Store for retrieval of Scopes from the API.
	 * @augments BaseStore
	 * @constructor
	 * @alias Scopes
	 */
	var Scopes = function() {
		BaseStore.apply(this, arguments);
	};

	Scopes.prototype = Object.create(BaseStore.prototype);

	/**
	 * @inheritDoc
	 */
	Scopes.prototype.getInstance = function(data) {
		return new Scope({data: data});
	};

	/**
	 * @inheritDoc
	 */
	Scopes.prototype.getPath = function() {
		return "rest/dataset";
	};

	return Scopes;
});
