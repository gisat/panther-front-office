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
 * @type {{choropleths: Array, listeners: Function[]}}
 */
var Stores = {
	choropleths: [],

	// With respect to selection there are actually three information that we need to handle.
	//   One is the available areas and their relationships
	//   Two is the selected areas
	//   Three is the currently visible areas.
	selectedAreas: {}, // Tree of the areas that are currently selected?

	listeners: []
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
	 * @param areas
	 * @param add
	 * @param hover
	 * @param delay
	 */
	select: function(areas, add, hover, delay){},

	notify: function() {
		this.listeners.forEach(function(listener){
			listener(Select.selectedAreasMap);
		});
	},

	/**
	 * It will contain object which contains all areas selected for specific colours.
	 */
	selectedAreasMap: null
};

/**
 * Notification about changes in the stores.
 * @param changed
 */
Stores.notify = function(changed) {
	Stores.listeners.forEach(function(listener){
		listener(changed);
	})
};