define([
	'js/stores/Stores',
	'js/stores/gisat/Attributes',
	'js/stores/gisat/AttributeSets',
	'js/stores/gisat/Themes'
], function(Stores,
			Attributes,
			AttributeSets,
			Themes){
	/**
	 * Constructor for assembling current application.
	 * @constructor
	 */
	var FrontOffice = function() {
		this.loadData();
	};

	FrontOffice.prototype.loadData = function(){
		Stores.retrieve('theme').load();
		Stores.retrieve('attribute').load();
		Stores.retrieve('attributeSet').load();
	};

	return FrontOffice;
});