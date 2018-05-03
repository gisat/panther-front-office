var Config = {
	// url: 'http://localhost:4000/',
	url: 'http://192.168.2.205/backend/',
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
	// geoServerUrl: "http://admin:geoserver@10.0.75.2:80/geoserver/panther/wms",
	geoServerUrl: "http://admin:geoserver@192.168.2.205/geoserver/panther/wms",
	// geoServerUrl: "http://panther.gisat.cz/geoserver/panther/wms",
	// geoServerUrl: 'https://urban-tep.eo.esa.int/puma/geoserver/',

	/**
	 * Log in to geoserver
	 */
	geoServerLoginUrl: "http://192.168.2.205/geoserver/j_spring_security_check",
	// geoServerLoginUrl: "http://10.0.75.2/geoserver/j_spring_security_check",
	// geoServerLoginUrl: "http://panther.gisat.cz/geoserver/j_spring_security_check",
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

		// intro: {
		// 	title: "ESA Urban TEP",
		// 	text: "<p>The main goal of the Urban Thematic Exploitation Platform (TEP) is the implementation of an instrument that helps addressing key research questions and societal challenges arising from the phenomenon of global urbanization. </p>" +
		// 	"<p>Therefore, the Urban TEP represents a web-based platform that allows users to effectively utilize Earth Observation (EO) imagery and existing auxiliary data (e.g., geo-data, statistics) to measure and assess key properties of the urban environment and monitor the past and future spatiotemporal development of settlements. </p>" +
		// 	"<p>Key elements of the Urban TEP are the provision of easy and high performance access to EO data streams and archived data, multi-mission and multi-source data management and processing infrastructures, modular pre-processing and analysis procedures (value-adding processors), user-oriented functionalities for product and service development, validation and standardization as well as exchange and distribution of ideas, methods and thematic layers.</p>" +
		// 	"<p>To maximize the relevance and societal benefit of the Urban TEP, the initiative includes a comprehensive concept for active expert knowledge and user community integration. Hence, the Urban TEP core consortium – consisting of 5 partners - is supported by a network 6 key user communities including the group of scientists conducting the Group on Earth Observation (GEO - Task SB-04 Global Urban Observation and Information), the World Bank Group, the European Environment Agency (EEA), DG Regio of the European Commission, the International Society of City and Regional Planners (ISOCARP) and the City of Prague. In addition, 7 associated consultancy partners will bring in their expertise and competences in key sectors relevant for the Urban TEP development, implementation and sustainability.</p>",
		// 	logo: {
		// 		/**
		// 		 * location of image in src/__new/img/
		// 		 */
		// 		source: "urban_tep/urban_tep_logo.png",
		// 		/**
		// 		 * possible values: circle, wide_rectangle (if other or empty value, default rectangle shape will be used
		// 		 */
		// 		type: "circle"
		// 	}
		// },

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