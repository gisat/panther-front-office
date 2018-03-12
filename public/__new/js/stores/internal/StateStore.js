define([
	'../../actions/Actions',
	'../../error/ArgumentError',
	'../../util/Floater',
	'../../util/Logger',
	'../../util/Uuid',
	'jquery',
	'underscore'], function (
		Actions,
		ArgumentError,
		Floater,
		Logger,
		Uuid,
		$,
		_
) {
	/**
	 * This store is the ultimate source of truth about current state of the application. Everything else updates it
	 * and everything that needs something from it, is notified.
	 * @constructor
	 * @param options {Object}
	 * @param options.dispatcher {Object} Dispatcher, which is used to distribute actions across the application.
	 * @param options.store.maps {MapStore[]}
	 * @param options.store {Object}
	 */
	var StateStore = function (options) {
        if(!options.store){
            throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, 'StateStore', 'constructor', 'Stores must be provided'));
        }
		if (!options.dispatcher){
			throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "MapStore", "constructor", "Dispatcher must be provided"));
		}

		this._dispatcher = options.dispatcher;
        this._changes = {};
        this._maps = {
        	activeLayers: [],
			maps: []
		};
		this._loadingOperations = [];
		this._store = options.store;

		this.isMap3D = true;
		this.isMapIndependentOfPeriod = false;

		window.Stores.addListener(this.onEvent.bind(this), "initialLoading");
		window.Stores.hasStateStore = true;
		window.Stores.state = this;
	};

	/**
	 * It returns complete information about the current state. At some point in time, it will be simply stored probably
	 * in URL and therefore will be accessible to outside.
	 * TODO remove dependency on ThemeYearConfParams global object
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
			auRefMap: ThemeYearConfParams.auRefMap,

			analyticalUnitLevel: this.analyticalUnitLevel(),

			periods: this.periods(),

			objects: {
				places: this.placesObjects()
			},
			changes: this._changes,
			isMap3D: this.isMap3D,
			isMapIndependentOfPeriod: this.isMapIndependentOfPeriod,
			widgets: this.widgets(),
			worldWindNavigator: this.getNavigatorState()
		}
	};

	/**
	 * Set what changed after last action in Ext UI
	 * @param changes {Object}
	 */
	StateStore.prototype.setChanges = function(changes){
		this._changes = changes;
	};


	/**
	 * Reset changes to default
	 */
	StateStore.prototype.resetChanges = function(){
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

	/**
	 * Get state of widgets
	 * @returns {{open: Array, minimized: Array}}
	 */
	StateStore.prototype.widgets = function(){
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
	StateStore.prototype.addLoadingOperation = function(type){
		this._loadingOperations.push(type);
		console.log("StateStore#addLoadingOperation: Loading operation added!");
		this.checkLoading(type);
	};

	/**
	 * Remove loading operation
	 */
	StateStore.prototype.removeLoadingOperation = function (type) {
		var index = _.findIndex(this._loadingOperations, function(item){return item === type});
		if (index !== -1){
			this._loadingOperations.splice(index, 1);
			console.log("StateStore#removeLoadingOperation: Loading operation removed!");
			this.checkLoading(type);
		}
	};

	/**
	 * Check operations. If no operation is present, wait 3 sec. and then hide loader. Otherwise show loader.
	 */
	StateStore.prototype.checkLoading = function(type){
		clearTimeout(this._loading);
		if (this._loadingOperations.length === 0){
			// wait 3 sec and then hide loader
			this._loading = setTimeout(function(){
				console.log("StateStore#checkLoading: *** HIDE LOADER ***!" + type);
				$("#loading-screen").css("display", "none");
			},3000);
		} else {
			console.log("StateStore#checkLoading: *** SHOW LOADER ***!" + type);
			$("#loading-screen").css("display", "block");
		}
	};

	/**
	 * Return the current settings of World wind navigator
	 * @returns {Object}
	 */
	StateStore.prototype.getNavigatorState = function(){
		return this._navigatorState;
	};

	/**
	 * @param isDependent {boolean} true, if maps are dependent on periods
	 */
	StateStore.prototype.handleMapDependencyOnPeriod = function(isDependent){
		this.isMapIndependentOfPeriod = !isDependent;
	};

	/**
	 * Switch map projection
	 */
	StateStore.prototype.handleMapProjection = function(){
		if (this.isMap3D){
			this.switchMapTo2D();
		} else {
			this.switchMapTo3D();
		}
	};

	/**
	 * Switch map to 2D
	 */
	StateStore.prototype.switchMapTo2D = function(){
		this.isMap3D = false;
		$("#top-toolbar-3dmap").removeClass("open");
		this._dispatcher.notify('map#switchTo2D');
	};

	/**
	 * Switch map to 3D
	 */
	StateStore.prototype.switchMapTo3D = function(){
		this.isMap3D = true;
		$("#top-toolbar-3dmap").addClass("open");
		this._dispatcher.notify('map#switchTo3D');
	};

	/**
	 * Update metadata about maps and layers
	 * @param options {Object}
	 * @param options.map {WorldWindMap}
	 * @param options.id {string} Id of the map
	 * @param options.periodId {number} Id of the period
	 */
	StateStore.prototype.updateMapsMetadata = function(options){
		if (options.map){
			this._maps.maps.push({
				id: options.map._id,
				name: options.map._name,
				period: options.map._period
			});
		} else if (options.id){
			this._maps.maps = _.reject(this._maps.maps, function(map) { return map.id === options.id;});
		} else if (options.periodId){
			this._maps.maps.forEach(function(map){
				map.period = options.periodId;
			});
		}
	};

	/**
	 * It updates the settings of World wind navigator
	 * @param options {Object}
	 */
	StateStore.prototype.updateNavigator = function(options){
		this._navigatorState = options;
		this._dispatcher.notify("navigator#update");
	};

	StateStore.prototype.onEvent = function(type, options){
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
		} else if (type === Actions.mapAdded || type === Actions.mapRemoved){
			this.updateMapsMetadata(options);
		} else if (type === Actions.periodsChange){
			if (this.current().isMapIndependentOfPeriod){
				this.updateMapsMetadata({periodId: this.current().periods[0]});
			}
		}
	};

	return StateStore;
});