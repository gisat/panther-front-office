var Config = {
	url: 'http://localhost',
	signupAddress: 'http://localhost/geonode/account/signup/',
	geoserver2Workspace: "puma",
	initialBaseMap: "terrain",
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
		useWBFooter: false,
		allowPumaHelp: false,
		allowDownloadsLink: false,
		usePumaLogo: false,
		advancedFiltersFirst: false
	},
	googleAnalyticsTracker: '',
	googleAnalyticsCookieDomain: 'auto',
	environment: 'production'
};