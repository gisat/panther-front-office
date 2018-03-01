import _ from 'underscore';


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
        if (!options.store) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'StateStore', 'constructor', 'Stores must be provided'));
        }
        if (!options.store.maps) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'StateStore', 'constructor', 'Store map must be provided'));
        }


        this._changes = {};
        this._loadingOperations = [];

        this._store = options.store;

        window.Stores.addListener(this.onEvent.bind(this), "initialLoading");
        window.Stores.hasStateStore = true;
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
            changes: this._changes
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
        let widgets = {
            open: [],
            minimized: [],
            disabled: []
        };
        let topToolBarItems = $("#top-toolbar-widgets").find(".item");
        topToolBarItems.each(function (index, i) {
            let item = $(i);
            if (item.length) {
                let widget = {
                    topToolbarItem: {
                        id: item.attr("id")
                    },
                    floater: {
                        id: item.attr("data-for")
                    }
                };

                if (item.hasClass("open")) {
                    let floater = $("#" + item.attr("data-for"));
                    widget.floater.position = Floater.getPosition(floater);
                    widget.floater.pinned = floater.hasClass("pinned");
                    widgets.open.push(widget);
                } else if (item.hasClass("disabled")) {
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

    onEvent(type) {
        if (type === "initialLoadingStarted") {
            this.addLoadingOperation("initialLoading");
        } else if (type === "initialLoadingFinished") {
            this.removeLoadingOperation("initialLoading");
        } else if (type === "appRenderingStarted") {
            this.addLoadingOperation("appRendering");
        }
    };


}

export default StateStore;