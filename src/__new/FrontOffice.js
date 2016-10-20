define([
	'js/stores/Stores',
	'js/stores/gisat/Attributes',
	'js/stores/gisat/AttributeSets',
	'underscore'
], function(Stores,
			Attributes,
			AttributeSets,
			_){
	/**
	 * Constructor for assembling current application.
	 * @constructor
	 */
	var FrontOffice = function(options) {
		this.loadData();
		this._attributesMetadata = options.attributesMetadata;
		this._map = options.map;
		this._tools = options.tools;
		this._widgets = options.widgets;
		Observer.addListener("rebuild", this.rebuild.bind(this));
	};

	/**
	 * Rebuild all components 
	 */
	FrontOffice.prototype.rebuild = function(){
		var self = this;
		this.getAttributesMetadata().then(function(attributes){
			console.log(attributes);
			self._tools.forEach(function(tool){
				tool.rebuild(attributes, self._map);
			});
			self._widgets.forEach(function(widget){
				widget.rebuild(attributes, self._map);
			});
		});
	};

	/**
	 * Get list of all attributes for given configuration
	 * @returns {*|Promise}
	 */
	FrontOffice.prototype.getAttributesMetadata = function(){
		return this._attributesMetadata.getData().then(function(result){
			var attributes = [];
			result.forEach(function(attributeSet){
				attributeSet.forEach(function(attribute){
					if (!_.isEmpty(attribute)){
						attributes.push(attribute);
					}
				});
			});
			return attributes;
		});
	};

	/**
	 * Load metadata from server
	 */
	FrontOffice.prototype.loadData = function(){
		Stores.retrieve('attribute').all();
		Stores.retrieve('attributeSet').all();
	};

	return FrontOffice;
});