const getSquareCentimeters = (val) => `${Math.round(val * 10000000) / 1000} cm2`;
const getCentimeters = (val) => `${Math.round(val * 10000000) / 100000} cm`;
const getGramsFromKilograms = (val) => `${Math.round(val * 100000) / 100} g`;
const getMicrogramsFromGrams = (val) => `${Math.round(val * 100000) / 100} mg`;
const getDollars = (val) => `${Math.round(val * 10000) / 10000} $`;

export default [
	//hneda
	// {
	// 	name: 'CD_TP_MEAN_POP',
	// 	color: '#CA4466',
	// 	getTooltip: getCentimeters,
	// 	title: 'Stem Diameter'
	// },
	// {
	// 	name: 'H_TP_MEAN_POP',
	// 	color: '#CA4466',
	// 	getTooltip: getCentimeters,
	// 	title: 'Tree Height'
	// },
	// {
	// 	name: 'LF_AR_M2_TP_MEAN_POP',
	// 	color: '#CA4466',
	// 	getTooltip: getSquareCentimeters,
	// 	title: 'Leaf Area'
	// },


	//zelena
	// {
	// 	name: 'CO_STOR_KG_TP_MEAN_POP',
	// 	color: '#568038',
	// 	getTooltip: getGramsFromKilograms,
	// 	title: 'Stored Carbon'
	// },
	// {
	// 	name: 'CO_SEQ_KG_TP_MEAN_POP',
	// 	color: '#568038',
	// 	getTooltip: getGramsFromKilograms,
	// 	title: 'Sequestered Carbon'
	// },
	// {
	// 	name: 'CO_AVO_KG_TP_MEAN_POP',
	// 	color: '#568038',
	// 	getTooltip: getGramsFromKilograms,
	// 	title: 'Avoided Runoff'
	// },
	// {
	// 	name: 'POL_REM_G_TP_MEAN_POP',
	// 	color: '#568038',
	// 	getTooltip: getMicrogramsFromGrams,
	// 	title: 'Removed air pollution'
	// },


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
		title: 'Sequestered Carbon'
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

