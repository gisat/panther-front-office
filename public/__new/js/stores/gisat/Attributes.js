define([
	'../BaseStore',
	'../../data/Attribute'
], function(BaseStore,
			Attribute){
	"use strict";

	/**
	 * Store for retrieval of Attributes from the API.
	 * @augments BaseStore
	 * @constructor
	 * @alias Attributes
	 */
	var Attributes = function() {
		BaseStore.apply(this, arguments);
	};

	Attributes.prototype = Object.create(BaseStore.prototype);

	/**
	 * @inheritDoc
	 */
	Attributes.prototype.getInstance = function(attributeData) {
		return new Attribute({data: attributeData});
	};

	/**
	 * @inheritDoc
	 */
	Attributes.prototype.getPath = function() {
		return "rest/attribute";
	};

	Attributes.prototype.loaded = function(models) {
		window.Stores.notify("ATTRIBUTES_LOADED", models);
	};

	return Attributes;
});
