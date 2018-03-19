define([
	'../BaseStore',
	'../../data/AttributeSet'
], function(BaseStore,
			AttributeSet){
	"use strict";

	/**
	 * Store for retrieval of AttributeSets from the API.
	 * @augments BaseStore
	 * @constructor
	 * @alias AttributeSets
	 */
	var AttributeSets = function() {
		BaseStore.apply(this, arguments);
	};

	AttributeSets.prototype = Object.create(BaseStore.prototype);

	/**
	 * @inheritDoc
	 */
	AttributeSets.prototype.getInstance = function(attributeSetData) {
		return new AttributeSet({data: attributeSetData});
	};

	/**
	 * @inheritDoc
	 */
	AttributeSets.prototype.getPath = function() {
		return "rest/attributeset";
	};

	return AttributeSets;
});
