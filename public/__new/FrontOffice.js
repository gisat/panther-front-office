define([
	'js/actions/Actions',

	'js/error/ArgumentError',
	'js/error/NotFoundError',
	'js/util/Logger',
	'js/util/Promise',

	'js/view/widgets/EvaluationWidget/EvaluationWidget',
	'js/view/charts/PolarChart/PolarChart',

    'jquery',
	'underscore'
], function(Actions,

			ArgumentError,
			NotFoundError,
			Logger,
			Promise,

			EvaluationWidget,
			PolarChart,

			$,
			_){
	/**
	 * Constructor for assembling current application.
	 * @param options {Object}
	 * @param options.store {Object}
	 * @constructor
	 */
	var FrontOffice = function(options) {
        if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'FrontOffice', 'constructor', 'Stores must be provided'));
        }

		this.loadData(options.store);

        this._attributesMetadata = options.attributesMetadata;

		this._options = options.widgetOptions;
		this._tools = options.tools;
		this._widgets = options.widgets;
		this._store = options.store;
		this._charts = [];

		this._dataset = null;
		Observer.addListener("rebuild", this.rebuild.bind(this));
        Observer.addListener('user#onLogin', this.loadData.bind(this, options.store));
        Observer.addListener('Select#onChangeColor', this.rebuildEvaluationWidget.bind(this));
	};

	/**
	 * Rebuild all components
	 */
	FrontOffice.prototype.rebuild = function(options){
		this._options.config = ThemeYearConfParams;
		this._options.changes = {
			scope: false,
			location: false,
			theme: false,
			period: false,
			level: false,
			visualization: false,
			dataview: false
		};
		this.checkConfiguration();
		this._store.state.setChanges(this._options.changes);

		var visualization = Number(ThemeYearConfParams.visualization);

		var self = this;
		if (visualization > 0 && this._options.changes.visualization && !this._options.changes.dataview){
			this._store.visualizations.byId(visualization).then(function(response){
				var attributes = response[0].attributes;
				var options = response[0].options;

				if (attributes){
					self.getAttributesMetadata().then(function(results){
						var updatedAttributes = self.getAttributesWithUpdatedState(results, attributes);
						Promise.all([updatedAttributes]).then(function(result){
							self.rebuildComponents(result[0])
						});
					});
				}
				else {
					var attributesData = self.getAttributesMetadata();
					Promise.all([attributesData]).then(function(result){
						self.rebuildComponents(result[0])
					});
				}

				self.toggleSidebars(options);
				self.toggleWidgets(options);
				self.toggleCustomLayers(options);
			}).catch(function(err){
				throw new Error(err);
			});
		}

		else {
			var attributesData = this.getAttributesMetadata();
			Promise.all([attributesData]).then(function(result){
				self.rebuildComponents(result[0]);
			});
		}

		ThemeYearConfParams.datasetChanged = false;

		this._store.periods.notify(Actions.periodsRebuild);

		Charts.forEach(function(exchangeChartData) {
			var isNew = true;

			console.log("this._charts:", self._charts);

			self._charts.forEach(function(chart) {
				if (exchangeChartData.chartId === chart.chartId) {
					isNew = false;
				}
			});

			if (isNew) {
				// TODO here decide which chart
				switch (exchangeChartData.chartType) {
					case "polarchart":
						exchangeChartData.chart = new PolarChart(exchangeChartData);
						exchangeChartData.chartId = exchangeChartData.chart.id;
						break;
					default:
						console.warn(Logger.logMessage(Logger.LEVEL_WARNING, "FrontOffice", "rebuild", "Unknown chart type (" + exchangeChartData.chartType + ")"));
				}
			}
		});
	};

	/**
	 * Rebuild all components with given list of attributes, analytical units
	 * @param attributes {Array}
	 */
	FrontOffice.prototype.rebuildComponents = function(attributes){
		var self = this;
		var data = {
			attributes: attributes
		};
		this._tools.forEach(function(tool){
			tool.rebuild(attributes, self._options);
		});
		this._widgets.forEach(function(widget){
			widget.rebuild(data, self._options);
		});
	};

	FrontOffice.prototype.rebuildEvaluationWidget = function(){
		var self = this;
        var attributesData = this.getAttributesMetadata();
        Promise.all([attributesData]).then(function(result){
        	self._widgets.forEach(function(widget){
        		if(widget instanceof EvaluationWidget) {
        			widget.rebuild(result[0], self._options);
				}
			});
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
				if (attribute.attribute === visAttr.attribute && attribute.attributeSet === visAttr.attributeSet){
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
	 * Show/hide widgets according to visualization
	 * @param options {Object}
	 */
	FrontOffice.prototype.toggleWidgets = function(options){
		var self = this;
		if (options && !this._options.changes.period  && !this._options.changes.level){
			if (options.hasOwnProperty("openWidgets")){
				var floaters = options.openWidgets;
				this._widgets.forEach(function(widget){
					for (var key in floaters){
						if (key == "floater-" + widget._widgetId){
							widget.setState(key, floaters[key]);
						}
					}
				})
			}
		}
	};

	/**
	 * Show/hide layers according to visualization
	 * @param options {Object}
	 */
	FrontOffice.prototype.toggleCustomLayers = function(options){
		var self = this;
		if (options && !self._options.changes.period  && !self._options.changes.level){
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
	};

	/**
	 * Basic check, if configuration is set up properly. It also detects a type of change in configuration
	 */
	FrontOffice.prototype.checkConfiguration = function(){
		var self = this;
		ThemeYearConfParams.actions.forEach(function(action){
			self.mapActions(action);
		});
		ThemeYearConfParams.actions = [];


		if (this._options.changes.scope && !this._options.changes.dataview){
			if (this._dataset === ThemeYearConfParams.dataset){
				console.warn(Logger.logMessage(Logger.LEVEL_WARNING, "FrontOffice", "checkConfiguration", "missingDataset"));
			}
		}

		if (this._options.changes.dataview){
			this._dataset = this._options.config.dataset;
		} else {
			this._dataset = ThemeYearConfParams.dataset;
		}
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
			case "dataview":
				this._options.changes.scope = true;
				this._options.changes.dataview = true;
				break;
		}
	};

	/**
	 * Load metadata from server
	 */
	FrontOffice.prototype.loadData = function(store){
        return Promise.all([
            store.attributes.load(),
            store.attributeSets.load(),
            store.dataviews.load(),
            store.layers.load(),
            store.locations.load(),
            store.periods.load(),
            store.scopes.load(),
            store.themes.load(),
            store.visualizations.load(),
            store.wmsLayers.load()
        ]);
	};

	return FrontOffice;
});