const getRoundedKilometers = (val) => `${Math.round(val/1000000 * 100) / 100} km2`;
const getSquareMeters = (val) => `${Math.round(val * 100) / 100} m2`;
const getSquareCentiMeters = (val) => `${Math.round(val * 10000000) / 1000} cm2`;
const getCentiMeters = (val) => `${Math.round(val * 10000000) / 100000} cm`;
const getMeters = (val) => `${Math.round(val * 100) / 100} m`;
const getKilograms = (val) => `${Math.round(val * 100) / 100} kg`;
const getGrams = (val) => `${Math.round(val * 100) / 100} g`;
const getGramsFromKilograms = (val) => `${Math.round(val * 100000) / 100} g`;
const getMicroGramsFromGrams = (val) => `${Math.round(val * 100000) / 100} mg`;
const getDollars = (val) => `${Math.round(val * 10000) / 10000} $`;

export default [
	//hneda
	{
		name: 'CD_TP_MEAN_POP',
		color: '#CA4466',
		getTooltip: getCentiMeters,
		title: 'Stem Diameter'
	},
	{
		name: 'H_TP_MEAN_POP',
		color: '#CA4466',
		getTooltip: getCentiMeters,
		title: 'Tree Height'
	},
	{
		name: 'LF_AR_M2_TP_MEAN_POP',
		color: '#CA4466',
		getTooltip: getSquareCentiMeters,
		title: 'Leaf Area'
	},


	//zelena
	{
		name: 'CO_STOR_KG_TP_MEAN_POP',
		color: '#568038',
		getTooltip: getGramsFromKilograms,
		title: 'Stored Carbon'
	},
	{
		name: 'CO_SEQ_KG_TP_MEAN_POP',
		color: '#568038',
		getTooltip: getGramsFromKilograms,
		title: 'Sequestrated Carbon'
	},
	{
		name: 'CO_AVO_KG_TP_MEAN_POP',
		color: '#568038',
		getTooltip: getGramsFromKilograms,
		title: 'Avoided Runoff'
	},
	{
		name: 'POL_REM_G_TP_MEAN_POP',
		color: '#568038',
		getTooltip: getMicroGramsFromGrams,
		title: 'Removed air pollution'
	},


	//modra
	{
		name: 'CO_STO_N17_TP_MEAN_POP',
		color: '#4974C6',
		getTooltip: getGramsFromKilograms,
		title: 'Stored Carbon'
	},
	{
		name: 'CO_SEQ_N17_TP_MEAN_POP',
		color: '#4974C6',
		getTooltip: getGramsFromKilograms,
		title: 'Sequestrated Carbon'
	},
	{
		name: 'CO_AVO_N17_TP_MEAN_POP',
		color: '#4974C6',
		getTooltip: getGramsFromKilograms,
		title: 'Avoided runoff'
	},
	{
		name: 'POL_RE_N17_TP_MEAN_POP',
		color: '#4974C6',
		getTooltip: getGramsFromKilograms,
		title: 'Removed air pollution'
	},
	{
		name: 'TOTBEN_N17_TP_MEAN_POP',
		color: '#4974C6',
		getTooltip: getDollars,
		title: 'Annual Benefits'
	}
];

