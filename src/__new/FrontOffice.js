define([
	'js/stores/Stores',
	'js/stores/gisat/Attributes',
	'js/stores/gisat/AttributeSets'
], function(Stores,
			Attributes,
			AttributeSets){
	/**
	 * Constructor for assembling current application.
	 * @constructor
	 */
	var FrontOffice = function(options) {
		//this.widgets = options.widgets;
		this.loadData();
		this._attributesMetadata = options.attributesMetadata;
		this._map = options.map;
		this._tools = options.tools;

		Observer.addListener("rebuild", this.rebuild.bind(this));
	};
	
	FrontOffice.prototype.rebuild = function(){
		// get attributes current for given configuration
		var self = this;
		this._map.rebuild(FeatureInfo.map);

		this.getAttributesMetadata().then(function(attributes){
			self._tools.forEach(function(tool){
				tool.rebuild(attributes, self._map);
			});
			// rebuild widgets with attributes (and options?)
		});
	};

	/**
	 * Get list of attributes
	 * @returns {*|Promise}
	 */
	FrontOffice.prototype.getAttributesMetadata = function(){
		return this._attributesMetadata.getData().then(function(result){
			var attributes = [];
			result.forEach(function(attrSet){
				attrSet.forEach(function(attribute){
					attributes.push(attribute);
				});
			});
			return attributes;
		});
	};

	FrontOffice.prototype.loadData = function(){
		Stores.retrieve('attribute').all();
		Stores.retrieve('attributeSet').all();
	};

	return FrontOffice;
});