import utils from "../utils";
import {style_BASE_GRW, style_EOS, style_LOS_GRW, style_LOS_SEN, style_LOS_TOT, style_SOS} from "./MapStyles";

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

export const fenologyOptions = [
	{
		key: "SOS",
		name: "Datum začátku vegetační sezóny",
		longName: "Datum začátku vegetační sezóny (SOS)",
		unit: "DOY",
		style: style_SOS
	},{
		key: "EOS",
		name: "Datum konce vegetační sezóny",
		longName: "Datum konce vegetační sezóny (EOS)",
		unit: "DOY",
		style: style_EOS
	},{
		key: "LOS_GRW",
		name: "Délka růstové fáze",
		longName: "Délka růstové fáze (LOS_GRW)",
		unit: "dny",
		style: style_LOS_GRW
	},{
		key: "LOS_SEN",
		name: "Délka senescenční fáze",
		longName: "Délka senescenční fáze (LOS_SEN)",
		unit: "dny",
		style: style_LOS_SEN
	}, {
		key: "LOS_TOT",
		name: "Celková délka vegetační sezóny",
		longName: "Celková délka vegetační sezóny (LOS_TOT)",
		unit: "dny",
		style: style_LOS_TOT
	}, {
		key: "BASE_GRW",
		name: "Počáteční úroveň (baseline) růstové fáze ",
		longName: "Počáteční úroveň (baseline) růstové fáze (BASE_GRW)",
		unit: "NDVI",
		style: style_BASE_GRW
	}, {
		key: "BASE_SEN",
		name: "Koncová úroveň (baseline) senescenční fáze",
		longName: "Koncová úroveň (baseline) senescenční fáze (BASE_SEN)",
		unit: "NDVI",
		style: null
	}, {
		key: "CLIMAX_DOY",
		name: "Datum maxima vegetační sezóny",
		longName: "Datum maxima vegetační sezóny (CLIM_DOY)",
		unit: "DOY",
		style: null
	}, {
		key: "CLIMAX_VI",
		name: "Maximální dosažená hodnota NDVI",
		longName: "Maximální dosažená hodnota NDVI (CLIMAX_VI)",
		unit: "MDVI",
		style: null
	}, {
		key: "AMPLITUDE",
		name: "Sezónní amplituda NDVI",
		longName: "Sezónní amplituda NDVI (AMPLITUDE)",
		unit: "NDVI",
		style: null
	}, {
		key: "GRW_DOY",
		name: "Datum maximální rychlosti nárůstu NDVI v růstové fázi",
		longName: "Datum maximální rychlosti nárůstu NDVI v růstové fázi (GRW_DOY)",
		unit: "DOY",
		style: null
	}, {
		key: "GRW_RATE",
		name: "Hodnota maximální rychlosti nárůstu NDVI v růstové fázi",
		longName: "Hodnota maximální rychlosti nárůstu NDVI v růstové fázi (GRW_RATE)",
		unit: "",
		style: null
	}, {
		key: "SEN_DOY",
		name: "Datum maximální rychlosti poklesu NDVI v senescenční fázi",
		longName: "Datum maximální rychlosti poklesu NDVI v senescenční fázi (SEN_DOY)",
		unit: "DOY",
		style: null
	}, {
		key: "SEN_RATE",
		name: "Hodnota maximální rychlosti pokledu NDVI v senescenční fázi",
		longName: "Hodnota maximální rychlosti pokledu NDVI v senescenční fázi (SEN_RATE)",
		unit: "",
		style: null
	}, {
		key: "LINT_GRW",
		name: "Gross productivity růstové fáze",
		longName: "Gross productivity růstové fáze (LINT_GRW)",
		unit: "",
		style: null
	}, {
		key: "LINT_SEN",
		name: "Gross productivity senescenční fáze",
		longName: "Gross productivity senescenční fáze (LINT_SEN)",
		unit: "",
		style: null
	}, {
		key: "LINT_TOT",
		name: "Gross productivity - celková",
		longName: "Gross productivity - celková (LINT_TOT)",
		unit: "",
		style: null
	}, {
		key: "SINT_GRW",
		name: "Net productivity růstové fáze",
		longName: "Net productivity růstové fáze (SINT_GRW)",
		unit: "",
		style: null
	}, {
		key: "SINT_SEN",
		name: "Net productivity senescenční fáze",
		longName: "Net productivity senescenční fáze (SINT_SEN)",
		unit: "",
		style: null
	}, {
		key: "SINT_TOT",
		name: "Net productivity - celková",
		longName: "Net productivity - celková (SINT_TOT)",
		unit: "",
		style: null
	}
];