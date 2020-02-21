import {
	getGramsFromKilograms,
	getKilogramsFromGrams,
	getCubicMetersPerYear,
	getKilogramsPerYear,
} from '../../../../utils/units'

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
		normalisedName: 'CO_STOR_KG_TP_MEAN_POP',
		name: 'CO_STOR_KG_TP_MEAN',
		color: '#1b4700',
		getTooltip: getKilogramsPerYear,
		title: 'Stored Carbon'
	},
	{
		normalisedName: 'CO_SEQ_KG_TP_MEAN_POP',
		name: 'CO_SEQ_KG_TP_MEAN',
		color: '#568038',
		getTooltip: getKilogramsPerYear,
		title: 'Sequestered Carbon'
	},
	{
		normalisedName: 'CO_AVO_KG_TP_MEAN_POP',
		name: 'CO_AVO_KG_TP_MEAN',
		color: '#92be71',
		// getTooltip: (val) => `${getGramsFromKilograms(val)}/year`,
		getTooltip: getCubicMetersPerYear, //realy?
		title: 'Avoided Runoff'
	},
	{
		normalisedName: 'POL_REM_G_TP_MEAN_POP',
		name: 'POL_REM_G_TP_MEAN',
		color: '#d4ffb0',
		getTooltip: (val) => `${getKilogramsFromGrams(val)}/year`,
		title: 'Removed air pollution'
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
	// 	title: 'Sequestered Carbon'
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

