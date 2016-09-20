define([
	'js/stores/Stores',
	'js/stores/gisat/Attributes',
	'js/stores/gisat/AttributeSets',
	'js/stores/gisat/LayerRefs'
], function(Stores,
			Attributes,
			AttributeSets,
			LayerRefs){
	/**
	 * Constructor for assembling current application.
	 * @constructor
	 */
	var FrontOffice = function() {
		this.loadData();
	};

	FrontOffice.prototype.loadData = function(){
		setTimeout(function(){
			Stores.retrieve('layerRef').load();
			Stores.retrieve('attribute').load();
			Stores.retrieve('attributeSet').load();
		},200)
	};

	return FrontOffice;
});