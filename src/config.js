var Config = {
	//url: 'http://localhost:4000/',
	//signupAddress: 'http://localhost:4000/account/signup/',
	// url: 'https://puma.worldbank.org/backend/',                // PUMA
	// signupAddress: 'https://puma.worldbank.org/account/signup/',
	// url: 'http://urbis.gisat.cz/backend/',                     // URBIS
	// signupAddress: 'http://urbis.gisat.cz/account/signup/',
	 url: 'http://35.165.51.145/backend/',                      // Snow Portal
	 signupAddress: 'http://35.165.51.145/account/signup/',
	geoserver2Workspace: "panther",
	initialBaseMap: "terrain",
	initialMapBounds: [
		112.4251556396,
		-7.7001045314,
		113.0046844482,
		-6.9809544265
	],
	melodiesRemoteUrl: "",
	snowUrl: "http://35.165.51.145/",

	toggles: {
		noGeoserverLayerGroups: false,
		useWBAgreement: false,
		useWBHeader: false,
		useHeader: true,
		useWBFooter: false,
		useNewViewSelector: true,
		useTopToolbar: true,
		allowPumaHelp: true,
		allowDownloadsLink: true,
		usePumaLogo: true,
		advancedFiltersFirst: false,
		hasNew3Dmap: true,
		hasNewEvaluationTool: true,
		hasNewCustomPolygonsTool: false,
		hasNewFeatureInfo: true,
		isNewDesign: true,
		isUrbis: false,
		isEea: false,
		isMelodies: false,
		isUrbanTep: false,
		isSnow: true
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