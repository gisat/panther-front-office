import Actions from '../actions/Actions';
import ArgumentError from '../error/ArgumentError';
import CustomLayers from './CustomLayers';
import Floater from '../util/Floater';
import Logger from '../util/Logger';
import Uuid from '../util/Uuid';

let Config = window.Config;
let polyglot = window.polyglot;
let Ext;
let Stores = window.Stores;

let $ = window.$;
/**
 * @param options {Object}
 * @param options.dispatcher {Object} Object for handling events in the application.
 * @param options.store {Object}
 * @param options.store.scope {Scopes}
 * @param options.store.state {StateStore}
 * @constructor
 */
class TopToolBar {
    constructor(options) {
        Ext = window.Ext;
        if (!options.dispatcher){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "TopToolBar", "constructor", "missingDispatcher"));
        }
        if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'TopToolBar', 'constructor', 'Stores must be provided'));
        }
        if(!options.store.scopes){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'TopToolBar', 'constructor', 'Scope store must be provided'));
        }
        if (!options.store.state){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "TopToolBar", "constructor", "missingStateStore"));
        }

        this._dispatcher = options.dispatcher;
        this._scopeStore = options.store.scopes;
        this._stateStore = options.store.state;
        this._mapStores = options.store.map;

        this._target = $('#top-toolbar-widgets');
        this._target.on('click.topToolBar', '.item', this.handleClick.bind(this));
        this.build();

        this._map3dSwitchSelector = $('#top-toolbar-3dmap');

        $('#top-toolbar-context-help').on('click.topToolBar', this.handleContextHelpClick);
        $('#top-toolbar-share-view').on('click.topToolBar', this.handleShareViewClick.bind(this));
        $('#top-toolbar-add-map').on('click.topToolBar', this.handleAddMapClick.bind(this));
        this._map3dSwitchSelector.on("click.topToolBar", this.handle3dMapClick.bind(this));

        this._dispatcher.addListener(this.onEvent.bind(this));
    };


    build() {
        let tools = {
            layers: true,
            areas: true,
            selections: true,
            areasFilterNew: true,
            mapTools: true,
            addLayer: true,
            customLayers: true,
            functionalFilrer: false,
            share: true,
            snapshot: true,
            contextHelp: true,
            osm: false,
            views: true,
            snapshots: true,
        };


        if (Config.toggles.hasFunctionalUrbanArea){
            tools.functionalFilrer = true;
        }
        if (Config.toggles.hasNewEvaluationTool) {
            tools.areasFilterNew = true;
        } else {
            tools.areasFilterOld = true;
        }
        if (Config.toggles.isSnow) {
            tools = this.handleSnow();
        }

        let self = this;
        this.handleScopeSettings(tools).then(function(tools){
            self.renderFeatures(tools);
            self.hideTools(tools);
        });
    };

    hideTools(tools) {
        if (!tools.share){
            $('#top-toolbar-share-view').css("display", "none")
        }
        if (!tools.contextHelp){
            $('#top-toolbar-context-help').css("display", "none")
        }
    }

    renderFeatures(tools) {
        this._target.empty();

        if (tools.layers){
            let classesLayers3d = $('#floater-world-wind-widget').hasClass('open') ? "item open" : "item";
            this._target.append('<div class="' + classesLayers3d + '" id="top-toolbar-layers" data-for="floater-world-wind-widget"><span>'+polyglot.t('layers')+'</span></div>');
        }
        if (tools.areas){
            let classesAreas3d = $('#window-areatree').hasClass('open') ? "item open" : "item";
            this._target.append('<div class="' + classesAreas3d + '" id="top-toolbar-areas" data-for="window-areatree"><span>'+polyglot.t('areas')+'</span></div>');
        }
        if (tools.osm){
            let classesOsm3d = $('#floater-osm-widget').hasClass('open') ? "item open" : "item";
            this._target.append('<div class="' + classesOsm3d + '" id="top-toolbar-osm" data-for="floater-osm-widget"><span>'+polyglot.t('osm')+'</span></div>');
        }
        if (tools.selections){
            let classesSelections3d = $('#window-colourSelection').hasClass('open') ? "item open" : "item";
            this._target.append('<div class="' + classesSelections3d + '" id="top-toolbar-selections" data-for="window-colourSelection"><span>'+polyglot.t('selections')+'</span></div>');
        }
        if (tools.areasFilterNew){
            let classesAreasFilter3d = $('#floater-evaluation-widget').hasClass('open') ? "item open" : "item";
            this._target.append('<div class="' + classesAreasFilter3d + '" id="top-toolbar-selection-filter" data-for="floater-evaluation-widget"><span>'+polyglot.t('areasFilter')+'</span></div>');
        }
        if (tools.areasFilterOld){
            let classesLegacyAreasFilter3d = $('#window-legacyAdvancedFilters').hasClass('open') ? "item open" : "item";
            this._target.append('<div class="' + classesLegacyAreasFilter3d + '" id="top-toolbar-selection-filter" data-for="window-legacyAdvancedFilters"><span>'+polyglot.t('areasFilter')+'</span></div>');
        }
        if (tools.mapTools){
            let classesMapTools3d = $('#floater-map-tools-widget').hasClass('open') ? "item open" : "item";
            this._target.append('<div class="' + classesMapTools3d + '" id="top-toolbar-map-tools" data-for="floater-map-tools-widget"><span>'+polyglot.t('mapTools')+'</span></div>');
        }
        if (tools.customLayers){
            let classesCustomLayers = $('#floater-custom-integration-layers').hasClass('open') ? "item open" : "item";
            this._target.append('<div class="' + classesCustomLayers + '" id="top-toolbar-custom-integration-layers" data-for="floater-custom-integration-layers"><span>'+polyglot.t('addLayer')+'</span></div>');
        }
        if (tools.snow){
            let classesSnowWidget3d = $('#floater-snow-widget').hasClass('open') ? "item open" : "item";
            this._target.append('<div class="' + classesSnowWidget3d + '" id="top-toolbar-snow-configuration" data-for="floater-snow-widget"><span>'+polyglot.t('savedConfigurations')+'</span></div>');
        }
        if (tools.scenarios){
            let classesScenarios = this._scenariosWidgetIsOpen ? "item open" : "item";
            this._target.append('<div class="' + classesScenarios + '" id="top-toolbar-scenarios"><span>'+polyglot.t('scenarios')+'</span></div>');
        }
        if (tools.snapshots){
            let classesSnapshots = this._snapshotsWidgetIsOpen ? "item open" : "item";
            this._target.append('<div class="' + classesSnapshots + '" id="top-toolbar-snapshots"><span>'+polyglot.t('snapshots')+'</span></div>');
        }
        if (tools.views){
            let classesViews = this._viewsWidgetIsOpen ? "item open" : "item";
            this._target.append('<div class="' + classesViews + '" id="top-toolbar-views"><span>'+polyglot.t('views')+'</span></div>');
        }
    };

    /**
     * Hide top toolbar tools according to additional scope settings
     * @param tools {Object} default tools visibility
     * @returns {Object} adjusted tools visibility
     */
    handleScopeSettings(tools) {
        let activeScope = this._stateStore.current().scope;
        if (activeScope){
            return this._scopeStore.byId(activeScope).then(function(scopes){
                if (scopes && scopes.length && scopes[0].removedTools){
                    let removedTools = scopes[0].removedTools;
                    removedTools.forEach(function(tool){
                        if (tool === 'layers'){
                            tools.layers = false;
                        }
                        if (tool === 'areas'){
                            tools.areas = false;
                        }
                        if (tool === 'selections'){
                            tools.selections = false;
                        }
                        if (tool === 'areasFilter'){
                            tools.areasFilterNew = false;
                        }
                        if (tool === 'mapTools'){
                            tools.mapTools = false;
                        }
                        if (tool === 'customLayers'){
                            tools.customLayers = false;
                        }
                        if (tool === 'share'){
                            tools.share = false;
                        }
                        if (tool === 'snapshot'){
                            tools.snapshot = false;
                        }
                        if (tool === 'contextHelp'){
                            tools.contextHelp = false;
                        }
                    });
                }

                if (scopes[0].scenarios) {
					tools.scenarios = true;
				}

				return tools;
            }).catch(function(err){
                throw new Error(err);
            });
        } else {
            return Promise.resolve(tools);
        }
    }

    /**
     * SNOW: add configuration widget only
     */
    handleSnow() {
        // hide layers floater
        $("#floater-world-wind-widget").css("display", "none");

        return {
            snow: true
        };
    };

    handleClick(e) {
		if ($(e.currentTarget).attr("id") === 'top-toolbar-scenarios'){
			Stores.notify("component#scenarioButtonClick");
		} else if ($(e.currentTarget).attr("id") === 'top-toolbar-views'){
			Stores.notify("component#viewsButtonClick");
		} else if ($(e.currentTarget).attr("id") === 'top-toolbar-snapshots'){
			Stores.notify("component#snapshotsButtonClick");
		} else {
			let targetId = e.target.getAttribute('data-for');
			if (!targetId){
				targetId = $(e.currentTarget).attr("data-for");
			}

			if (targetId) {
				if (targetId === 'window-customLayers') this.initCustomLayersWindow();

				let floater = $('#' + targetId);
				floater.toggleClass('open');

				let type = targetId.split("-")[0];
				if (type === "window"){
					window.Stores.notify('floaters#sort', {
						fromExt: false,
						xWindowJQuerySelector: floater[0]
					});
				} else {
					window.Stores.notify('floaters#sort', {
						fromExt: false,
						floaterJQuerySelector: floater
					});
				}
				$(e.currentTarget).toggleClass('open');
				Stores.notify("widget#changedState", {floater: floater});
			}
		}
    };

    handleHideClick(targetId) {
        if (targetId) {
            $('#' + targetId).removeClass('open');
            this._target.find('div[data-for="' + targetId + '"]').removeClass('open');
        }
    };

    initCustomLayersWindow() {
        let component = $('#custom-layers-container');
        if (!component.length) {
            new CustomLayers({
                stateStore: this._stateStore
            });
        }
    };

    handleContextHelpClick(e) {
    };

    handleShareViewClick(e) {
        let shareItem = $('#top-toolbar-share-view');
        const isOpen = shareItem.hasClass('open');
        this._dispatcher.notify("components#shareSetVisible", !isOpen);
    };

    handle3dMapClick(e) {
        this._dispatcher.notify("map#switchProjection");
        $('#top-toolbar-3dmap span').toggleClass('world-wind-2d');
    };

    /**
     * @param enable {boolean} if true, item should be enabled
     */
    handle3dMapButtonState(enable){
        if (enable){
            this._map3dSwitchSelector.removeClass("disabled");
        } else {
            this._map3dSwitchSelector.addClass("disabled");
        }
    }

    /**
     * Show hide button for new map adding
     * @param value {string} CSS display value
     */
    handleAddMapButton(value){
        $('#top-toolbar-add-map').css('display', value);
    }

    /**
     * @param active {boolean} false, if button for map adding should be disabled
     */
    handleMapButtonActivity(active){
        let state = this._stateStore.current();
        let button = $('#top-toolbar-add-map');
        if (state.isMapIndependentOfPeriod && !state.isMapDependentOnScenario){
            if (active){
                button.removeClass("disabled");
            } else {
                button.addClass("disabled");
            }
        }
    }

    /**
     * Handle click on Add map button
     */
    handleAddMapClick(){
        this._dispatcher.notify('mapsContainer#addMap');
        this._dispatcher.notify('worldWindWidget#rebuild');
    }

    /**
     * Set top tool bar items state and wingets state according to dataview configuration
     * @param widgets {Object}
     */
    handleDataview(widgets) {
        let openWidgets = widgets.open;
        let self = this;
        openWidgets.forEach(function(widget){
            let floater = $('#' + widget.floater.id);
            let toolbarItem = $('#' + widget.topToolbarItem.id);
            floater.addClass("open");
            toolbarItem.addClass("open");
            if (widget.floater.pinned){
                self._dispatcher.notify('widget#pin', {floaterId: widget.floater.id});
            } else {
                Floater.setPosition(floater, widget.floater.position);
            }
        });
    };

    /**
     * @param type {string} type of event
     * @param options {Object}
     */
    onEvent(type, options){
		if (type === Actions.toolBarEnable3d){
			this.handle3dMapButtonState(true);
		} else if (type === Actions.toolBarDisable3d){
			this.handle3dMapButtonState(false);
		} else if (type === Actions.toolBarClick3d){
			this.handle3dMapClick();
		} else if (type === Actions.foAllowMapAdding){
			this.handleAddMapButton('inline-block');
		} else if (type === Actions.foMapIsDependentOnPeriod){
			this.handleAddMapButton('none');
		} else if (type === Actions.mapsContainerDisableAdding){
			this.handleMapButtonActivity(false);
		} else if (type === Actions.mapsContainerEnableAdding){
			this.handleMapButtonActivity(true);
		} else if (type === 'Tools.hideClick'){
		    this.handleHideClick(options.targetId);
        } else if (type === 'SCENARIOS_WINDOW_TOGGLE'){
		    let scenariosItem = $('#top-toolbar-scenarios');
		    let isOpen = scenariosItem.hasClass('open');
			this._scenariosWidgetIsOpen = !isOpen;
			scenariosItem.toggleClass('open');
		} else if (type === 'SNAPSHOTS_WINDOW_TOGGLE'){
			let snapshotsItem = $('#top-toolbar-snapshots');
			let isOpen = snapshotsItem.hasClass('open');
			this._snapshotsWidgetIsOpen = !isOpen;
			snapshotsItem.toggleClass('open');
		} else if (type === 'DATAVIEWS_WINDOW_TOGGLE'){
			let viewsItem = $('#top-toolbar-views');
			let isOpen = viewsItem.hasClass('open');
			this._viewsWidgetIsOpen = !isOpen;
			viewsItem.toggleClass('open');
		} else if (type === 'SHARE_WINDOW_TOGGLE'){
			let shareItem = $('#top-toolbar-share-view');
            shareItem.removeClass('open');
            //{bool} options - open or closed
            if(options) {
                shareItem.addClass('open');
            }
		}
    }
}

export default TopToolBar;