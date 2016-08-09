define([
	'../BaseStore',
	'../Stores',
	'../../data/AttributeSet'
], function(BaseStore,
			Stores,
			AttributeSet){
	"use strict";
	var attributeSets;

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

	if(!attributeSets) {
		attributeSets = new AttributeSets();
		Stores.register('attributeSet', attributeSets);
	}
	return attributeSets;
});
