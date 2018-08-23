
import _ from 'underscore';

import Actions from './actions/Actions';
import ArgumentError from './error/ArgumentError';
import Logger from './util/Logger';
import EvaluationWidget from './view/widgets/EvaluationWidget/EvaluationWidget';

import PolarChart from './view/charts/PolarChart/PolarChart';
import WorldWind from '@nasaworldwind/worldwind';

let Observer = window.Observer;
let ThemeYearConfParams = window.ThemeYearConfParams;

/**
 * Constructor for assembling current application.
 * @param options {Object}
 * @param options.store {Object}
 * @constructor
 */
let $ = window.$;
let Ext, Config;
class FrontOffice {
    constructor(options) {
        Ext = window.Ext;
        Config = window.Config;
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
        this._charts = [];
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
    rebuild(options) {
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

        let visualization = Number(ThemeYearConfParams.visualization);

        let self = this;
        if (visualization > 0 && this._options.changes.visualization && !this._options.changes.dataview){
            this._store.visualizations.byId(visualization).then(function(response){
                let attributes = response[0].attributes;
                let options = response[0].options;

                if (attributes){
                    self.getAttributesMetadata().then(function(results){
                        let updatedAttributes = self.getAttributesWithUpdatedState(results, attributes);
                        Promise.all([updatedAttributes]).then(function(result){
                            self.rebuildComponents(result[0])
                        });
                    });
                }
                else {
                    let attributesData = self.getAttributesMetadata();
                    Promise.all([attributesData]).then(function(result){
                        self.rebuildComponents(result[0])
                    });
                }

                self.toggleSidebars(options);
                self.toggleWidgets(options);
                self.toggleCustomLayers(options);
                self.handlePeriods();
                self._stateStore.resetChanges();
            }).catch(function(err){
                throw new Error(err);
            });
        }

        else {
            let attributesData = this.getAttributesMetadata();
            Promise.all([attributesData]).then(function(result){
                self.rebuildComponents(result[0]);
                self.handlePeriods();
                self._stateStore.resetChanges();
            });
        }

        ThemeYearConfParams.datasetChanged = false;

        window.Charts.forEach(function(exchangeChartData) {
            let isNew = true;

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
    rebuildComponents(attributes) {
        let self = this;
        let data = {
            attributes: attributes
        };
        this._tools.forEach(function(tool){
            tool.rebuild(attributes, self._options);
        });
        this._widgets.forEach(function(widget){
            widget.rebuild(data, self._options);
        });
    };

    rebuildEvaluationWidget() {
        let self = this;
        let attributesData = this.getAttributesMetadata();
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
    getAttributesMetadata() {
        return this._attributesMetadata.getData(this._options).then(function(result){
            let attributes = [];
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
    getAttributesWithUpdatedState(allAttributes, visAttributes) {
        let updated = [];
        allAttributes.forEach(function(attribute){
            let isInVisualization = false;
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
    toggleSidebars(options) {
        if (options && options.hasOwnProperty('openSidebars')){
            let sidebars = options.openSidebars;
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
    toggleWidgets(options) {
        if (options && !this._options.changes.period  && !this._options.changes.level){
            if (options.hasOwnProperty("openWidgets")){
                let floaters = options.openWidgets;
                this._widgets.forEach(function(widget){
                    for (let key in floaters){
                        if (key === "floater-" + widget._widgetId){
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
    toggleCustomLayers(options) {
        let self = this;
        if (options && !self._options.changes.period  && !self._options.changes.level){
            if (options.hasOwnProperty("displayCustomLayers")){
                let layers = options.displayCustomLayers;
                for (let key in options.displayCustomLayers){
                    let checkbox = $("#" + key);
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
    checkConfiguration() {
        let self = this;
        let state = this._stateStore.current();
        ThemeYearConfParams.actions.forEach(function(action){
            self.mapActions(action);
        });
        ThemeYearConfParams.actions = [];

        // warning if scope wasn't selected properly
        if (this._options.changes.scope && !this._options.changes.dataview){
            if (this._dataset === ThemeYearConfParams.dataset){
                console.warn(Logger.logMessage(Logger.LEVEL_WARNING, "FrontOffice", "checkConfiguration", "missingDataset"));
            }
        }

        // handle active dataset
        if (this._options.changes.dataview){
            this._dataset = this._options.config.dataset;
        } else {
            this._dataset = ThemeYearConfParams.dataset;
        }

        if (this._previousDataset !== this._dataset && !this._options.changes.dataview){
            this._dispatcher.notify('scope#activeScopeChanged', {activeScopeKey: Number(self._dataset)});
            this._previousDataset = Number(this._dataset);
        }

		// handle active places
		if (!this._options.changes.dataview){
			let places;
			if (state.place && state.place !== "All places" && typeof state.place === "string"){
				places = [(Number(state.place))];
			} else if (state.locations){
				places = state.locations;
			} else {
				places = state.allPlaces;
			}
			this._dispatcher.notify('place#setActivePlace', {data: places});
		}
    };

    /**
     * Map ext actions to options.changes
     * @param action {string}
     */
    mapActions(action) {
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
            default:
                break;
        }
    };

    /**
     * Get default position in the map according to configuration
     * @param [options] {Object} Optional. Settings from dataview
     * @return position {WorldWind.Position}
     */
    getPosition(options){
        if (options && options.worldWindState){
            return options.worldWindState.location;
        } else {
            let places = this._stateStore.current().objects.places;
            let locations;
            if(places.length === 1 && places[0]){
                locations = places[0].get('bbox').split(',');
            } else {
                places = this._stateStore.current().allPlaces.map(function(place) {
                    return Ext.StoreMgr.lookup('location').getById(place);
                });
                locations = this.getBboxForMultiplePlaces(places);
            }

            if(locations.length !== 4) {
                console.warn('WorldWindWidget#getPosition Incorrect locations: ', locations);
                return;
            }
            let position = new WorldWind.Position((Number(locations[1]) + Number(locations[3])) / 2, (Number(locations[0]) + Number(locations[2])) / 2, 1000000);

            return position;
        }
    }

    /**
     * It combines bboxes of all places to get an extent, which will show all of them.
     * @param places
     * @returns {*}
     */
    getBboxForMultiplePlaces(places) {
        if(places.length === 0) {
            return [];
        }

        let minLongitude = 180;
        let maxLongitude = -180;
        let minLatitude = 90;
        let maxLatitude = -90;

        let locations;
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
    }

    /**
     * Adjust FO view
     * @param options {Object} settings from dataview
     */
    adjustConfiguration(options){
        let state = this._stateStore.current();
        let htmlBody = $("body");
        let self = this;

        this._scopesStore.byId(state.scope).then(function(scopes){
            let scope = scopes[0];
			if (scope && scope.isMapIndependentOfPeriod && scope.isMapDependentOnScenario){
				self._dispatcher.notify("fo#mapIsDependentOnScenario");
				self._dispatcher.notify("fo#mapIsIndependentOfPeriod");
			} else if (scope && scope.isMapIndependentOfPeriod && !scope.isMapDependentOnScenario){
				self._dispatcher.notify("fo#allowMapAdding");
				self._dispatcher.notify("fo#mapIsIndependentOfPeriod");
			} else if (scope && !scope.isMapIndependentOfPeriod && scope.isMapDependentOnScenario){
				self._dispatcher.notify("fo#mapIsDependentOnScenario");
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
            if (options && (_.isEmpty(state.changes) || (!state.changes.dataview && (state.changes.scope || state.changes.location)))){
                let position = self.getPosition(options);
                self._mapsContainer.setAllMapsPosition(position);
            }

            /**
             * Apply settings from dataview, if exists
             */
            if (options && !self._dataviewSettingsUsed){
                self._dispatcher.notify('scope#activeScopeChanged', {activeScopeKey: Number(options.scope)});
                self._previousDataset = options.scope;
                self._dataviewSettingsUsed = true;
                self.applySettingsFromDataview(options);
            }
        });
    }

    /**
     * Apply dataview settings
     * @param options {Object} settings
     */
    applySettingsFromDataview(options){
        this._stateStore._changes = {
            dataview: true
        };
		if (options.worldWindState){
			this.setMapsFromDataview(options.worldWindState);
			this._stateStore.setAllowZoomByCase(false);
		}
        if (options.widgets){
            this._topToolBar.handleDataview(options.widgets);
        }
		if (options.components){
			this._dispatcher.notify('components#applyFromDataview', {windows: options.components.windows});
		}
        if (options.locations){
            this._dispatcher.notify('place#setActivePlace', {data: options.locations});
        }
		if (options.scenarios){
			this._dispatcher.notify('scenarios#applyFromDataview', {scenarios: options.scenarios, worldWindState: options.worldWindState});
		}
        if (options.mapsMetadata){
            this._mapsContainer.handleMapsFromDataview(options.mapsMetadata, options.selectedMapId);
        }
        if (options.mapDefaults){
            this._mapsContainer.handleMapDefaultsFromDataview(options.mapDefaults);
        }
    }

    setMapsFromDataview(worldWindState){
        this._mapsContainer.setAllMapsPosition(worldWindState.location);

        if(worldWindState.hasOwnProperty('considerElevation') && worldWindState.considerElevation) {
			// let elevationAtLocation = this._mapsContainer.getElevationAtLocation(worldWindState.location);
			this._mapsContainer.setAllMapsRange((worldWindState.range + 1200) * 1.5);
        } else {
			this._mapsContainer.setAllMapsRange(worldWindState.range);
        }

		if (worldWindState.is2D && this._stateStore.current().isMap3D){
			this._dispatcher.notify('map#switchProjection');
		}
	}

    /**
     * Handle periods according to scope setting
     */
    handlePeriods(){
        let state = this._stateStore.current();
        if (state.isMapIndependentOfPeriod || state.isMapDependentOnScenario){
            this._store.periods.notify('periods#default')
        } else {
            this._store.periods.notify('periods#rebuild');
        }
    }

    /**
     * Load metadata from server
     */
    loadData(store) {
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
    toggleExtComponents(action){
        if (!Config.toggles.useTopToolbar) {
            let sidebarTools = $("#sidebar-tools");
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

    }

    /**
     * @param type {string} type of event
     * @param options {Object}
     */
    onEvent(type, options) {
        if(type === Actions.adjustConfiguration) {
            this.adjustConfiguration();
        } else if (type === Actions.adjustConfigurationFromDataview){
            var self = this;
            this._store.locations.load().then(function(){
                self.adjustConfiguration(options);
            });
        } else if (type === "dataview#setMapsFromDataview"){
        	this.setMapsFromDataview(options);
		} else if (type === Actions.userChanged){
			this._store.scopes.load();
        }
    }
}

export default FrontOffice;