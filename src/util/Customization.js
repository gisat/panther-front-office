import ArgumentError from '../error/ArgumentError';
import Actions from '../actions/Actions';
import Logger from '../util/Logger';

let Ext;

/**
 *
 * @param options {Object}
 * @param options.store {Object}
 * @param options.store.locations {Locations} Store containing locations
 * @param options.store.themes {Themes} Store containing Themes
 * @param options.store.scopes {Scopes} Store containing Scopes
 * @constructor
 */
class Customization {
    constructor(options) {
        Ext = window.Ext;
        if (!options.store) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'Customization', 'constructor', 'Stores must be provided'));
        }

        if (!options.store.locations) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'Customization', 'constructor', 'Store locations must be provided'));
        }
        if (!options.store.themes) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'Customization', 'constructor', 'Stores themes be provided'));
        }
        if (!options.store.scopes) {
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'Customization', 'constructor', 'Stores scopes be provided'));
        }

        this._dispatcher = options.dispatcher;
        this._useWorldWindOnly = options.useWorldWindOnly;
        this._skipSelection = options.skipSelection;
        this._store = options.store;

        if (this._skipSelection) {
            this._dispatcher.addListener(this.skipSelection.bind(this));
        } else if (this._useWorldWindOnly) {
            this._dispatcher.addListener(this.useWorldWind.bind(this));
        }
    };

    /**
     * Skip initaial scope, location, theme selection
     * @param action {string} type of event
     */
    skipSelection(action) {
        if (action === Actions.extLoaded) {
            let self = this;
            this.getFirstScopeLocationTheme().then(function (configuration) {
                Ext.ComponentQuery.query('#initialdataset')[0].setValue(configuration.scope.id);
                setTimeout(function () {
                    Ext.ComponentQuery.query('#initialtheme')[0].setValue(configuration.theme.id);
                    Ext.ComponentQuery.query('#initiallocation')[0].setValue(configuration.location.id);
                    self.confirmInitialSelection();
                }, 500);
            });
        }
    };

    /**
     * Check if stores are loaded, then confirm selection
     */
    confirmInitialSelection() {
        let visStore = Ext.StoreMgr.lookup('visualization4sel');
        let yearStore = Ext.StoreMgr.lookup('year4sel');
        let themeStore = Ext.StoreMgr.lookup('theme');
        if (!visStore.loading && !yearStore.loading && !themeStore.loading) {
            this._dispatcher.notify("confirmInitialSelection");
            if (this._useWorldWindOnly) {
                this._dispatcher.notify("map#switchFramework");
            }
        } else {
            setTimeout(this.confirmInitialSelection.bind(this), 1000);
        }
    };

    /**
     * Switch map to WorldWind
     */
    useWorldWind(action) {
        if (action === Actions.extThemeYearLoaded && !this._skipSelection) {
            this._dispatcher.notify("map#switchFramework");
        }
    };

    /**
     * Get default scope, location and theme
     */
    getFirstScopeLocationTheme() {
        let self = this;
        return this.getFirstScope().then(function (scope) {
            let configuration = {
                scope: scope
            };
            return self.getFirstLocation(scope.id).then(function (location) {
                configuration["location"] = location;
                return configuration;
            }).then(function (configuration) {
                return self.getFirstTheme(configuration.scope.id).then(function (theme) {
                    configuration["theme"] = theme;
                    return configuration;
                });
            });
        });
    };

    /**
     * Get first location for given scope
     * @param scopeId {number}
     */
    getFirstLocation(scopeId) {
        return this._store.locations.filter({dataset: scopeId}).then(function (locations) {
            return locations[0];
        });
    };

    /**
     * Get first theme for given scope
     * @param scopeId {number}
     */
    getFirstTheme(scopeId) {
        return this._store.themes.filter({dataset: scopeId}).then(function (themes) {
            return themes[0];
        });
    };

    /**
     * Get first scope from store
     *
     */
    getFirstScope() {
        return this._store.scopes.all().then(function (scopes) {
            return scopes[0];
        });
    };

}

export default Customization;