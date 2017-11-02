var Config = {
	url: 'https://puma.worldbank.org/backend/',
	signupAddress: 'http://panther.gisat.cz/account/signup/',
	// url: 'https://puma.worldbank.org/backend/',                // PUMA
	// signupAddress: 'https://puma.worldbank.org/account/signup/',
	// url: 'http://urbis.gisat.cz/backend/',                     // URBIS
	// signupAddress: 'http://urbis.gisat.cz/account/signup/',
	// url: 'http://35.165.51.145/backend/',                      // Snow Portal
	// signupAddress: 'http://35.165.51.145/account/signup/',
	geoserver2Workspace: "panther",
	initialBaseMap: "terrain",
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
		allowPumaHelp: false,
		allowDownloadsLink: true,
		usePumaLogo: false,
		advancedFiltersFirst: false,
		hasNew3Dmap: true,
		hasNewEvaluationTool: false,
		hasNewCustomPolygonsTool: false,
		hasNewFeatureInfo: true,
		hasOsmWidget: true,
		isNewDesign: true,
		isUrbis: false,
		isEea: false,
		isMelodies: false,
		isUrbanTep: false,
		isSnow: false,
		hideWorldBank: true,
		"http://localhost:63342": {
			classes: ["useEo4sdUrbanLogo"],
			content: {
				headerH1Html: "<a href='http://www.eo4sd-urban.info/' target='_blank'>EO4SD-Urban</a> DATA EXPLORATION",
				userPrepend: "<a href='http://www.eo4sd-urban.info/' target='_blank'>www.eo4sd-urban.info</a><span class='sep'></span>"
			}
		}
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