import _ from 'underscore';

import Actions from '../../actions/Actions';
import ArgumentError from '../../error/ArgumentError';
import Floater from '../../util/Floater';
import Logger from '../../util/Logger';

let ThemeYearConfParams = window.ThemeYearConfParams;
let Ext;


/**
 * This store is the ultimate source of truth about current state of the application. Everything else updates it
 * and everything that needs something from it, is notified.
 * @constructor
 * @param options {Object}
 * @param options.store {Object}
 * @param options.store.maps {MapStore} Store containing current maps.
 */
let $ = window.$;
class StateStore {
    constructor(options) {
        Ext = window.Ext;
        if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'StateStore', 'constructor', 'Stores must be provided'));
        }
        if (!options.dispatcher){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MapStore", "constructor", "Dispatcher must be provided"));
        }

        this._dispatcher = options.dispatcher;
        this._changes = {};

        this._loadingOperations = [];
        this._store = options.store;
        this._aoiLayer = null;
        this._activeAoi = null;
        this._previousAoi = null;
        this._selectedMapId = null;
        this._user = {
            isLoggedIn: false,
            isAdmin: false
        };

        this.isMap3D = true;
        this.isMapIndependentOfPeriod = false;

        window.Stores.addListener(this.onEvent.bind(this), "initialLoading");
        window.Stores.hasStateStore = true;
        window.Stores.state = this;
    };

    /**
     * It returns complete information about the current state. At some point in time, it will be simply stored probably
     * in URL and therefore will be accessible to outside.
     * todo remove dependency on ThemeYearConfParams global object
     */
    current() {
        return {
            scope: this.scope(),
            scopeFull: this.scopeFull(),
            theme: ThemeYearConfParams.theme,
            places: this.places(),
            place: ThemeYearConfParams.place,
            allPlaces: ThemeYearConfParams.allPlaces,
            allPeriods: ThemeYearConfParams.allYears,
            currentAuAreaTemplate: ThemeYearConfParams.auCurrentAt,
            auRefMap: ThemeYearConfParams.auRefMap,

            analyticalUnitLevel: this.analyticalUnitLevel(),

            periods: this.periods(),

            objects: {
                places: this.placesObjects()
            },
            changes: this._changes,

            aoiLayer: this._aoiLayer,
            activeAoi: this._activeAoi,
            previousAoi: this._previousAoi,
            isMap3D: this.isMap3D,
            isMapIndependentOfPeriod: this.isMapIndependentOfPeriod,
            mapDefaults: this._mapDefaults,
            mapsMetadata: this._mapsMetadata,
            selectedMapId: this._selectedMapId,
            user: this._user,
            widgets: this.widgets(),
            withoutAoi: this._withoutAoi,
            worldWindNavigator: this.getNavigatorState()
        }
    };

    /**
     * Extended current state for sharing
     */
    currentExtended() {
        return _.extend(this.current(), {
            widgets: this.widgets(),
            worldWindNavigator: this._store.maps.getNavigatorState()
        });
    };

    /**
     * Set what changed after last action in Ext UI
     * @param changes {Object}
     */
    setChanges(changes) {
        this._changes = changes;
    };


    /**
     * Reset changes to default
     */
    resetChanges() {
        this._changes = {
            dataview: false,
            scope: false,
            location: false,
            theme: false,
            period: false,
            level: false,
            visualization: false
        }
    };

    scopeFull() {
        let scope = this.scope();
        if (!scope) {
            return null;
        }
        return Ext.StoreMgr.lookup('dataset').getById(this.scope()).data;
    };

    scope() {
        let selectedDataset = (Ext.ComponentQuery.query('#seldataset') && Ext.ComponentQuery.query('#seldataset')[0] && Ext.ComponentQuery.query('#seldataset')[0].getValue()) || null;
        let initialDataset = (Ext.ComponentQuery.query('#initialdataset') && Ext.ComponentQuery.query('#initialdataset')[0] && Ext.ComponentQuery.query('#initialdataset')[0].getValue()) || null;
        return selectedDataset || initialDataset;
    };

    placesObjects() {
        let selectedPlaces = (Ext.ComponentQuery.query('#sellocation') && Ext.ComponentQuery.query('#sellocation')[0] && Ext.ComponentQuery.query('#sellocation')[0].getValue()) || null;
        let initialPlaces = (Ext.ComponentQuery.query('#initiallocation') && Ext.ComponentQuery.query('#initiallocation')[0] && Ext.ComponentQuery.query('#initiallocation')[0].getValue()) || null;
        let defaultPlaces = selectedPlaces || initialPlaces;
        if (!defaultPlaces) {
            return null;
        } else if (defaultPlaces !== 'custom') {
            return [Ext.StoreMgr.lookup('location').getById(defaultPlaces)];
        } else {
            // Load all places for the scope.
            return this.placesForScopeObjects();
        }
    };

    places() {
        let selectedPlaces = (Ext.ComponentQuery.query('#sellocation') && Ext.ComponentQuery.query('#sellocation')[0] && Ext.ComponentQuery.query('#sellocation')[0].getValue()) || null;
        let initialPlaces = (Ext.ComponentQuery.query('#initiallocation') && Ext.ComponentQuery.query('#initiallocation')[0] && Ext.ComponentQuery.query('#initiallocation')[0].getValue()) || null;
        let defaultPlaces = selectedPlaces || initialPlaces;
        if (!defaultPlaces) {
            return null;
        } else if (defaultPlaces !== 'custom') {
            return [defaultPlaces];
        } else {
            // Load all places for the scope.
            return this.placesForScope();
        }
    };

    placesForScope() {
        let scope = this.scope(),
            results = [];
        Ext.StoreMgr.lookup('location').each(function (record) {
            if (record.get('dataset') === scope) {
                results.push(record.get('_id'));
            }
        });
        return results;
    };

    placesForScopeObjects() {
        let scope = this.scope(),
            results = [];
        Ext.StoreMgr.lookup('location').each(function (record) {
            if (record.get('dataset') === scope) {
                results.push(record);
            }
        });
        return results;
    };

    periods() {
        return Ext.ComponentQuery.query('#selyear') && Ext.ComponentQuery.query('#selyear')[0] && Ext.ComponentQuery.query('#selyear')[0].getValue();
    };

    analyticalUnitLevel() {
        let scope = this.scope();
        if (!scope) {
            return null;
        }
        return Ext.StoreMgr.lookup('dataset').getById(scope).get('featureLayers')[0];
    };

    /**
     * Get state of widgets
     * @returns {{open: Array, minimized: Array}}
     */
    widgets() {
        var widgets = {
            open: [],
            minimized: [],
            disabled: []
        };
        var topToolBarItems = $("#top-toolbar-widgets").find(".item");
        topToolBarItems.each(function (index, i) {
            var item = $(i);
            if (item.length){
                var widget = {
                    topToolbarItem: {
                        id: item.attr("id")
                    },
                    floater: {
                        id: item.attr("data-for")
                    }
                };

                if (item.hasClass("open")){
                    var floater = $("#" + item.attr("data-for"));
                    widget.floater.position = Floater.getPosition(floater);
                    widget.floater.pinned = floater.hasClass("pinned");
                    widgets.open.push(widget);
                } else if (item.hasClass("disabled")){
                    widgets.disabled.push(widget);
                } else {
                    widgets.minimized.push(widget);
                }
            }
        });
        return widgets;
    };


    /**
     * Add loading operation
     */
    addLoadingOperation(type) {
        this._loadingOperations.push(type);
        console.log("StateStore#addLoadingOperation: Loading operation added!");
        this.checkLoading(type);
    };

    /**
     * Remove loading operation
     */
    removeLoadingOperation(type) {
        let index = _.findIndex(this._loadingOperations, function (item) {
            return item === type
        });
        if (index !== -1) {
            this._loadingOperations.splice(index, 1);
            console.log("StateStore#removeLoadingOperation: Loading operation removed!");
            this.checkLoading(type);
        }
    };

    /**
     * Check operations. If no operation is present, wait 3 sec. and then hide loader. Otherwise show loader.
     */
    checkLoading(type) {
        clearTimeout(this._loading);
        if (this._loadingOperations.length === 0) {
            // wait 3 sec and then hide loader
            this._loading = setTimeout(function () {
                console.log("StateStore#checkLoading: *** HIDE LOADER ***!" + type);
                $("#loading-screen").css("display", "none");
            }, 3000);
        } else {
            console.log("StateStore#checkLoading: *** SHOW LOADER ***!" + type);
            $("#loading-screen").css("display", "block");
        }
    };

    getNavigatorState(){
        return this._navigatorState;
    }

    handleMapDependencyOnPeriod(isDependent){
        this.isMapIndependentOfPeriod = !isDependent;
    }

    handleMapProjection(){
        if (this.isMap3D){
            this.switchMapTo2D();
        } else {
            this.switchMapTo3D();
        }
    }

    setAoiLayer(options){
        this._aoiLayer = options;
    }

    setActiveAoi(aoiId){
        this._previousAoi = this._activeAoi;
        this._activeAoi = aoiId;
    }

    updateAoiLayer(layer){
        this._aoiLayer.layer = layer;
    }

    switchMapTo2D(){
        this.isMap3D = false;
        $("#top-toolbar-3dmap").removeClass("open");
        this._dispatcher.notify('map#switchTo2D');
    }

    switchMapTo3D(){
        this.isMap3D = true;
        $("#top-toolbar-3dmap").addClass("open");
        this._dispatcher.notify('map#switchTo3D');
    }

    updateMapsMetadata(options){
        if (options.maps){
            this._mapsMetadata = options.maps;
        }
        if (options.defaults){
            this._mapDefaults = options.defaults;
        }
    }

    updateUser(options){
        this._user = {
            isLoggedIn: options.isLoggedIn,
            isAdmin: options.isAdmin
        }
    }

    updateNavigator(options){
        this._navigatorState = options;
        this._dispatcher.notify("navigator#update");
    }

    onEvent(type, options) {
        if (type === "initialLoadingStarted"){
            this.addLoadingOperation("initialLoading");
        } else if (type === "initialLoadingFinished"){
            this.removeLoadingOperation("initialLoading");
        } else if (type === "appRenderingStarted"){
            this.addLoadingOperation("appRendering");
        } else if (type === Actions.mapControl) {
            this.updateNavigator(options);
        } else if (type === Actions.mapSwitchProjection){
            this.handleMapProjection();
        } else if (type === Actions.foMapIsIndependentOfPeriod){
            this.handleMapDependencyOnPeriod(false);
        } else if (type === Actions.foMapIsDependentOnPeriod){
            this.handleMapDependencyOnPeriod(true);
        } else if (type === Actions.scopeAoiLayer){
            this.setAoiLayer(options);
        } else if (type === Actions.scopeAoiLayerUpdate){
            this.updateAoiLayer(options);
        } else if (type === Actions.mapSelected){
            this._selectedMapId = options.id;
        } else if (type === Actions.userChanged){
            this.updateUser(options);
            this._dispatcher.notify('customization#userChanged');
        } else if (type === Actions.dataviewWithoutAoi){
            this._withoutAoi = options.status;
        }

        // notification from redux
        else if (type === 'REDUX_STORE_MAPS_CHANGED'){
            this.updateMapsMetadata(options);
        } else if (type === 'AOI_GEOMETRY_SET'){
            this.setActiveAoi(options.id);
        }
    };


}

export default StateStore;