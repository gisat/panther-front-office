define([
	'../BaseStore',
	'../Stores',
	'../../data/Attribute'
], function(BaseStore,
			Stores,
			Attribute){
	"use strict";
	var attributes;

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

	if(!attributes) {
		attributes = new Attributes();
		Stores.register('attribute', attributes);
	}
	return attributes;
});
