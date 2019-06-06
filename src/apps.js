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
	 * UTEP Visualisation & Analytics Center
	 * todo wip + name (visat?)
	 */
	{
		key: 'urbanTepVacBackOffice',
		backOffice: true,
		hostname: 'urban-tep.eu',
		path: '/vac/backoffice',
		devPath: '/urbanTepVacBackOffice',
		app: (path, baseUrl) => import(/* webpackChunkName: "backOffice" */'./apps/backOffice').then(module => {
			module.default(path, baseUrl, 'urbanTepVac');
		})
	},
	{
		key: 'urbanTepVac',
		hostname: 'urban-tep.eu',
		path: '/vac',
		devPath: '/urbanTepVac',
		app: (path, baseUrl) => import(/* webpackChunkName: "urbanTepVac" */'./apps/urbanTepVac').then(module => {
			module.default(path, baseUrl);
		})
	},
	/**
	 * UTEP SDG 3.11.1 demonstration
	 * 2019-06
	 */
	{
		key: 'utep_sdg_3_11_1',
		configuration: {},
		hostname: 'fuore.eu',
		path: null,
		devPath: '/utep_sdg_11_3_1',
		app: (path, baseUrl) => import(/* webpackChunkName: "utep_sdg_11_3_1" */'./apps/utep_sdg_11_3_1').then(module => {
			module.default(path, baseUrl);
		})
	},

	// =============== TESTING ===============

	{
		key: 'demo',
		hostname: 'panther.gisat.cz',
		path: null,
		devPath: '/demo',
		app: (path, baseUrl) => import(/* webpackChunkName: "demo" */'./apps/demo').then(module => {
			module.default(path, baseUrl);
		})
	},
	{
		key: 'micrositeDemo',
		hostname: 'panther.gisat.cz',
		path: null,
		devPath: '/micrositeDemo',
		app: (path, baseUrl) => import(/* webpackChunkName: "micrositeDemo" */'./apps/micrositeDemo').then(module => {
			module.default(path, baseUrl);
		})
	},
	{
		key: 'micrositeElections',
		hostname: 'panther.gisat.cz',
		path: null,
		devPath: '/micrositeElections',
		app: (path, baseUrl) => import(/* webpackChunkName: "micrositeElections" */'./apps/micrositeElections').then(module => {
			module.default(path, baseUrl);
		})
	},
];