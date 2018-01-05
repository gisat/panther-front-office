var Config = {
	url: 'http://localhost:4000/',
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
	geoServerUrl: "http://admin:geoserver@10.0.75.2:80/geoserver/panther/wms",

	initialBaseMap: "osm",
	initialMapBounds: [
		112.4251556396,
		-7.7001045314,
		113.0046844482,
		-6.9809544265
	],
	melodiesRemoteUrl: "",

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
		hideSelectorToolbar: false
	},

	basicTexts: {
		advancedFiltersName: "Areas filter",
		areasSectionName: "Areas",
		appTitle: "Data exploration",
		appName: "Data exploration",
		scopeName: "Scale"
	},
	urbisTexts: {
		scopeName: "Scale",
		scopeAbout: "Different type of data and information address different scales of analysis, which correspond to different levels of urban-related decision making. Please choose your scale of interest first.",
		placeName: "Pilot",
		placeAbout: "URBIS services are demonstrated thought implementation on three pilot sites, represented by city-regions distributed across Europe. The basic portfolio of URBIS services is prepared for all three pilots, advanced types of services must not be implemented for all pilots. You can start with analysis for single pilot of your interest or with benchmarking of all three pilots.",
		themeName: "Theme",
		themeAbout: "URBIS services are focused on different thematic information, including Green and Grey infrastructure or Urban Land Typology and Dynamics. Please select theme/service according your thematic interests."
	},
	eeaTexts: {
		placeName: "Country",
		placeAbout: ""
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