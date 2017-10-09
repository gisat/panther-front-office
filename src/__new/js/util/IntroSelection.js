define([
	'../actions/Actions',
	'./Promise',
	'../stores/Stores'
], function(Actions,
			Promise,
			Stores){

	var IntroSelection = function(options) {
		this._dispatcher = options.dispatcher;
		this._dispatcher.addListener(this.skip.bind(this))
	};

	/**
	 * Skip initaial scope, location, theme selection
	 * @param action {string} type of event
	 */
	IntroSelection.prototype.skip = function(action){
		if (action === Actions.extLoaded){
			var self = this;
			this.getFirstScopeLocationTheme().then(function(configuration){
				Ext.ComponentQuery.query('#initialdataset')[0].setValue(configuration.scope.id);
				setTimeout(function(){
					Ext.ComponentQuery.query('#initialtheme')[0].setValue(configuration.theme.id);
					Ext.ComponentQuery.query('#initiallocation')[0].setValue(configuration.location.id);
					setTimeout(function(){
						self._dispatcher.notify("confirmInitialSelection");
					},10);
				},10);
			});
		}
	};

	/**
	 * Get default scope, location and theme
	 */
	IntroSelection.prototype.getFirstScopeLocationTheme = function(){
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
	IntroSelection.prototype.getFirstLocation = function(scopeId){
		return Stores.retrieve('location').filter({dataset: scopeId}).then(function(locations){
			return locations[0];
		});
	};

	/**
	 * Get first theme for given scope
	 * @param scopeId {number}
	 */
	IntroSelection.prototype.getFirstTheme = function(scopeId){
		return Stores.retrieve('theme').filter({dataset: scopeId}).then(function(themes){
			return themes[0];
		});
	};

	/**
	 * Get first scope from store
	 *
	 */
	IntroSelection.prototype.getFirstScope = function(){
		return Stores.retrieve('scope').all().then(function(scopes){
			return scopes[0];
		});
	};

	return IntroSelection;
});