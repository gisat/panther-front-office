define([
	'js/actions/Actions',

	'js/error/ArgumentError',
	'js/error/NotFoundError',
	'js/util/Logger',
	'js/util/Promise',

	'js/view/widgets/EvaluationWidget/EvaluationWidget',

    'jquery',
	'underscore'
], function(Actions,

			ArgumentError,
			NotFoundError,
			Logger,
			Promise,

			EvaluationWidget,

			$,
			_){
	/**
	 * Constructor for assembling current application.
	 * @param options {Object}
	 * @param options.mapsContainer {Object}
	 * @param options.store {Object}
	 * @param options.dispatcher {Object}
	 * @param options.topToolBar {TopToolBar}
	 * @constructor
	 */
	var FrontOffice = function(options) {
        if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'FrontOffice', 'constructor', 'Stores must be provided'));
        }
		if(!options.mapsContainer){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'FrontOffice', 'constructor', 'Maps container must be provided'));
		}
		if (!options.dispatcher){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'FrontOffice', 'constructor', 'Dispatcher must be provided'));
		}

		this.loadData(options.store);

        this._attributesMetadata = options.attributesMetadata;
		this._options = options.widgetOptions;
		this._tools = options.tools;
		this._widgets = options.widgets;
		this._store = options.store;
		this._scopesStore = options.store.scopes;
		this._stateStore = options.store.state;
		this._dispatcher = options.dispatcher;
		this._topToolBar = options.topToolBar;

		this._mapsContainer = options.mapsContainer;
		this._mapsContainer.addMap('default-map');

		this._dataset = null;
		this._previousDataset = null;

		Observer.addListener("rebuild", this.rebuild.bind(this));
        Observer.addListener('user#onLogin', this.loadData.bind(this, options.store));
        Observer.addListener('Select#onChangeColor', this.rebuildEvaluationWidget.bind(this));

        this._dispatcher.addListener(this.onEvent.bind(this));
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
		this._stateStore.setChanges(this._options.changes);

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
				self.handlePeriods();
			}).catch(function(err){
				throw new Error(err);
			});
		}

		else {
			var attributesData = this.getAttributesMetadata();
			Promise.all([attributesData]).then(function(result){
				self.rebuildComponents(result[0]);
				self.handlePeriods();
			});
		}

		if (this._previousDataset !== this._dataset){
			this._dispatcher.notify('scope#activeScopeChanged', {activeScopeKey: Number(self._dataset)});
			this._previousDataset = this._dataset;
		}
		ThemeYearConfParams.datasetChanged = false;
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
	 * Get default position in the map according to configuration
	 * @param [options] {Object} Optional. Settings from dataview
	 * @return position {WorldWind.Position}
	 */
	FrontOffice.prototype.getPosition = function(options){
		if (options && options.worldWindState){
			return options.worldWindState.location;
		} else {
			var places = this._stateStore.current().objects.places;
			var locations;
			if(places.length === 1 && places[0]){
				locations = places[0].get('bbox').split(',');
			} else {
				places = this._stateStore.current().allPlaces.map(function(place) {
					return Ext.StoreMgr.lookup('location').getById(place);
				});
				locations = this.getBboxForMultiplePlaces(places);
			}

			if(locations.length != 4) {
				console.warn('WorldWindWidget#getPosition Incorrect locations: ', locations);
				return;
			}
			var position = new WorldWind.Position((Number(locations[1]) + Number(locations[3])) / 2, (Number(locations[0]) + Number(locations[2])) / 2, 1000000);

			return position;
		}
	};

	/**
	 * It combines bboxes of all places to get an extent, which will show all of them.
	 * @param places
	 * @returns {*}
	 */
	FrontOffice.prototype.getBboxForMultiplePlaces = function(places) {
		if(places.length == 0) {
			return [];
		}

		var minLongitude = 180;
		var maxLongitude = -180;
		var minLatitude = 90;
		var maxLatitude = -90;

		var locations;
		places.forEach(function(place){
			locations = place.get('bbox').split(',');
			if(locations[0] < minLongitude) {
				minLongitude = locations[0];
			}

			if(locations[1] < minLatitude) {
				minLatitude = locations[1];
			}

			if(locations[2] > maxLongitude) {
				maxLongitude = locations[2];
			}

			if(locations[3] > maxLatitude) {
				maxLatitude = locations[3];
			}
		});

		return [minLongitude, maxLatitude, maxLongitude, minLatitude];
	};

	// TODO reviewed methods -----------------------------------------------------------------------------------------

	/**
	 * Adjust FO view
	 * @param options {Object} settings from dataview
	 */
	FrontOffice.prototype.adjustConfiguration = function(options){
		var state = this._stateStore.current();
		var htmlBody = $("body");
		var self = this;

		this._scopesStore.byId(state.scope).then(function(scopes){
			var scope = scopes[0];
			if (scope && scope.isMapIndependentOfPeriod){
				self._dispatcher.notify("fo#mapIsIndependentOfPeriod");
			} else {
				self._dispatcher.notify("fo#mapIsDependentOnPeriod");
			}

			self._dispatcher.notify("scope#aoiLayer", scope.aoiLayer);

			htmlBody.addClass("mode-3d");
			self.toggleExtComponents("none");

			/**
			 * Rebuild World wind widget
			 */
			self._worldWindWidget = _.find(self._widgets, function(widget){return widget._widgetId === 'world-wind-widget'});
			self._worldWindWidget.rebuild();

			/**
			 * Rebuild Top tool bar
			 */
			if (self._topToolBar){
				self._topToolBar.build();
			}

			/**
			 * Set default position of the map
			 */
			if (_.isEmpty(state.changes) || (!state.changes.dataview && (state.changes.scope || state.changes.location))){
				var position = self.getPosition(options);
				self._mapsContainer.setAllMapsPosition(position);
			}

			/**
			 * Apply settings from dataview, if exists
			 */
			if (options){
				self.applySettingsFromDataview(options);
			}
		});
	};

	/**
	 * Apply dataview settings
	 * @param options {Object} settings
	 */
	FrontOffice.prototype.applySettingsFromDataview = function(options){
		this._stateStore._changes = {
			dataview: true
		};
		if (options.worldWindState){
			this._mapsContainer.setAllMapsPosition(options.worldWindState.location);
			this._mapsContainer.setAllMapsRange(options.worldWindState.range);
			if (options.worldWindState.is2D && this._stateStore.current().isMap3D){
				this._dispatcher.notify('map#switchProjection');
			}
		}
		if (options.widgets){
			this._topToolBar.handleDataview(options.widgets);
		}
	};

	/**
	 * Handle periods according to scope setting
	 */
	FrontOffice.prototype.handlePeriods = function(){
		var state = this._stateStore.current();
		if (state.isMapIndependentOfPeriod){
			this._store.periods.notify('periods#default')
		} else {
			this._store.periods.notify('periods#rebuild');
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

	/**
	 * Show/hide components
	 * @param action {string} css display value
	 */
	FrontOffice.prototype.toggleExtComponents = function(action){
		if (!Config.toggles.useTopToolbar) {
			var sidebarTools = $("#sidebar-tools");
			if (action === "none") {
				sidebarTools.addClass("hidden-complete");
				sidebarTools.css("display", "none");
			} else {
				sidebarTools.removeClass("hidden-complete");
				sidebarTools.css("display", "block");
			}
		}
		$(".x-window:not(.thematic-maps-settings, .x-window-ghost, .metadata-window, .window-savevisualization, .window-savedataview, #loginwindow, #window-managevisualization, #window-areatree, #window-colourSelection, #window-legacyAdvancedFilters), #tools-container, #widget-container .placeholder:not(#placeholder-" + this._widgetId + ")")
			.css("display", action);

	};

	/**
	 * @param type {string} type of event
	 * @param options {Object}
	 */
	FrontOffice.prototype.onEvent = function(type, options) {
		if(type === Actions.adjustConfiguration) {
			this.adjustConfiguration();
		} else if (type === Actions.adjustConfigurationFromDataview){
			this.adjustConfiguration(options);
		}
	};

	return FrontOffice;
});