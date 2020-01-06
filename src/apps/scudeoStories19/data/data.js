import conversions from './conversions';
import populationsData from './population.json';
import {get} from 'lodash';

const data = [
	{
		loader: import(/* webpackChunkName: "dhakaDataset" */ './output_dhaka_stories_data_p7.json'),
		name: 'Dhaka'
	},
	{
		loader: import(/* webpackChunkName: "dodomaDataset" */ './output_dodoma_stories_data_p7.json'),
		name: 'Dodoma'
	},
	{
		loader: import(/* webpackChunkName: "kigomaDataset" */ './output_kigoma_stories_data_p7.json'),
		name: 'Kigoma'
	},
	{
		loader: import(/* webpackChunkName: "mbeyaDataset" */ './output_mbeya_stories_data_p7.json'),
		name: 'Mbeya'
	},
	{
		loader: import(/* webpackChunkName: "mtwaraDataset" */ './output_mtwara_stories_data_p7.json'),
		name: 'Mtwara'
	},
	{
		loader: import(/* webpackChunkName: "mwanzaDataset" */ './output_mwanza_stories_data_p7.json'),
		name: 'Mwanza'
	},
	{
		loader: import(/* webpackChunkName: "bhopalDataset" */ './output_bhopal_stories_data_p7.json'),
		name: 'Bhopal'
	},
	{
		loader: import(/* webpackChunkName: "campecheDataset" */ './output_campeche_stories_data_p7.json'),
		name: 'Campeche'
	},
	{
		loader: import(/* webpackChunkName: "limaDataset" */ './output_lima_stories_data_p7.json'),
		name: 'Lima'
	},
	{
		loader: import(/* webpackChunkName: "mandalayDataset" */ './output_mandalay_stories_data_p7.json'),
		name: 'Mandalay'
	},
	{
		loader: import(/* webpackChunkName: "arushaDataset" */ './output_arusha_stories_data_p7.json'),
		name: 'Arusha'
	},
	{
		loader: import(/* webpackChunkName: "abidjanDataset" */ './output_abidjan_stories_data_p7.json'),
		name: 'Abidjan'
	},
	{
		loader: import(/* webpackChunkName: "saintlouisDataset" */ './output_saintlouis_stories_data_p7.json'),
		name: 'Saint Louis'
	},
	{
		loader: import(/* webpackChunkName: "vijayawadaDataset" */ './output_vijayawada_stories_data_p7.json'),
		name: 'Vijayawada'
	},
	{
		loader: import(/* webpackChunkName: "dakarDataset" */ './output_dakar_stories_data_p7.json'),
		name: 'Dakar'
	},
];

const dataLoaders = data.map((d) => {
	return d.loader.then(({default: dataset}) => {
		dataset.name = d.name;
		return dataset;
	});
});


// const dataLoaders = [arushaDatasetLoader];



//L3 classes
export const classesL3 = {
    "11100":"Continuous Urban Fabric (Sealing level: 80% - 100%)",
    "11200":"Discontinuous Urban Fabric (Sealing level: 10% - 80%)",
    "12100":"Industrial, Commercial, Public, Military and Private Units",
	"12200":"Roads and rail network and associated land",
    "12300":"Port",
    "12400":"Airport",
    "13100":"Mineral Extraction and Dump Sites",
    "13300":"Construction Sites",
    "13400":"Land without current use",
    "14100":"Green Urban Areas",
    "14200":"Recreation Facilities (Sport Facilities, Stadiums, Golf Courses, etc.)",
    "14300":"Cemeteries",
    "20000":"Agricultural Area",
    "31000":"Forest",
    "32000":"Other Natural and Semi-natural Areas (Savannah, Grassland)",
    "33000":"Bare land",
    "40000":"Wetlands",
    "51000":"Inland Water",
    "52000":"Marine Water"
};

export const classesL4 = {
    "11100": "High density continuous residential urban fabric (80% - 100% sealed)",
    "11210": "Discontinuous dense residential urban fabric (50% - 80% sealed)",
	"11220": "Discontinuous medium density urban fabric (10 - 50 % Sealed",
	"11221": "Discontinuous medium density urban fabric (30 - 50 % Sealed)",
	"11222": "Discontinuous low-density urban fabric (10 - 30 % Sealed)",
	"11240": "Discontinuous very low density urban fabric (0 - 10 % Sealed) / Village Settlements",
	"11300": "Isolated structures ",
	"12110": "Commercial and Industrial units",
	"12111": "Commercial units",
	"12112": "Industrial units",
	"12120": "Non-residential urban fabric",
	"12121": "Education",
	"12122": "Museum",
	"12123": "Government",
	"12124": "Military",
	"12125": "Medical",
	"12126": "Religious",
	"12127": "Hotel",
	"12128": "Other",
	"12130": "Mix function",
	"12131": "Public Buildings",
	"12132": "University",
	"12133": "School ",
	"12210": "Transportation units",
	"12211": "Arterial roads",
	"12212": "Collector roads",
	"12220": "Railway",
	"12300": "Port ",
	"12400": "Airport ",
	"13100": "Mineral Extraction and Dump Sites",
	"13300": "Construction Sites ",
	"13310": "Sand-filled areas",
	"13400": "Land without current use (Vacant Land not obviously being prepared for construction) ",
	"14100": "Urban Greenery",
	"14110": "Parks ",
	"14200": "Sport and leisure facilities",
	"14210": "Stadium",
	"14220": "Sport fields",
	"14230": "Recreational",
	"14300": "Cemetery ",
	"20000": "Agricultural Land",
	"21000": "Permanent culture ",
	"31000": "Forest ",
	"32000": "Other Natural and Semi-natural Areas (Savannah, Grassland) ",
	"33000": "Bare land ",
	"40000": "Wetlands ",
	"51000": "Inland Water ",
	"52000": "Marine Water",
};

// LCF level 1
export const classesLCF1 = {
	"LCF10": 'Urban expansion',
	"LCF20": 'Urban internal changes',
	"LCF30": 'Agriculture development',
	"LCF40": 'Natural and semi-natural internal changes',
	"LCF50": 'Riverbed and water bodies development',
	"LCF60": 'Natural and semi-natural development',
	// "LCF70": 'Urban Greenery Development',
}

//LCFG
export const classesLCFG = {
	"LCF71": 'Formation of urban greenery',
	"LCF73": 'Internal change of urban greenery',
}

//subclasses
export const urbanFabricL3classes = ['11100', '11200', '12100', '12200', '12300', '12400', '13100', '13300', '13400', '14100', '14200', '14300'];

export const colors = {
    "11100":"#9f1313",
    "11200":"#d31414",
    "12100":"#9b1794",
    "12200":"#9C9C9C",
    "12300":"#61007F",
    "12400":"#FFAA00",
    "13100":"#734d37",
    "13300":"#FF73DF",
    "13400":"#BEE8FF",
    "14100":"#4dca00",
    "14200":"#8cdc00",
    "14300":"#A34963",
    "20000":"#ffdc9b",
    "31000":"#006a00",
    "32000":"#B4D79E",
    "33000":"#CCCCCC",
    "40000":"#a6a6ff",
    "51000":"#4c96e4",
	"52000":"#95d6ea",
	"LCF10":"#e60000",
	"LCF20":"#ff9999",
	"LCF30":"#ffcc66",
	"LCF40":"#9CCC65",
	"LCF50":"#66d9ff",
	"LCF60":"#53c653",
	"LCF70":"#734d37",
	"11210": "#d31414",
	"11220": "#ef5959",
	"11221": "#ef5959",
	"11222": "#ffbfbf",
	"11240": "#cc6666",
	"11300": "#f2a64d",
	"12110": "#9b1794",
	"12111": "#DF73FF",
	"12112": "#C500FF",
	"12120": "#E8BEFF",
	"12121": "#FFFF73",
	"12122": "#FFBEBE",
	"12123": "#E9FFBE",
	"12124": "#ABCD66",
	"12125": "#ff7f00",
	"12126": "#734C00",
	"12127": "#A87000",
	"12128": "#e6cce6",
	"12130": "#FFBEE8",
	"12210": "#2f2f2f",
	"12211": "#4E4E4E",
	"12212": "#959595",
	"12220": "#b3b3b3",
	"12300": "#61007F",
	"12400": "#FFAA00",
	"13100": "#734d37",
	"13300": "#FF73DF",
	"13310": "#ffffb2",
	"13400": "#BEE8FF",
	"14100": "#00e800",
	"14110": "#8cdc00",
	"14200": "#00FFC5",
	"14210": "#00E6A9",
	"14220": "#BEFFE8",
	"14230": "#A3FF73",
	"14300": "#A34963",
	"20000": "#FFD37F",
	"21000": "#FFEBAF",
	"31000": "#006a00",
	"32000": "#B4D79E",
	"33000": "#CCCCCC",
	"40000": "#a6a6ff",
	"51000": "#4c96e4",
	"52000": "#95d6ea",
	
};

const getSankeyNodes = (years, classes) => {
	const nodes = [];
	for (const [key, value] of Object.entries(classes)) {
		for (const year of years) {
			const node = {
				id: `${key}_${year}`,
				name: value,
				color: colors[key],
			}
			nodes.push(node);
		}
	}
	return nodes;
}

const getSankeyLinks = (dataset, fromYear, toYear, classes, getValueKey) => {
	const links = [];
	for (const [sourceKey, sourceValue] of Object.entries(classes)) {
		for (const [targetKey, targetValue] of Object.entries(classes)) {
			// const changeKey = `lulc_${level}_${fromYear}_${sourceKey}_lulc_${level}_${toYear}_${targetKey}_percentage`
			const changeKey = getValueKey(sourceKey, targetKey);
			const change = dataset.features[0].properties[changeKey];
			if(change) {
				const link = {
					source: `${sourceKey}_${fromYear}`,
					target: `${targetKey}_${toYear}`,
					value: change,
					name: `${sourceValue} -> ${targetValue}`
				}
				links.push(link);

			}
		}
	}
	return links;
}

export const clearEmptyNodes = (nodes, links) => {
	return nodes.filter(n => {
		return links.some((l) => {
            const targetId = l.target.id || l.target;
            const sourceId = l.source.id || l.source;
            return targetId === n.id || sourceId === n.id
        });
	})
}

const getOverallFlows = (dataset, classes, getValueKey) => {
	const nodes = getSankeyNodes([dataset.firstYear, dataset.lastYear], classes);
	const links = getSankeyLinks(dataset.data, dataset.firstYear, dataset.lastYear, classes, getValueKey);
	const nonEmptyNodes = clearEmptyNodes(nodes, links);
	return {
		nodes: nonEmptyNodes,
		links: links,
	}
}

export const mergedDataset = [
	{
        data: null,
        informalYear: 2015,
		lastYear: 2016,
		firstYear: 2005,
		name: 'Arusha',
		key: 1,
	},
	{
        data: null,
        informalYear: 2017,
		lastYear: 2017,
		firstYear: 2006,
		name: 'Dhaka',
		key: 2,
	},
	{
        data: null,
        informalYear: 2016,
		lastYear: 2016,
		firstYear: 2006,
		name: 'Dodoma',
		key: 3,
	},
	{
        data: null,
        informalYear: 2016,
        lastYear: 2015,
		firstYear: 2005,
		name: 'Kigoma',
		key: 4,
	},
	{
        data: null,
        informalYear: 2017,
		lastYear: 2017,
		firstYear: 2004,
		name: 'Mbeya',
		key: 5,
	},
	{
        data: null,
        informalYear: 2017,
		lastYear: 2016,
		firstYear: 2008,
		name: 'Mtwara',
		key: 6,
	},
	{
        data: null,
        informalYear: 2015,
		lastYear: 2015,
		firstYear: 2005,
		name: 'Mwanza',
		key: 7,
	},
	{
        data: null,
		lastYear: 2017,
		firstYear: 2005,
		name: 'Bhopal',
		key: 8,
	},
	{
        data: null,
		lastYear: 2018,
		firstYear: 2006,
		name: 'Campeche',
		key: 9,
	},
	{
        data: null,
		lastYear: 2016,
		firstYear: 2009,
		name: 'Lima',
		key: 10,
	},
	{
        data: null,
		lastYear: 2016,
		firstYear: 2002,
		name: 'Mandalay',
		key: 11,
	},
	{
        data: null,
		lastYear: 2018,
		firstYear: 2005,
		name: 'Abidjan',
		key: 12,
	},
	{
        data: null,
		lastYear: 2018,
		firstYear: 2003,
		name: 'Saint Louis',
		key: 13,
	},
	{
        data: null,
		lastYear: 2018,
		firstYear: 2003,
		name: 'Vijayawada',
		key: 14,
	},
	{
        data: null,
		lastYear: 2018,
		firstYear: 2006,
		name: 'Dakar',
		key: 15,
	},
];

const mergedDatasetNames = mergedDataset.map(d => d.name);

const addPopulationData = (dataset, populationsData) => {
	dataset.forEach((d) => {
		const popupation = populationsData.find(p => p.name === d.name);
		//original data are in thousants
		if(popupation) {
			d.population = popupation.population * 1000
		}
	})
}
addPopulationData(mergedDataset, populationsData);

//add data to prepared datasets
const dataLoader = Promise.all(dataLoaders).then(datasets => {
	datasets.forEach(data => {
		const name = data.name;
		const dataset = mergedDataset.find(md => md.name === name)
		dataset.data = data;
	})
});

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
export const getMergedDataset = (names = mergedDatasetNames) => {
	const loader = new Promise((resolve, reject) => {
		dataLoader.then(() => {
			const data = [...mergedDataset.filter(d => names.includes(d.name))];
			
			data.forEach(dataset => {
		
				dataset['l3OverallFlowsCoverage'] = getOverallFlows(dataset, classesL3, (sourceKey, targetKey) => getL3ChangeCoverageValueKey(sourceKey, targetKey, dataset.firstYear, dataset.lastYear));
				dataset['l3OverallFlowsCoverage'].links = transformLinksValues(dataset['l3OverallFlowsCoverage'].links, conversions.toSquareKm);
		
				dataset['l4OverallFlowsCoverage'] = getOverallFlows(dataset, classesL4, (sourceKey, targetKey) => getL4ChangeCoverageValueKey(sourceKey, targetKey, dataset.firstYear, dataset.lastYear));
				dataset['l4OverallFlowsCoverage'].links = transformLinksValues(dataset['l4OverallFlowsCoverage'].links, conversions.toSquareKm);
			})
			const ordered =  data.sort((a,b) => {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );

			resolve(ordered);
		})
	});


	return loader;
}

export const getVectorLayer = (dataset, path = 'data.features') => {
	return {
		key: 'aoi-vector',
		name: 'AOI',
		type: 'vector',
		options: {
			keyProperty: 'key',
			nameProperty: 'name',
			features: {
				"type":"FeatureCollection",
				"name":"areas_boundaries",
				"crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:OGC:1.3:CRS84"}},
				"features": dataset.reduce((acc, d) => {
					let features = get(d, path);
					if(features.hasOwnProperty('type')) {
						features = [features];
					}
					return [...acc, ...features];
				}, [])
			},
			style: {
				strokeColor: "#fff",
				strokeWidth: 1,
			}
		}
	}
};
