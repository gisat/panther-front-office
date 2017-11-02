define([
	'../actions/Actions',
	'./Promise',
	'../stores/Stores'
], function(Actions,
			Promise,
			Stores){

	var Customization = function(options) {
		this._dispatcher = options.dispatcher;
		this._useWorldWindOnly = options.useWorldWindOnly;
		this._skipSelection = options.skipSelection;

		if (this._skipSelection){
			if (Ext.isReady){
				this.skipSelection(Actions.extLoaded);
			} else {
				this._dispatcher.addListener(this.skipSelection.bind(this));
			}
		} else if (this._useWorldWindOnly){
			this._dispatcher.addListener(this.useWorldWind.bind(this));
		}
	};

	/**
	 * Skip initaial scope, location, theme selection
	 * @param action {string} type of event
	 */
	Customization.prototype.skipSelection = function(action){
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
	Customization.prototype.confirmInitialSelection = function(){
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
	Customization.prototype.useWorldWind = function(action){
		if (action === Actions.extThemeYearLoaded && !this._skipSelection){
			this._dispatcher.notify("map#switchFramework");
		}
	};

	/**
	 * Get default scope, location and theme
	 */
	Customization.prototype.getFirstScopeLocationTheme = function(){
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
	Customization.prototype.getFirstLocation = function(scopeId){
		return Stores.retrieve('location').filter({dataset: scopeId}).then(function(locations){
			return locations[0];
		});
	};

	/**
	 * Get first theme for given scope
	 * @param scopeId {number}
	 */
	Customization.prototype.getFirstTheme = function(scopeId){
		return Stores.retrieve('theme').filter({dataset: scopeId}).then(function(themes){
			return themes[0];
		});
	};

	/**
	 * Get first scope from store
	 *
	 */
	Customization.prototype.getFirstScope = function(){
		return Stores.retrieve('scope').all().then(function(scopes){
			return scopes[0];
		});
	};

	return Customization;
});