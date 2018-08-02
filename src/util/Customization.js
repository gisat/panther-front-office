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
 * @param options.store.state {StateStore}
 * @constructor
 */
let $ = window.$;
class Customization {
    constructor(options) {
        Ext = window.Ext;
        if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'Customization', 'constructor', 'Stores must be provided'));
        }

        if(!options.store.locations){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'Customization', 'constructor', 'Store locations must be provided'));
        }
        if(!options.store.themes){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'Customization', 'constructor', 'Stores themes be provided'));
        }
        if(!options.store.scopes){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'Customization', 'constructor', 'Stores scopes be provided'));
        }
        if(!options.store.state){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'Customization', 'constructor', 'State store should be provided'));
        }

        this._dispatcher = options.dispatcher;
        this._useWorldWindOnly = options.useWorldWindOnly;
        this._skipSelection = options.skipSelection;
        this._store = options.store;
        this._stateStore = options.store.state;

        if (this._skipSelection){
            this._dispatcher.addListener(this.skipSelection.bind(this));
        } else if (this._useWorldWindOnly){
            this._dispatcher.addListener(this.useWorldWind.bind(this));
        }

        this._dispatcher.addListener(this.onEvent.bind(this));
    };

    /**
     * Skip initaial scope, location, theme selection
     * @param action {string} type of event
     */
    skipSelection(action) {
        if (action === Actions.extLoaded){
            var self = this;
            this.getFirstScopeLocationTheme().then(function(configuration){
                Ext.ComponentQuery.query('#initialdataset')[0].setValue(configuration.scope.id);
                setTimeout(function(){
                    Ext.ComponentQuery.query('#initialtheme')[0].setValue(configuration.theme.id);
                    Ext.ComponentQuery.query('#initiallocation')[0].setValue(configuration.location.id);
                    self.confirmInitialSelection();
                },500);
            });
        }
    };

    /**
     * Check if stores are loaded, then confirm selection
     */
    confirmInitialSelection() {
        var visStore = Ext.StoreMgr.lookup('visualization4sel');
        var yearStore = Ext.StoreMgr.lookup('year4sel');
        var themeStore = Ext.StoreMgr.lookup('theme');
        if (!visStore.loading && !yearStore.loading && !themeStore.loading){
            this._dispatcher.notify("confirmInitialSelection");
            if (this._useWorldWindOnly){
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
        if (action === Actions.extThemeYearLoaded && !this._skipSelection){
            this._dispatcher.notify("map#switchFramework");
        }
    };

    /**
     * Get default scope, location and theme
     */
    getFirstScopeLocationTheme() {
        var self = this;
        return this.getFirstScope().then(function(scope){
            var configuration = {
                scope: scope
            };
            return self.getFirstLocation(scope.id).then(function(location){
                configuration["location"] = location;
                return configuration;
            }).then(function(configuration){
                return self.getFirstTheme(configuration.scope.id).then(function(theme){
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
        return this._store.themes.filter({dataset: scopeId}).then(function(themes){
            return themes[0];
        });
    };

    /**
     * Get first scope from store
     *
     */
    getFirstScope() {
        return this._store.scopes.all().then(function(scopes){
            return scopes[0];
        });
    };

    // TODO: FIXME
    isDromasAdmin(user) {
        let isDromasAdmin = false;
        user.groups.forEach(group => {
            if(group.name === 'Aktualizace LPIS admin') {
                isDromasAdmin = true;
            }
        });
        return isDromasAdmin || user.isAdmin;
    }

    /**
     * Handle user restrictions
     * @param options {Object}
     */
    handleUser(){
        var user = this._stateStore.current().user;
        var scope = this._stateStore.current().scope;
        var mapsContainerBottomBar = $('#maps-container-bar-bottom');
        var toolBar = $("#top-toolbar");
        var mapsContainer = $("#maps-container");
        var uploadDataBtn = $("#upload-data");
		var scopeSelectionSwitchBtn = $("#scope-selection-switch");
        var originalScopeSelectionBtn = $("#overlay-switch");
        var self = this;

        if (user.isAdmin){
            originalScopeSelectionBtn.addClass("open");
			scopeSelectionSwitchBtn.addClass("open");
        } else {
            originalScopeSelectionBtn.removeClass("open");
			scopeSelectionSwitchBtn.removeClass("open");
        }

        if(this.isDromasAdmin(user) || user.isAdmin) {
            uploadDataBtn.addClass("open");
            uploadDataBtn.off("click").on("click", function(){
				self._dispatcher.notify("header#uploadDataClick");
            });
        } else {
            uploadDataBtn.removeClass("open");
        }

        this._store.scopes.byId(scope).then(function(scopes){
            var scope = scopes[0];
            var signUpBtn = $(".signup");
            var separator = $(".user .sep");

            // handle logging buttons
            // todo use the first one
            if (scope && scope.restrictEditingToAdmins && !self.isDromasAdmin(user) && !signUpBtn.hasClass('logout')){
                // if (scope && !user.isAdmin && !signUpBtn.hasClass('logout')){
                signUpBtn.css("display", "none");
                separator.css("display", "none");
            } else {
                signUpBtn.css("display", "inline-block");
                if (signUpBtn.html()){
					separator.css("display", "inline-block");
                }
            }

            // handle timeline
            if (scope && scope.restrictEditingToAdmins && !self.isDromasAdmin(user)){
                mapsContainerBottomBar.removeClass("open");
                toolBar.addClass("hidden");
                mapsContainer.addClass("extended");

            } else {
                if (scope && scope.showTimeline){
                    mapsContainerBottomBar.addClass("open");
                }
                toolBar.removeClass("hidden");
                mapsContainer.removeClass("extended")
            }

        }).catch(function(err){
            console.log(`#### Customization@handleUser: err`, err);
        });
    }

    /**
     * Adjust application on scope change
     * @param options {Object}
     */
    onScopeChange(options){
        var mapsContainerBottomBar = $('#maps-container-bar-bottom');

        this._store.scopes.byId(options.activeScopeKey).then(function(scopes){
            var scope = scopes[0];

            // handle view selection
            if (scope && scope.viewSelection){
                var header = $("#header");
                header.find("h1").css("display", "none");
                header.find(".menu").css("display", "none");
                header.find("#header-view-selection").css("display", "inline-block");
            }

            // handle timeline
            if (scope && scope.showTimeline){
                mapsContainerBottomBar.addClass("open");
            } else {
                mapsContainerBottomBar.removeClass("open");
            }

        }).catch(function(err){
            throw new Error(err);
        });
    }

    onEvent(type, options){
        if (type === Actions.scopeActiveChanged){
            this.onScopeChange(options);
        }
        if (type === Actions.scopeActiveChanged || type === Actions.customizationUserChanged){
            this.handleUser(options);
        }
    }
}

export default Customization;