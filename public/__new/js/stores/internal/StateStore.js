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
		this.isMapDependentOnScenario = false;

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

			locations: this._locations,
			aoiLayer: this._aoiLayer,
			activeAoi: this._activeAoi,
			previousAoi: this._previousAoi,
			isMap3D: this.isMap3D,
			isMapDependentOnScenario: this.isMapDependentOnScenario,
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

	StateStore.prototype.setActiveLocations = function(locations){
		if (!_.isArray(locations)){
			this._locations = [locations];
		} else {
			this._locations = locations;
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
					if (floater.length){
						widget.floater.position = Floater.getPosition(floater);
						widget.floater.pinned = floater.hasClass("pinned");
						widgets.open.push(widget);
					}
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
	 * @param isDependent {boolean} true, if maps are dependent on scenarios
	 */
	StateStore.prototype.handleMapDependencyOnScenario = function(isDependent){
		this.isMapDependentOnScenario = isDependent;
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

	StateStore.prototype.setAoiLayer = function(options){
		this._aoiLayer = options;
	};

	StateStore.prototype.setActiveAoi = function(aoiId){
		this._previousAoi = this._activeAoi;
		this._activeAoi = aoiId;
	};

	StateStore.prototype.updateAoiLayer = function(layer){
		this._aoiLayer.layer = layer;
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
	 * It is used for maps metadata storing (currently for view sharing purposes).
	 * @param options.maps {Array} list of maps metadata received from redux store
	 * @param options.defaults {Object}
	 */
	StateStore.prototype.updateMapsMetadata = function(options){
		if (options.maps){
			this._mapsMetadata = options.maps;
		}
		if (options.defaults){
			this._mapDefaults = options.defaults;
		}
	};

	/**
	 * Update data about user
	 * @param options {Object}
	 */
	StateStore.prototype.updateUser = function(options){
		this._user = {
			isLoggedIn: options.isLoggedIn,
			isAdmin: options.isAdmin
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
		} else if (type === Actions.foMapIsDependentOnScenario){
			this.handleMapDependencyOnScenario(true);
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
		} else if (type === 'REDUX_SET_ACTIVE_PLACES'){
			this.setActiveLocations(options.keys);
			if (this._changes && !this._changes.dataview){
				this._dispatcher.notify('map#zoomToLocations', options.extents);
			}
		}
	};

	return StateStore;
});