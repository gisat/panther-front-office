export default [
	{
		key: 'backOffice',
		backOffice: true,
		hostname: 'panther.gisat.cz',
		path: '/backoffice',
		devPath: '/backoffice',
		app: path => import(/* webpackChunkName: "backOffice" */'./apps/backOffice').then(module => {
			module.default(path);
		})
	},
	{
		key: 'demo',
		hostname: 'panther.gisat.cz',
		path: null,
		devPath: '/demo',
		app: path => import(/* webpackChunkName: "demo" */'./apps/demo').then(module => {
			module.default(path);
		})
	},
	{
		key: 'urbanTepVacBackOffice',
		backOffice: true,
		hostname: 'urban-tep.eu',
		path: '/vac/backoffice',
		devPath: '/urbanTepVacBackOffice',
		app: path => import(/* webpackChunkName: "backOffice" */'./apps/backOffice').then(module => {
			module.default(path, 'urbanTepVac');
		})
	},
	{
		key: 'urbanTepVac',
		hostname: 'urban-tep.eu',
		path: '/vac',
		devPath: '/urbanTepVac',
		app: path => import(/* webpackChunkName: "urbanTepVac" */'./apps/urbanTepVac').then(module => {
			module.default(path);
		})
	}
];