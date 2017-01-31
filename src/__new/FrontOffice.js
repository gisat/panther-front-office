define([
	'js/stores/Stores',
	'js/stores/gisat/Attributes',
	'js/stores/gisat/AttributeSets',
	'js/stores/gisat/Visualizations',
	'underscore'
], function(Stores,
			Attributes,
			AttributeSets,
			Visualizations,
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
		var visualization = Number(ThemeYearConfParams.visualization);
		if (visualization > 0){
			Stores.retrieve("visualization").byId(visualization).then(function(response){
				var attributes = response[0].attributes;
				var options = response[0].options;

				if (attributes){
					self.getAttributesMetadata().then(function(results){
						var updatedAttributes = self.getAttributesWithUpdatedState(results, attributes);
						self.rebuildComponents(updatedAttributes);
					});
				}
				else {
					self.getAttributesMetadata().then(self.rebuildComponents.bind(self));
				}

				if (options){
					if (options.hasOwnProperty("openWidgets")){
						self.checkWidgetsState(options.openWidgets);
					}
				}
			});
		}

		else {
			this.getAttributesMetadata().then(self.rebuildComponents.bind(self));
		}
	};

	/**
	 * Rebuild all components with given list of attributes
	 * @param attributes {Array}
	 */
	FrontOffice.prototype.rebuildComponents = function(attributes){
		var self = this;

		this._tools.forEach(function(tool){
			tool.rebuild(attributes, self._map);
		});
		this._widgets.forEach(function(widget){
			widget.rebuild(attributes, self._map);
		});
	};

	/**
	 * Check if state of widgets match the configuration
	 * @param floaters {Object}
	 */
	FrontOffice.prototype.checkWidgetsState = function(floaters){
		this._widgets.forEach(function(widget){
			for (var key in floaters){
				if (key == "floater-" + widget._widgetId){
					widget.setState(key, floaters[key]);
				}
			}
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
	 * Update the state of attributes (active/inactive) according to visualiyation settings
	 * @param allAttributes {Array} list of all attributes for given configuration
	 * @param visAttributes {Array} list of attrributes from visualization
	 * @returns {Array} list of updated attributes
	 */
	FrontOffice.prototype.getAttributesWithUpdatedState = function(allAttributes, visAttributes){
		var updated = [];
		allAttributes.forEach(function(allAttr){
			var isInVisualization = false;
			visAttributes.forEach(function(visAttr){
				if (allAttr.attribute == visAttr.attribute){
					allAttr.active = visAttr.active;
					isInVisualization = true;
				}
			});
			if (!isInVisualization){
				allAttr.active = false;
			}
			updated.push(allAttr);
		});
		return updated;
	};

	/**
	 * Load metadata from server
	 */
	FrontOffice.prototype.loadData = function(){
		Stores.retrieve('attribute').all();
		Stores.retrieve('attributeSet').all();
		Stores.retrieve('visualization').all();
	};

	return FrontOffice;
});