define([], function () {
	/**
	 * This store is the ultimate source of truth about current state of the application. Everything else updates it
	 * and everything that needs something from it, is notified.
	 * @constructor
	 */
	var StateStore = function (options) {
		this._changes = {}
	};

	/**
	 * It returns complete information about the current state. At some point in time, it will be simply stored probably
	 * in URL and therefore will be accessible to outside.
	 * todo remove dependency on ThemeYearConfParams global object
	 */
	StateStore.prototype.current = function () {
		return {
			scope: this.scope(),
			scopeFull: this.scopeFull(),
			theme: ThemeYearConfParams.theme,
			places: this.places(),
			place: ThemeYearConfParams.place,
			allPlaces: ThemeYearConfParams.allPlaces,
			allPeriods: ThemeYearConfParams.allYears,
			currentAuAreaTemplate: ThemeYearConfParams.auCurrentAt,

			analyticalUnitLevel: this.analyticalUnitLevel(),

			periods: this.periods(),

			objects: {
				places: this.placesObjects()
			},
			changes: this._changes
		}
	};

	/**
	 * Set what changed after last action in Ext UI
	 * @param changes {Object}
	 */
	StateStore.prototype.setChanges = function(changes){
		this._changes = changes;
	};

	StateStore.prototype.scopeFull = function() {
		var scope = this.scope();
		if(!scope) {
			return null;
		}
		return Ext.StoreMgr.lookup('dataset').getById(this.scope()).data;
	};

	StateStore.prototype.scope = function() {
		var selectedDataset = Ext.ComponentQuery.query('#seldataset') && Ext.ComponentQuery.query('#seldataset')[0] && Ext.ComponentQuery.query('#seldataset')[0].getValue() || null;
		var initialDataset = Ext.ComponentQuery.query('#initialdataset') && Ext.ComponentQuery.query('#initialdataset')[0] && Ext.ComponentQuery.query('#initialdataset')[0].getValue() || null;
		return selectedDataset || initialDataset;
	};

	StateStore.prototype.placesObjects = function() {
		var selectedPlaces = Ext.ComponentQuery.query('#sellocation') && Ext.ComponentQuery.query('#sellocation')[0] && Ext.ComponentQuery.query('#sellocation')[0].getValue() || null;
		var initialPlaces = Ext.ComponentQuery.query('#initiallocation') && Ext.ComponentQuery.query('#initiallocation')[0] && Ext.ComponentQuery.query('#initiallocation')[0].getValue() || null;
		var defaultPlaces = selectedPlaces || initialPlaces;
		if(!defaultPlaces) {
			return null;
		} else if(defaultPlaces != 'custom') {
			return [Ext.StoreMgr.lookup('location').getById(defaultPlaces)];
		} else {
			// Load all places for the scope.
            return this.placesForScopeObjects();
		}
	};

	StateStore.prototype.places = function() {
        var selectedPlaces = Ext.ComponentQuery.query('#sellocation') && Ext.ComponentQuery.query('#sellocation')[0] && Ext.ComponentQuery.query('#sellocation')[0].getValue() || null;
        var initialPlaces = Ext.ComponentQuery.query('#initiallocation') && Ext.ComponentQuery.query('#initiallocation')[0] && Ext.ComponentQuery.query('#initiallocation')[0].getValue() || null;
        var defaultPlaces = selectedPlaces || initialPlaces;
        if(!defaultPlaces) {
            return null;
        } else if(defaultPlaces != 'custom') {
			return [defaultPlaces];
		} else {
			// Load all places for the scope.
			return this.placesForScope();
		}
	};

	StateStore.prototype.placesForScope = function() {
        var scope = this.scope(),
            results = [];
        Ext.StoreMgr.lookup('location').each(function(record){
            if(record.get('dataset') == scope) {
                results.push(record.get('_id'));
            }
        });
        return results;
	};

    StateStore.prototype.placesForScopeObjects = function() {
        var scope = this.scope(),
            results = [];
        Ext.StoreMgr.lookup('location').each(function(record){
            if(record.get('dataset') == scope) {
                results.push(record);
            }
        });
        return results;
    };

	StateStore.prototype.periods = function() {
		return Ext.ComponentQuery.query('#selyear') && Ext.ComponentQuery.query('#selyear')[0] && Ext.ComponentQuery.query('#selyear')[0].getValue();
	};

	StateStore.prototype.analyticalUnitLevel = function() {
		var scope = this.scope();
		if(!scope) {
			return null;
		}
		return Ext.StoreMgr.lookup('dataset').getById(scope).get('featureLayers')[0];
	};

	return StateStore;
});