define([
	'js/error/ArgumentError',
	'js/error/NotFoundError',
	'js/util/Logger',

	'js/stores/Stores',
	'js/stores/gisat/Attributes',
	'js/stores/gisat/AttributeSets',
	'js/stores/gisat/Locations',
	'js/stores/gisat/Visualizations',
	'jquery',
	'underscore'
], function(ArgumentError,
			NotFoundError,
			Logger,

			Stores,
			Attributes,
			AttributeSets,
			Locations,
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
		this._analyticalUnits = options.analyticalUnits;

		this._options = options.widgetOptions;
		this._tools = options.tools;
		this._widgets = options.widgets;
		this._widgets3D = options.widgets3D;

		this._dataset = null;
		Observer.addListener("rebuild", this.rebuild.bind(this));
	};

	/**
	 * Rebuild all components 
	 */
	FrontOffice.prototype.rebuild = function(){
		this._options.config = ThemeYearConfParams;
		this._options.changes = {
			scope: false,
			location: false,
			theme: false,
			period: false,
			level: false,
			visualization: false
		};
		this.checkConfiguration();

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

				if (options && !self._options.changes.period  && !self._options.changes.level){
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
	 * @param analyticalUnits {Array}
	 */
	FrontOffice.prototype.rebuildComponents = function(attributes, analyticalUnits){
		var self = this;
		var data = {
			attributes: attributes,
			analyticalUnits: analyticalUnits
		};

		this._tools.forEach(function(tool){
			tool.rebuild(attributes, self._options);
		});
		this._widgets.forEach(function(widget){
			widget.rebuild(attributes, self._options);
		});
		this._widgets3D.forEach(function(widget){
			widget.rebuild(attributes, self._options);
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
		return this._attributesMetadata.getData(this._options).then(function(result){
			var attributes = [];
			if (result.length > 0){
				result.forEach(function(attributeSet){
					if (attributeSet){
						attributeSet.forEach(function(attribute){
							if (!_.isEmpty(attribute)){
								attributes.push(attribute);
							}
						});
					}
				});
			} else {
				console.warn(Logger.logMessage(Logger.LEVEL_WARNING, "FrontOffice", "getAttributesMetadata", "emptyResult"));
			}
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
	 * Basic check, if configuration is set up properly
	 */
	FrontOffice.prototype.checkConfiguration = function(){
		var self = this;
		ThemeYearConfParams.actions.forEach(function(action){
			self.mapActions(action);
		});
		ThemeYearConfParams.actions = [];


		if (this._options.changes.scope){
			if (this._dataset == ThemeYearConfParams.dataset){
				console.warn(Logger.logMessage(Logger.LEVEL_WARNING, "FrontOffice", "checkConfiguration", "missingDataset"));
			}
		}
		this._dataset = ThemeYearConfParams.dataset;
	};

	/**
	 * Map ext actions to options.changes
	 * @param action {string}
	 */
	FrontOffice.prototype.mapActions = function(action){
		switch (action){
			case "initialdataset":
				this._options.changes.scope = true;
				break;
			case "initialtheme":
				this._options.changes.theme = true;
				break;
			case "initiallocation":
				this._options.changes.location = true;
				break;
			case "seldataset":
				this._options.changes.scope = true;
				break;
			case "sellocation":
				this._options.changes.location = true;
				break;
			case "seltheme":
				this._options.changes.theme = true;
				break;
			case "selvisualization":
				this._options.changes.visualization = true;
				break;
			case "selyear":
				this._options.changes.period = true;
				break;
			case "detaillevel":
				this._options.changes.level = true;
				break;
		}
	};

	/**
	 * Load metadata from server
	 */
	FrontOffice.prototype.loadData = function(){
		Stores.retrieve('attribute').all();
		Stores.retrieve('attributeSet').all();
		Stores.retrieve('location').all();
		Stores.retrieve('visualization').all();
	};

	return FrontOffice;
});