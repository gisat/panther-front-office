var Config = {
	url: 'https://urban-tep.eo.esa.int/puma/backend/',
	// url: 'https://urban-tep.eo.esa.int/puma/backend/',
	// url: 'http://panther.gisat.cz/backend/',
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
	geoServerUrl: "https://urban-tep.eo.esa.int/puma/geoserver/",
	// geoServerUrl: "http://panther.gisat.cz/geoserver/panther/wms",
	// geoServerUrl: 'https://urban-tep.eo.esa.int/puma/geoserver/',

	/**
	 * Log in to geoserver
	 */
	geoServerLoginUrl: "https://urban-tep.eo.esa.int/puma/geoserver/j_spring_security_check",
	geoServerUser: "admin",
	geoServerPassword: "geoserver",

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
		hideSelectorToolbar: false,

		showDataviewsOverlay: true,
		dataviewsOverlayHasIntro: true,

		intro: {
			title: "Panther Data Exploration",
			text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus mollis sodales lorem, nec hendrerit mi tincidunt pellentesque. Quisque facilisis ipsum id elit hendrerit, vitae elementum tortor elementum. Proin in pretium tellus, sit amet pretium nisi. Curabitur eget egestas mauris.",
			logo: {
				/**
				 * location of image in src/__new/img/
				 */
				source: "panther/panther_logo.png",
				/**
				 * possible values: circle, wide_rectangle (if other or empty value, default rectangle shape will be used
				 */
				type: "circle"
			}
		},

		"http://dromas.gisat.cz": {
			classes: ['dromas'],
			url: 'http://dromas.gisat.cz/backend/',
			publicUrl: 'http://dromas.gisat.cz/tool/',
			geoServerUrl: "http://dromas.gisat.cz/geoserver/panther/wms",

			/**
			 * It updates the selector in 3D mode to the select version for multiple maps.
			 */
			hasPeriodsSelector: true,

			/**
			 * It removes link to the administration from the top part of the panel.
			 */
			disableAdministration: true,

			/**
			 * Configuration of intro window for Dromas
			 */
			intro: {
				title: "Dromas Portál",
				text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus mollis sodales lorem, nec hendrerit mi tincidunt pellentesque. Quisque facilisis ipsum id elit hendrerit, vitae elementum tortor elementum. Proin in pretium tellus, sit amet pretium nisi. Curabitur eget egestas mauris.",
				logo: {
					source: "dromas/dromas_logo.png",
					type: "wide_rectangle"
				}
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