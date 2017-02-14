define([
	'js/stores/Stores',
	'js/stores/gisat/Attributes',
	'js/stores/gisat/AttributeSets',
	'js/stores/gisat/Visualizations',
	'jquery',
	'underscore'
], function(Stores,
			Attributes,
			AttributeSets,
			Visualizations,
			$,
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
				self.toggleSidebars(options);

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
					if (options.hasOwnProperty("displayCustomLayers")){
						var layers = options.displayCustomLayers;
						for (var key in options.displayCustomLayers){
							var checkbox = $("#" + key);
							if (layers[key]){
								checkbox.addClass("checked");
							} else {
								checkbox.removeClass("checked");
							}
						}
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
				if (attributeSet){
					attributeSet.forEach(function(attribute){
						if (!_.isEmpty(attribute)){
							attributes.push(attribute);
						}
					});
				}
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
		allAttributes.forEach(function(attribute){
			var isInVisualization = false;
			visAttributes.forEach(function(visAttr){
				if (attribute.attribute == visAttr.attribute && attribute.attributeSet == visAttr.attributeSet){
					attribute.active = visAttr.active;
					isInVisualization = true;
				}
			});
			if (!isInVisualization){
				attribute.active = false;
			}
			updated.push(attribute);
		});
		return updated;
	};

	/**
	 * Show/hide sidebars according to visualization
	 * @param options {Object}
	 */
	FrontOffice.prototype.toggleSidebars = function(options){
		if (options && options.hasOwnProperty('openSidebars')){
			var sidebars = options.openSidebars;
			if (sidebars.hasOwnProperty('sidebar-tools') && !sidebars['sidebar-tools']){
				$('#sidebar-tools').addClass("hidden");
			}
			if (sidebars.hasOwnProperty('sidebar-reports') && !sidebars['sidebar-reports']){
				$('#sidebar-reports').addClass("hidden");
				Observer.notify("resizeMap");
			}
		}
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