import {
	getSquareMeters,
	getMeters,
} from '../../../../utils/units'


export default [
	//hneda
	// {
	// 	name: 'CD',
	// 	color: '#CA4466',
	// 	getTooltip: getCentimeters,
	// 	title: 'Stem Diameter'
	// },
	{
		name: 'H',
		color: '#850030',
		getTooltip: getMeters,
		title: 'Tree Height'
	},
	{
		name: 'DBH',
		color: '#c33d61',
		getTooltip: getMeters,
		title: 'Stem Diameter'
	},
	{
		name: 'CAN_COV_M2',
		color: '#f67a97',
		getTooltip: getSquareMeters,
		title: 'Canopy area'
	},
	{
		name: 'LF_AR_M2',
		color: '#ffc7e2',
		getTooltip: getSquareMeters,
		title: 'Leaf Area'
	},


	//modra
	// no data for 
	//Carbon sequestration [NOK]
	// CO_AVO_CAP Avoided carbon [NOK]
	// POL_CO_CAP   CO removal [NOK]
	// POL_O3_CAP   O3 removal [NOK]
	// POL_NO_CAP   NO2 removal [NOK]
	// POL_SO_CAP    SO2 removal [NOK]
	// POL_PM_CAP    PM2.5 removal [NOK]
	// POL_RE_CAP    Pollution removal [NOK]
	// RUNOFF_CAP    Avoided runoff [NOK]
	// ENERGY_CAP  Energy savings [NOK]

	// {
	// 	name: 'CO_STO_N17',
	// 	color: '#4974C6',
	// 	getTooltip: getKilograms,
	// 	title: 'Stored Carbon'
	// },
	// {
	// 	name: 'CO_SEQ_N17',
	// 	color: '#4974C6',
	// 	getTooltip: getKilograms,
	// 	title: 'Sequestered Carbon'
	// },
	// {
	// 	name: 'CO_AVO_N17',
	// 	color: '#4974C6',
	// 	getTooltip: getKilograms,
	// 	title: 'Avoided runoff'
	// },
	// {
	// 	name: 'POL_RE_N17',
	// 	color: '#4974C6',
	// 	getTooltip: getKilograms,
	// 	title: 'Removed air pollution'
	// },
	// {
	// 	name: 'TOTBEN_N17',
	// 	color: '#4974C6',
	// 	getTooltip: getDollars,
	// 	title: 'Annual Benefits'
	// }
];

