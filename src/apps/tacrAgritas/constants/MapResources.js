import utils from "../utils";

const cartoDbLight = {
	key: 'cartoDbBasemap',
	type: 'wmts',
	options: {
		url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
	}
};

const cartoDbVoyagerLight = {
	key: 'cartoDbBasemap',
	type: 'wmts',
	options: {
		url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager_labels_under/{z}/{x}/{y}.png'
	}
};

export default {
	cartoDbLight,
	cartoDbVoyagerLight
}

export const fidColumnName = 'ID_DPB';
export const nameColumnName = 'NKOD_DPB2';
export const cropColumnName = 'CROP_NAME';
export const climRegionColumnName = 'CLIM_LABEL';

export const mapPeriodOptions = [
	{
		key: "0301_0310",
		label: "1. - 10. března"
	}, {
		key: "0311_0320",
		label: "11. - 20. března"
	}, {
		key: "0321_0331",
		label: "21. - 31. března"
	}, {
		key: "0401_0410",
		label: "1. - 10. dubna"
	}, {
		key: "0411_0420",
		label: "11. - 20. dubna"
	}, {
		key: "0421_0430",
		label: "21. - 30. dubna"
	}, {
		key: "0501_0510",
		label: "1. - 10. května"
	}, {
		key: "0511_0520",
		label: "11. - 20. května"
	}, {
		key: "0521_0531",
		label: "21. - 31. května"
	}, {
		key: "0601_0610",
		label: "1. - 10. června"
	}, {
		key: "0611_0620",
		label: "11. - 20. června"
	}, {
		key: "0621_0630",
		label: "21. - 30. června"
	}, {
		key: "0701_0710",
		label: "1. - 10. července"
	}, {
		key: "0711_0720",
		label: "11. - 20. července"
	}, {
		key: "0721_0731",
		label: "21. - 31. července"
	}, {
		key: "0801_0810",
		label: "1. - 10. srpna"
	}, {
		key: "0811_0820",
		label: "11. - 20. srpna"
	}, {
		key: "0821_0831",
		label: "21. - 31. srpna"
	}, {
		key: "0901_0910",
		label: "1. - 10. září"
	}, {
		key: "0911_0920",
		label: "11. - 20. září"
	}, {
		key: "0921_0930",
		label: "21. - 30. září"
	}, {
		key: "1001_1010",
		label: "1. - 10. října"
	}, {
		key: "1011_1020",
		label: "11. - 20. října"
	}, {
		key: "1021_1031",
		label: "21. - 31. října"
	}
];

export const mapPeriodOptionsHistorie = [
	{
		key: "0301_0315",
		label: "1. - 15. března"
	}, {
		key: "0316_0331",
		label: "16. - 31. března"
	}, {
		key: "0401_0415",
		label: "1. - 15. dubna"
	}, {
		key: "0416_0430",
		label: "16. - 30. dubna"
	}, {
		key: "0501_0515",
		label: "1. - 15. května"
	}, {
		key: "0516_0531",
		label: "16. - 31. května"
	}, {
		key: "0601_0615",
		label: "1. - 15. června"
	}, {
		key: "0615_0630",
		label: "16. - 30. června"
	}, {
		key: "0701_0715",
		label: "1. - 15. července"
	}, {
		key: "0716_0731",
		label: "16. - 31. července"
	}, {
		key: "0801_0815",
		label: "1. - 15. srpna"
	}, {
		key: "0816_0831",
		label: "16. - 31. srpna"
	}, {
		key: "0901_0915",
		label: "1. - 15. září"
	}, {
		key: "0916_0930",
		label: "16. - 30. září"
	}, {
		key: "1001_1015",
		label: "1. - 15. října"
	}, {
		key: "1016_1031",
		label: "16. - 31. října"
	}
];

export const outlinesStyle = utils.fillStyleTemplate(
	{
		"outlineWidth": 2,
		"outlineColor": "#888888",
		"fillOpacity": 0
	}
);