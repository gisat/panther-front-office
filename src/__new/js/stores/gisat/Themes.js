define([
	'../BaseStore',
	'../../data/Theme'
], function(BaseStore,
			Theme){
	"use strict";

	/**
	 * Store for retrieval of Themes from the API.
	 * @augments BaseStore
	 * @constructor
	 * @alias Themes
	 */
	var Themes = function() {
		BaseStore.apply(this, arguments);
	};

	Themes.prototype = Object.create(BaseStore.prototype);

	/**
	 * @inheritDoc
	 */
	Themes.prototype.getInstance = function(data) {
		return new Theme({data: data});
	};

	/**
	 * @inheritDoc
	 */
	Themes.prototype.getPath = function() {
		return "rest/theme";
	};

	return Themes;
});
