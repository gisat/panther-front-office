// const getDollars = (val) => `${Math.round(val * 10000) / 10000} $`;
import {
	getGramsFromKilograms,
	getDollars,
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
		normalisedName: 'CO_STO_N17_TP_MEAN_POP',
		name: 'CO_STO_N17_TP_MEAN',
		color: '#002062',
		getTooltip: getGramsFromKilograms,
		title: 'Stored Carbon'
	},
	{
		normalisedName: 'CO_SEQ_N17_TP_MEAN_POP',
		name: 'CO_SEQ_N17_TP_MEAN',
		color: '#064b97',
		getTooltip: getGramsFromKilograms,
		title: 'Sequestered Carbon'
	},
	{
		normalisedName: 'CO_AVO_N17_TP_MEAN_POP',
		name: 'CO_AVO_N17_TP_MEAN',
		color: '#4b75c8',
		getTooltip: getGramsFromKilograms,
		title: 'Avoided runoff'
	},
	{
		normalisedName: 'POL_RE_N17_TP_MEAN_POP',
		name: 'POL_RE_N17_TP_MEAN',
		color: '#7fa2fa',
		getTooltip: getGramsFromKilograms,
		title: 'Removed air pollution'
	},
	{
		normalisedName: 'TOTBEN_N17_TP_MEAN_POP',
		name: 'TOTBEN_N17_TP_MEAN',
		color: '#b7d7ff',
		getTooltip: getDollars,
		title: 'Annual Benefits'
	}
];

