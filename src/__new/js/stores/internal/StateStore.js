define([], function () {
	/**
	 * This store is the ultimate source of truth about current state of the application. Everything else updates it
	 * and everything that needs something from it, is notified.
	 * @constructor
	 */
	var StateStore = function (options) {};

	/**
	 * It returns complete information about the current state. At some point in time, it will be simply stored probably
	 * in URL and therefore will be accessible to outside.
	 */
	StateStore.prototype.current = function () {
		return {
			scope: this.scope(),
			theme: null,
			places: this.places(),

			analyticalUnitLevel: this.analyticalUnitLevel(),

			periods: this._periods,

			objects: {
				places: this.placesObjects()
			}
		}
	};

	StateStore.prototype.scope = function() {
		return Ext.ComponentQuery.query('#seldataset')[0].getValue() || Ext.ComponentQuery.query('#initialdataset')[0].getValue();
	};

	StateStore.prototype.placesObjects = function() {
		var defaultPlaces = Ext.ComponentQuery.query('#sellocation')[0].getValue() || Ext.ComponentQuery.query('#initiallocation')[0].getValue();
		if(defaultPlaces != 'custom') {
			return [Ext.StoreMgr.lookup('location').getById(defaultPlaces)];
		} else {
			// Load all places for the scope.
			return Ext.StoreMgr.lookup('location').filter('dataset', this.scope());
		}
	};

	StateStore.prototype.places = function() {
		var defaultPlaces = Ext.ComponentQuery.query('#sellocation')[0].getValue() || Ext.ComponentQuery.query('#initiallocation')[0].getValue();
		if(defaultPlaces != 'custom') {
			return [defaultPlaces];
		} else {
			// Load all places for the scope.
			return Ext.StoreMgr.lookup('location').filter('dataset', this.scope()).map(function (location) {
				return location._id;
			});
		}
	};

	StateStore.prototype.analyticalUnitLevel = function() {
		return Ext.StoreMgr.lookup('dataset').getById(this.scope()).get('featureLayers')[0];
	};

	return StateStore;
});