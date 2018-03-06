var Config = {
	geoserverUrl: 'https://puma.worldbank.org/geoserver/',
	url: 'https://puma.worldbank.org/backend/',
	signupAddress: 'https://puma.worldbank.org/account/signup/',
	geoserver2Workspace: "panther",
	geoServerUrl: "https://puma.worldbank.org/geoserver/panther/wms",
	initialBaseMap: "osm",
	initialMapBounds: [
		112.4251556396,
		-7.7001045314,
		113.0046844482,
		-6.9809544265
	],

	/**
	 * It represents URL to which will point the Administration link in the front office.
	 */
	backOfficeUrl: "https://puma.worldbank.org/backoffice/",

	/**
	 * Log in to geoserver
	 */
	geoServerLoginUrl: "https://puma.worldbank.org/geoserver/j_spring_security_check",
	geoServerUser: "admin",
	geoServerPassword: "geoserver",

	toggles: {
		noGeoserverLayerGroups: false,
		useWBAgreement: true,
		useWBHeader: true,
		useHeader: true,
		useWBFooter: true,
		useNewViewSelector: true,
		useTopToolbar: true,
		allowPumaHelp: true,
		allowDownloadsLink: true,
		usePumaLogo: true,
		advancedFiltersFirst: false,
		isUrbis: false,
		isEea: false,
		hasNew3Dmap: true,
		hasNewEvaluationTool: true,
		hasNewCustomPolygonsTool: false,
		hasNewFeatureInfo: true,
		isNewDesign: true,

		/**
		 * If it is true functional urban area is shown.
		 */
		hasFunctionalUrbanArea: false
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

// Go through all the site specific toggles and rewrite the default ones.
if(Config.toggles[window.location.origin]) {
	var properties = Object.keys(Config.toggles[window.location.origin]);
	properties.forEach(function(property) {
		Config.toggles[property] = Config.toggles[window.location.origin][property];
	});
}