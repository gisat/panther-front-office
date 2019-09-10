//inspiration: https://help.tableau.com/current/pro/desktop/en-us/formatting_create_custom_colors.htm
//inspiration: http://phrogz.net/css/distinct-colors.html
const datasetColors = [
	'#7f0000', '#fffcbf', '#0024b3', '#806060', '#5f664d', '#6c82d9', '#d90000', '#4f8c23', '#4066ff', '#e50000', '#81e639', '#341040', '#ff0000', '#16593a', '#6c5673', '#ff8080', '#36d98d', '#bf99cc', '#bf5d30', '#80ffec', '#ac00e6', '#e6beac', '#4d8c99', '#ff80f6', '#594116', '#00d5ff', '#bf3088', '#d99d36', '#334d66', '#59162a', '#fff540', '#80c1ff', '#ffbfd2'
];

const data = [
	{
		loader: import(/* webpackChunkName: "AbidjanDataset" */ './Abidjan_statistics_p7.json'),
		name: 'Abidjan',
		color: datasetColors[1],
	},
	{
		loader: import(/* webpackChunkName: "AsuncionDataset" */ './Asuncion_statistics_p7.json'),
		name: 'Asuncion',
		color: datasetColors[2],
	},
	{
		loader: import(/* webpackChunkName: "BeijingSanheDataset" */ './BeijingSanhe_statistics_p7.json'),
		name: 'BeijingSanhe',
		color: datasetColors[3],
	},
	{
		loader: import(/* webpackChunkName: "BhopalDataset" */ './Bhopal_statistics_p7.json'),
		name: 'Bhopal',
		color: datasetColors[4],
	},
	{
		loader: import(/* webpackChunkName: "Brasilia" */ './Brasilia_statistics_p7.json'),
		name: 'Brasilia',
		color: datasetColors[5],
	},
	{
		loader: import(/* webpackChunkName: "Dakar" */ './Dakar_statistics_p7.json'),
		name: 'Dakar',
		color: datasetColors[6],
	},
	{
		loader: import(/* webpackChunkName: "Guiyang" */ './Guiyang_statistics_p7.json'),
		name: 'Guiyang',
		color: datasetColors[7],
	},
	{
		loader: import(/* webpackChunkName: "Guntur" */ './Guntur_statistics_p7.json'),
		name: 'Guntur',
		color: datasetColors[8],
	},
	{
		loader: import(/* webpackChunkName: "Hue" */ './Hue_statistics_p7.json'),
		name: 'Hue',
		color: datasetColors[9],
	},
	{
		loader: import(/* webpackChunkName: "Jaipur" */ './Jaipur_statistics_p7.json'),
		name: 'Jaipur',
		color: datasetColors[10],
	},
	{
		loader: import(/* webpackChunkName: "Johannesburg" */ './Johannesburg_statistics_p7.json'),
		name: 'Johannesburg',
		color: datasetColors[11],
	},
	{
		loader: import(/* webpackChunkName: "Lima" */ './Lima_statistics_p7.json'),
		name: 'Lima',
		color: datasetColors[12],
	},
	{
		loader: import(/* webpackChunkName: "Mysore" */ './Mysore_statistics_p7.json'),
		name: 'Mysore',
		color: datasetColors[13],
	},
	{
		loader: import(/* webpackChunkName: "Nanchang" */ './Nanchang_statistics_p7.json'),
		name: 'Nanchang',
		color: datasetColors[14],
	},
	{
		loader: import(/* webpackChunkName: "Ningbo" */ './Ningbo_statistics_p7.json'),
		name: 'Ningbo',
		color: datasetColors[15],
	},
	{
		loader: import(/* webpackChunkName: "Recife" */ './Recife_statistics_p7.json'),
		name: 'Recife',
		color: datasetColors[16],
	},
	{
		loader: import(/* webpackChunkName: "Shijiazhuang" */ './Shijiazhuang_statistics_p7.json'),
		name: 'Shijiazhuang',
		color: datasetColors[17],
	},
	{
		loader: import(/* webpackChunkName: "Tianjin" */ './Tianjin_statistics_p7.json'),
		name: 'Tianjin',
		color: datasetColors[18],
	},
	{
		loader: import(/* webpackChunkName: "Vijayawada" */ './Vijayawada_statistics_p7.json'),
		name: 'Vijayawada',
		color: datasetColors[19],
	},
	{
		loader: import(/* webpackChunkName: "Xalapa" */ './Xalapa_statistics_p7.json'),
		name: 'Xalapa',
		color: datasetColors[20],
	},
	{
		loader: import(/* webpackChunkName: "Campeche" */ './Campeche_statistics_p7.json'),
		name: 'Campeche',
		color: datasetColors[21],
	},
	{
		loader: import(/* webpackChunkName: "HaGiang" */ './HaGiang_statistics_p7.json'),
		name: 'Ha Giang',
		color: datasetColors[22],
	},
	{
		loader: import(/* webpackChunkName: "LaPaz" */ './LaPaz_statistics_p7.json'),
		name: 'La Paz',
		color: datasetColors[23],
	},
	{
		loader: import(/* webpackChunkName: "Melaka" */ './Melaka_statistics_p7.json'),
		name: 'Melaka',
		color: datasetColors[24],
	},
	{
		loader: import(/* webpackChunkName: "SaintLouis" */ './SaintLouis_statistics_p7.json'),
		name: 'Saint Louis',
		color: datasetColors[25],
	},
	{
		loader: import(/* webpackChunkName: "VinhYen" */ './VinhYen_statistics_p7.json'),
		name: 'Vinh Yen',
		color: datasetColors[26],
	},
	{
		loader: import(/* webpackChunkName: "GuangzhouGuangdongShenzhenDongguanFoshanZhongshanJiangmenHeshan" */ './GuangzhouGuangdongShenzhenDongguanFoshanZhongshanJiangmenHeshan_statistics_p7.json'),
		name: 'Guangzhou Guangdong Shenzhen Dongguan Foshan Zhongshan Jiangmen Heshan',
		color: datasetColors[27],
	},
];

const dataLoaders = data.map((d) => {
	return d.loader.then(({default: dataset}) => {
		dataset.name = d.name;
		dataset.key = d.name;
		dataset.color = d.color;
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