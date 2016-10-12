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
	auCurrentAt: ''
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
 * Object for feature info functionality
 * @type {{active: boolean, data: {}, map: {}}}
 */
var FeatureInfo = {
	active: true,
	map: {},
	data: {}
};