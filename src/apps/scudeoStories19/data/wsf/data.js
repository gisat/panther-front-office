
const data = [
	{
		loader: import(/* webpackChunkName: "AbidjanDataset" */ './Abidjan_statistics_p7.json'),
		name: 'Abidjan'
	},
	{
		loader: import(/* webpackChunkName: "AsuncionDataset" */ './Asuncion_statistics_p7.json'),
		name: 'Asuncion'
	},
	{
		loader: import(/* webpackChunkName: "BeijingSanheDataset" */ './BeijingSanhe_statistics_p7.json'),
		name: 'BeijingSanhe'
	},
	{
		loader: import(/* webpackChunkName: "BhopalDataset" */ './Bhopal_statistics_p7.json'),
		name: 'Bhopal'
	},
	{
		loader: import(/* webpackChunkName: "Brasilia" */ './Brasilia_statistics_p7.json'),
		name: 'Brasilia'
	},
	{
		loader: import(/* webpackChunkName: "Dakar" */ './Dakar_statistics_p7.json'),
		name: 'Dakar'
	},
	{
		loader: import(/* webpackChunkName: "Guiyang" */ './Guiyang_statistics_p7.json'),
		name: 'Guiyang'
	},
	{
		loader: import(/* webpackChunkName: "Guntur" */ './Guntur_statistics_p7.json'),
		name: 'Guntur'
	},
	{
		loader: import(/* webpackChunkName: "Hue" */ './Hue_statistics_p7.json'),
		name: 'Hue'
	},
	{
		loader: import(/* webpackChunkName: "Jaipur" */ './Jaipur_statistics_p7.json'),
		name: 'Jaipur'
	},
	{
		loader: import(/* webpackChunkName: "Johannesburg" */ './Johannesburg_statistics_p7.json'),
		name: 'Johannesburg'
	},
	{
		loader: import(/* webpackChunkName: "Lima" */ './Lima_statistics_p7.json'),
		name: 'Lima'
	},
	{
		loader: import(/* webpackChunkName: "Mysore" */ './Mysore_statistics_p7.json'),
		name: 'Mysore'
	},
	{
		loader: import(/* webpackChunkName: "Nanchang" */ './Nanchang_statistics_p7.json'),
		name: 'Nanchang'
	},
	{
		loader: import(/* webpackChunkName: "Ningbo" */ './Ningbo_statistics_p7.json'),
		name: 'Ningbo'
	},
	{
		loader: import(/* webpackChunkName: "Recife" */ './Recife_statistics_p7.json'),
		name: 'Recife'
	},
	{
		loader: import(/* webpackChunkName: "Shijiazhuang" */ './Shijiazhuang_statistics_p7.json'),
		name: 'Shijiazhuang'
	},
	{
		loader: import(/* webpackChunkName: "Tianjin" */ './Tianjin_statistics_p7.json'),
		name: 'Tianjin'
	},
	{
		loader: import(/* webpackChunkName: "Vijayawada" */ './Vijayawada_statistics_p7.json'),
		name: 'Vijayawada'
	},
	{
		loader: import(/* webpackChunkName: "Xalapa" */ './Xalapa_statistics_p7.json'),
		name: 'Xalapa'
	},
	{
		loader: import(/* webpackChunkName: "Campeche" */ './Campeche_statistics_p7.json'),
		name: 'Campeche'
	},
	{
		loader: import(/* webpackChunkName: "HaGiang" */ './HaGiang_statistics_p7.json'),
		name: 'Ha Giang'
	},
	{
		loader: import(/* webpackChunkName: "LaPaz" */ './LaPaz_statistics_p7.json'),
		name: 'La Paz'
	},
	{
		loader: import(/* webpackChunkName: "Melaka" */ './Melaka_statistics_p7.json'),
		name: 'Melaka'
	},
	{
		loader: import(/* webpackChunkName: "SaintLouis" */ './SaintLouis_statistics_p7.json'),
		name: 'Saint Louis'
	},
	{
		loader: import(/* webpackChunkName: "VinhYen" */ './VinhYen_statistics_p7.json'),
		name: 'Vinh Yen'
	},
];

const dataLoaders = data.map((d) => {
	return d.loader.then(({default: dataset}) => {
		dataset.name = d.name;
		dataset.key = d.name;
		return dataset;
	});
});

export const mergedDataset = [];

//add data to prepared datasets
const dataLoader = Promise.all(dataLoaders)

const transformLinksValues = (links, transformFunction) => {
	return links.map((l) => ({
		...l,
		value: transformFunction(l.value),
	}))
}

export const getL3CoverageValueKey = (key, year) => `lulc_l3_${year}_${key}_coverage`;
export const getL4CoverageValueKey = (key, year) => `lulc_l4_${year}_${key}_coverage`;
export const getL3ChangeCoverageValueKey = (sourceKey, targetKey, firstYear, lastYear) => `lulc_l3_${firstYear}_${sourceKey}_lulc_l3_${lastYear}_${targetKey}_coverage`;
export const getL4ChangeCoverageValueKey = (sourceKey, targetKey, firstYear, lastYear) =>   `lulc_l4_${firstYear}_${sourceKey}_lulc_l4_${lastYear}_${targetKey}_coverage`;

/**
 * 
 * @param {Array.<string>} names - Array of wanted datasources names. Default is all.
 */
export const getMergedDataset = () => {
	const loader = new Promise((resolve, reject) => {
		dataLoader.then((datasets) => {
			const ordered =  datasets.sort((a,b) => {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );
			resolve(ordered);
		})
	});
	return loader;
};