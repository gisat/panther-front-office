define([
	'../BaseStore',
	'../Stores',
	'../../data/Theme'
], function(BaseStore,
			Stores,
			Theme){
	"use strict";
	var themes;

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
	Themes.prototype.getInstance = function(themeData) {
		return new Theme({data: themeData});
	};

	/**
	 * @inheritDoc
	 */
	Themes.prototype.getPath = function() {
		return "rest/theme";
	};

	if(!themes) {
		themes = new Themes();
		Stores.register('theme', themes);
	}
	return themes;
});