var Config = {
	// url: 'http://localhost:4000/',
	url: 'https://urban-tep.eo.esa.int/puma/backend/',
	// signupAddress: 'http://panther.gisat.cz/account/signup/',
	// url: 'https://puma.worldbank.org/backend/',                // PUMA
	// signupAddress: 'https://puma.worldbank.org/account/signup/',
	// url: 'http://urbis.gisat.cz/backend/',                     // URBIS
	// signupAddress: 'http://urbis.gisat.cz/account/signup/',
	//  url: 'http://snow.gisat.cz/backend/',                      // Snow Portal
	// signupAddress: 'http://35.165.51.145/account/signup/',
	geoserver2Workspace: "panther",

	/**
	 * URL needed for correct WMS request on Analytical units layer
	 */
	// geoServerUrl: "http://admin:geoserver@10.0.75.2:80/geoserver/panther/wms",
	geoServerUrl: 'https://urban-tep.eo.esa.int/puma/geoserver/',

	initialBaseMap: "osm",
	initialMapBounds: [
		112.4251556396,
		-7.7001045314,
		113.0046844482,
		-6.9809544265
	],

	toggles: {
		noGeoserverLayerGroups: false,
		useWBAgreement: false,
		useWBHeader: false,
		useHeader: true,
		useWBFooter: false,
		useNewViewSelector: true,
		useTopToolbar: true,
		useWorldWindOnly: false,
		allowPumaHelp: false,
		allowDownloadsLink: false,
		usePumaLogo: false,
		advancedFiltersFirst: false,
		hasNew3Dmap: true,
		hasNewEvaluationTool: true,
		hasNewCustomPolygonsTool: false,
		hasNewFeatureInfo: true,
		hasPeriodsSelector: true,
		hasPeriodsWidget: false,
		hasOsmWidget: false,
		isNewDesign: true,
		isUrbis: false,
		isEea: false,
		isMelodies: false,
		isUrbanTep: false,
		isSnow: false,
		skipInitialSelection: false,
		hideWorldBank: false,
		hideSelectorToolbar: false,
		showDataviewsOverlay: true
	},

	basicTexts: {
		advancedFiltersName: "Areas filter",
		areasSectionName: "Areas",
		appTitle: "Data exploration",
		appName: "Data exploration",
		scopeName: "Scale"
	},

	googleAnalyticsTracker: '',
	googleAnalyticsCookieDomain: 'auto',
	environment: 'development'
};

// Allow custom configuration per URL.
if(Config.toggles[window.location.origin] && Config.toggles[window.location.origin].url) {
	Config.url = Config.toggles[window.location.origin].url;
}
if(Config.toggles[window.location.origin] && Config.toggles[window.location.origin].publicUrl) {
	Config.publicUrl = Config.toggles[window.location.origin].publicUrl;
}
if(Config.toggles[window.location.origin] && Config.toggles[window.location.origin].geoServerUrl) {
	Config.geoServerUrl = Config.toggles[window.location.origin].geoServerUrl;
}
if(Config.toggles[window.location.origin] && Config.toggles[window.location.origin].initialBaseMap) {
	Config.initialBaseMap = Config.toggles[window.location.origin].initialBaseMap;
}

// Go through all the site specific toggles and rewrite the default ones.
if(Config.toggles[window.location.origin]) {
	var properties = Object.keys(Config.toggles[window.location.origin]);
	properties.forEach(function(property) {
		Config.toggles[property] = Config.toggles[window.location.origin][property];
	});
}