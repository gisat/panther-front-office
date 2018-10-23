/**
 * parmas for Ext-Require communication
 * @type {{theme: string, dataset: string, years: string, refreshLayers: string, refreshAreas: string, expanded: string, parentgids: string, queryTopics: string, fids: string, artifexpand: string, layerRef: string, level: string}}
 */

var ThemeYearConfParams = {
	theme: '',
	themeChanged: '',
	dataset: '',
	datasetChanged: '',
	years: '',
	refreshLayers: '',
	refreshAreas: '',
	expanded: '',
	expandedAndFids: '',
	parentgids: '',
	queryTopics: '',
	fids: '',
	artifexpand: '',
	place: '',
	placeChanged: '',
	auCurrentAt: '',
	layerRefMap: '',
	actions: []
};

/**
 * State of area expanding
 * @type {boolean}
 */
var AreasExpanding = false;

/**
 * Object for currently expanded areas
 * @type {{}}
 */
var ExpandedAreasExchange = {};

/**
 * Exchange params for visualization
 * @type {{attributesState: Array, options: {}}}
 */
var ExchangeParams = {
	attributesState: [],
	options: {
		openWidgets: {

		}
	}
};

/**
 * Object for currently selected areas
 * @type {{data: null}}
 */
var SelectedAreasExchange = {
	data: {}
};

/**
 * Object for storing data about areas if there is only one analysis level
 * @type {{}}
 */
var OneLevelAreas = {
	map: {},
	hasOneLevel: false,
	data: []
};

/**
 * Object for Map functionality
 * @type {{active: boolean, data: {}, map: {},  map2: {}}}
 */
var OlMap = {
	auRefMap: {},
	map: {},
	map2: {}
};

/**
 * Stores for different types of data which needs to be handled.
 * @type {{choropleths: Array, listeners: Function[], outlines: Object, selectedOutlines: Object}}
 */
var Stores = {
	activeLayers: [],
	listeners: [],
	outlines: null,
	selectedOutlines: null
};

/**
 * Notification about changes in the stores.
 * @param changed {String} key used to distinguish the actions.
 */
Stores.notify = function(changed, options) {
	Stores.listeners.forEach(function(listener){
		if (listener.key){
			listener.listener(changed, options);
		} else {
			listener(changed, options);
		}

	})
};

/**
 * Simply adds listener.
 * @param listener {Function} Function which will be called when any event occurs.
 * @param [options] {string|object} Optional parametr.
 */
Stores.addListener = function(listener, options) {
	if (options && options.key){
		let existingListener = Stores.listeners.find(listener => {return listener.key === options.key});
		if (!existingListener){
			Stores.listeners.push({key: options.key, listener: listener});
		}
	} else {
		Stores.listeners.push(listener);
	}

	if (options === "initialLoading"){
		Stores.notify("initialLoadingStarted");
	}
};

Stores.updateOutlines = function(data){
	Stores.outlines = data;
	Stores.notify('updateOutlines');
};

Stores.updateSelectedOutlines = function(data) {
	Stores.selectedOutlines = data;
	Stores.notify('updateOutlines');
};

Stores.updateSelectedAreas = function(data) {
	Stores.selectedAreas = data;
	Stores.notify('updateOutlines');
};

/**
 * This global object useful for handling the selection from anywhere and handling what is actually selected.
 * @type {{listeners: Array, select: Select.select, notify: Select.notify, selectedAreasMap: null}}
 */
var Select = {
	/**
	 * Array of listeners to be notified when the selection actually changes.
	 */
	listeners: [],

	/**
	 * It is replaced by select
	 * @param areas {Area[]} Array of areas to either add to selected or remove from selected.
	 * @param add {Boolean} True means that the areas with relevant gid will be added among selected
	 * @param hover {Boolean} Usually will be ignored. Has some implication, which I am not yet sure of.
	 */
	select: function(areas, add, hover){},

	/**
	 * It is replaced by Layers.colourMap
	 * @param selectedAreasMap
	 */
	colourMap: function(selectedAreasMap){},

	notify: function() {
		this.listeners.forEach(function(listener){
			listener(Select.selectedAreasMap);
		});
	},

	/**
	 * It will contain object which contains all areas selected for specific colours.
	 */
	selectedAreasMap: null,

	/**
	 * It contains the store with all the areas, so that it is possible to correctly select area based on the gid.
	 */
	areaStore: null,

	/**
	 * It represents actual color of selection. It is possible to select the units in multiple colors.
	 */
	actualColor: null,

	/**
	 * Controller for handling Select.
	 */
	controller: null
};

/**
 * This global objects contain widgets to be used in other parts of the application.
 * @type {{}}
 */
var Widgets = {
	sharing: null
};

/**
 * This global array contains charts as objects - intended for D3 charts
 */
var Charts = {
	polar: {},
	selectedAreas: {},

	data: [], //will be removed
};


