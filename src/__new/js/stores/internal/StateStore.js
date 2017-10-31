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
		return Ext.StoreMgr.lookup('dataset').getById(this.scope()).data;
	};

	StateStore.prototype.scope = function() {
		var selectedDataset = Ext.ComponentQuery.query('#seldataset') && Ext.ComponentQuery.query('#seldataset')[0] && Ext.ComponentQuery.query('#seldataset')[0].getValue() || null;
		var initialDataset = Ext.ComponentQuery.query('#initialdataset') && Ext.ComponentQuery.query('#initialdataset')[0] && Ext.ComponentQuery.query('#initialdataset')[0].getValue() || null;
		return selectedDataset || initialDataset;
	};

	StateStore.prototype.placesObjects = function() {
		var defaultPlaces = Ext.ComponentQuery.query('#sellocation')[0].getValue() || Ext.ComponentQuery.query('#initiallocation')[0].getValue();
		if(defaultPlaces != 'custom') {
			return [Ext.StoreMgr.lookup('location').getById(defaultPlaces)];
		} else {
			// Load all places for the scope.
            return this.placesForScope();
		}

		// if(defaultPlaces != 'custom') {
		// 	return [Ext.StoreMgr.lookup('location').getById(defaultPlaces)];
		// } else {
		// 	// Load all places for the scope.
		// 	return Ext.StoreMgr.lookup('location').filter('dataset', this.scope());
		// }
	};

	StateStore.prototype.places = function() {
		var defaultPlaces = Ext.ComponentQuery.query('#sellocation')[0].getValue() || Ext.ComponentQuery.query('#initiallocation')[0].getValue();
		if(defaultPlaces != 'custom') {
			return [defaultPlaces];
		} else {
			// Load all places for the scope.
			return this.placesForScope();
		}

		// if(defaultPlaces != 'custom') {
		// 	return [defaultPlaces];
		// } else {
		// 	// Load all places for the scope.
		// 	return Ext.StoreMgr.lookup('location').filter('dataset', this.scope()).map(function (location) {
		// 		return location._id;
		// 	});
		// }
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

	StateStore.prototype.periods = function() {
		return Ext.ComponentQuery.query('#selyear')[0].getValue();
	};

	StateStore.prototype.analyticalUnitLevel = function() {
		return Ext.StoreMgr.lookup('dataset').getById(this.scope()).get('featureLayers')[0];
	};

	return StateStore;
});