export default [

	// =============== INTERNAL ===============

	{
		key: 'backOffice',
		backOffice: true,
		hostname: 'panther.gisat.cz',
		path: '/backoffice',
		devPath: '/backoffice',
		app: (path, baseUrl) => import(/* webpackChunkName: "backOffice" */'./apps/backOffice').then(module => {
			module.default(path, baseUrl);
		})
	},
	{
		key: 'docs',
		hostname: 'panther.gisat.cz',
		path: '/docs',
		devPath: '/docs',
		app: (path, baseUrl) => import(/* webpackChunkName: "docs" */'./apps/docs').then(module => {
			module.default(path, baseUrl);
		})
	},

	// =============== APPS ===============

	/**
	 * ESPON FUORE
	 * tw: Functional Urban Areas
	 */
	{
		key: 'esponFuoreBackOffice',
		backOffice: true,
		hostname: 'fuore.eu',
		path: '/backoffice',
		devPath: '/esponFuoreBackOffice',
		app: (path, baseUrl) => import(/* webpackChunkName: "backOffice" */'./apps/backOffice').then(module => {
			module.default(path, baseUrl, 'esponFuore');
		})
	},
	{
		key: 'esponFuore',
		configuration: {
			specificMetadataTypes: ['esponFuoreIndicators']
		},
		hostname: 'fuore.eu',
		path: null,
		devPath: '/esponFuore',
		app: (path, baseUrl) => import(/* webpackChunkName: "esponFuore" */'./apps/esponFuore').then(module => {
			module.default(path, baseUrl);
		})
	},

	/**
	 * INSAR for BMW story line
	 */
	{
		key: 'insarBmwStory',
		hostname: 'urban-tep.eu',
		path: '/visat/insarBmw',
		devPath: '/insarBmwStory',
		app: (path, baseUrl) => import(/* webpackChunkName: "insarBmwStory" */'./apps/insarBmwStory').then(module => {
			module.default(path, baseUrl);
		})
	},
	/**
	 * SCUDEO Cities
	 * tw: SCUDEO
	 */
	{
		key: 'scudeoCities',
		hostname: 'null',
		path: null,
		devPath: '/scudeoCities',
		app: (path, baseUrl) => import(/* webpackChunkName: "scudeoCities" */'./apps/scudeoCities').then(module => {
			module.default(path, baseUrl);
		})
	},
	/**
	 * SCUDEO Stories
	 * tw: SCUDEO
	 */
	{
		key: 'scudeoStories19',
		hostname: 'urban-tep.eu',
		path: '/visat/scudeoStories19',
		devPath: '/scudeoStories19',
		app: (path, baseUrl) => import(/* webpackChunkName: "scudeoStories19" */'./apps/scudeoStories19').then(module => {
			module.default(path, baseUrl);
		})
	},
	/**
	 * SŽDC insar
	 * tw: InSAR projekty...
	 */
	{
		key: 'szdcInsar19',
		hostname: 'nope.gisat.cz',
		path: null,
		devPath: '/szdcInsar19',
		app: (path, baseUrl) => import(/* webpackChunkName: "szdcInsar19" */'./apps/szdcInsar19').then(module => {
			module.default(path, baseUrl);
		})
	},
	/**
	 * SZIF LPIS změnová řízení
	 * tw: ???
	 */
	{
		key: 'szifLpisZmenovaRizeni',
		hostname: 'nope.gisat.cz',
		path: null,
		devPath: '/szifLpisZmenovaRizeni',
		app: (path, baseUrl) => import(/* webpackChunkName: "szifLpisZmenovaRizeni" */'./apps/szifLpisZmenovaRizeni').then(module => {
			module.default(path, baseUrl);
		})
	},
	/**
	 * Geoinvaze
	 * tw: GEOINV
	 */
	{
		key: 'tacrGeoinvazeBackOffice',
		backOffice: true,
		hostname: 'panther.gisat.cz',
		path: '/ptr3-beta/geoinvaze/backoffice',
		devPath: '/tacrGeoinvazeBackOffice',
		app: (path, baseUrl) => import(/* webpackChunkName: "backOffice" */'./apps/backOffice').then(module => {
			module.default(path, baseUrl, 'tacrGeoinvaze');
		})
	},
	{
		key: 'tacrGeoinvaze',
		hostname: 'panther.gisat.cz',
		path: '/ptr3-beta/geoinvaze',
		devPath: '/tacrGeoinvaze',
		app: (path, baseUrl) => import(/* webpackChunkName: "tacrGeoinvaze" */'./apps/tacrGeoinvaze').then(module => {
			module.default(path, baseUrl);
		})
	},
	/**
	 * TAČR Agritas
	 * tw: AGRIBF
	 */
	{
		key: 'tacrAgritas',
		urls: [
			{
				hostname: "project.gisat.cz",
				path: "/agritas"
			}
		],
		devPath: '/tacrAgritas',
		app: (path, baseUrl) => import(/* webpackChunkName: "tacrAgritas" */'./apps/tacrAgritas').then(module => {
			module.default(path, baseUrl);
		})
	},
	/**
	 * UTEP Visualisation & Analytics Center
	 */
	{
		key: 'visatBackOffice',
		backOffice: true,
		hostname: 'urban-tep.eu',
		path: '/visat/backoffice',
		devPath: '/visatBackOffice',
		app: (path, baseUrl) => import(/* webpackChunkName: "backOffice" */'./apps/backOffice').then(module => {
			module.default(path, baseUrl);
		})
	},
	// {
	// 	key: 'visat',
	// 	hostname: 'urban-tep.eu',
	// 	path: '/visat',
	// 	devPath: '/visat',
	// 	app: (path, baseUrl) => import(/* webpackChunkName: "urbanTepVac" */'./apps/urbanTepVac').then(module => {
	// 		module.default(path, baseUrl);
	// 	})
	// },
	/**
	 * UTEP SDG 3.11.1 demonstration
	 * 2019-06
	 */
	{
		key: 'utep_sdg_11_3_1',
		configuration: {},
		hostname: 'urban-tep.eu',
		path: '/visat/sdg',
		devPath: '/utep_sdg_11_3_1',
		app: (path, baseUrl) => import(/* webpackChunkName: "utep_sdg_11_3_1" */'./apps/utep_sdg_11_3_1').then(module => {
			module.default(path, baseUrl);
		})
	},
	/**
	 * UN SEEA demonstration
	 * 2019-06
	 */
	// {
	// 	key: 'visatUnSeea',
	// 	configuration: {},
	// 	hostname: 'urban-tep.eu',
	// 	path: '/visat/unseea',
	// 	devPath: '/visatUnSeea',
	// 	app: (path, baseUrl) => import(/* webpackChunkName: "unSeea" */'./apps/unSeea').then(module => {
	// 		module.default(path, baseUrl);
	// 	})
	// },
	{
		key: 'unSeea',
		configuration: {},
		hostname: 'urban-tep.eu',
		path: '/visat/unseea',
		devPath: '/unSeea',
		app: (path, baseUrl) => import(/* webpackChunkName: "unSeea" */'./apps/unSeea').then(module => {
			module.default(path, baseUrl);
		})
	},

	// =============== TESTING ===============

	// {
	// 	key: 'visatMicrositeDemo',
	// 	hostname: 'urban-tep.eu',
	// 	path: '/visat/micrositeDemo',
	// 	devPath: '/visatMicrositeDemo',
	// 	app: (path, baseUrl) => import(/* webpackChunkName: "micrositeDemo" */'./apps/micrositeDemo').then(module => {
	// 		module.default(path, baseUrl);
	// 	})
	// },
	// {
	// 	key: 'visatMicrositeElections',
	// 	hostname: 'urban-tep.eu',
	// 	path: '/visat/micrositeElections',
	// 	devPath: '/visatMicrositeElections',
	// 	app: (path, baseUrl) => import(/* webpackChunkName: "micrositeElections" */'./apps/micrositeElections').then(module => {
	// 		module.default(path, baseUrl);
	// 	})
	// },
	{
		key: 'micrositeDemo',
		urls: [
			{
				hostname: 'panther.gisat.cz',
				path: '/micrositeDemo'
			},
			{
				hostname: 'urban-tep.eu',
				path: '/visat/micrositeDemo'
			}
		],
		devPath: '/micrositeDemo',
		app: (path, baseUrl) => import(/* webpackChunkName: "micrositeDemo" */'./apps/micrositeDemo').then(module => {
			module.default(path, baseUrl);
		})
	},
	{
		key: 'micrositeElections',
		urls: [
			{
				hostname: 'panther.gisat.cz',
				path: '/micrositeElections'
			},
			{
				hostname: 'urban-tep.eu',
				path: '/visat/micrositeElections'
			}
		],
		hostname: 'panther.gisat.cz',
		path: '/micrositeElections',
		devPath: '/micrositeElections',
		app: (path, baseUrl) => import(/* webpackChunkName: "micrositeElections" */'./apps/micrositeElections').then(module => {
			module.default(path, baseUrl);
		})
	},
	{
		key: 'demo',
		hostname: 'panther.gisat.cz',
		path: '/demo',
		devPath: '/demo',
		app: (path, baseUrl) => import(/* webpackChunkName: "demo" */'./apps/demo').then(module => {
			module.default(path, baseUrl);
		})
	},
];