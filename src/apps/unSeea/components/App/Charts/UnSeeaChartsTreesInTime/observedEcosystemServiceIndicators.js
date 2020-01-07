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
	{
		name: 'G_ELEV',
		color: '#052600',
		// getTooltip: getGramsFromKilograms,
		title: 'G elevation'
	},
	{
		name: 'C_ELEV',
		color: '#28520b',
		// getTooltip: getGramsFromKilograms,
		title: 'C elevation'
	},
	{
		name: 'POLY_AREA',
		color: '#578139',
		// getTooltip: getGramsFromKilograms,
		title: 'Area'
	},
	{
		name: 'PERIMETER',
		color: '#87b266',
		// getTooltip: getMicrogramsFromGrams,
		title: 'Perimeter'
	},
	{
		name: 'MGBDIAM',
		color: '#bae697',
		// getTooltip: getMicrogramsFromGrams,
		title: 'MGBDIAM'
	},
	

	//modra
	// {
	// 	name: 'CO_STO_N17_TP_MEAN_POP',
	// 	color: '#4974C6',
	// 	getTooltip: getGramsFromKilograms,
	// 	title: 'Stored Carbon'
	// },
	// {
	// 	name: 'CO_SEQ_N17_TP_MEAN_POP',
	// 	color: '#4974C6',
	// 	getTooltip: getGramsFromKilograms,
	// 	title: 'Sequestrated Carbon'
	// },
	// {
	// 	name: 'CO_AVO_N17_TP_MEAN_POP',
	// 	color: '#4974C6',
	// 	getTooltip: getGramsFromKilograms,
	// 	title: 'Avoided runoff'
	// },
	// {
	// 	name: 'POL_RE_N17_TP_MEAN_POP',
	// 	color: '#4974C6',
	// 	getTooltip: getGramsFromKilograms,
	// 	title: 'Removed air pollution'
	// },
	// {
	// 	name: 'TOTBEN_N17_TP_MEAN_POP',
	// 	color: '#4974C6',
	// 	getTooltip: getDollars,
	// 	title: 'Annual Benefits'
	// }
];

