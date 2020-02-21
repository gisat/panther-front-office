import {
	getKilograms,
	getCubicMetersPerYear,
	getKilogramsPerYear,
	getKilowattsPerYear,
	getGramsPerYear,
} from '../../../../utils/units'


export default [
	//zelena
	{
		name: 'CO_STOR_KG',
		color: '#012300',
		getTooltip: getKilograms,
		title: 'Stored Carbon'
	},
	{
		name: 'CO_SEQ_KG',
		color: '#0b3500',
		getTooltip: getKilogramsPerYear,
		title: 'Sequestered Carbon',
	},
	{
		name: 'RUNOFF_M3',
		color: '#1c4701',
		getTooltip: getCubicMetersPerYear,
		title: 'Avoided runoff'
	},
	{
		name: 'CO_AVO_KG',
		color: '#2f5913',
		getTooltip: getKilogramsPerYear,
		title: 'Avoided carbon'
	},
	{
		name: 'HE_KWH',
		color: '#436d26',
		getTooltip: getKilowattsPerYear,
		title: 'Heating effects'
	},
	{
		name: 'CO_KWH',
		color: '#568038',
		getTooltip: getKilowattsPerYear,
		title: 'Cooling effects'
	},
	{
		name: 'POL_CO_G',
		color: '#6a944b',
		getTooltip: getGramsPerYear,
		title: 'CO removal'
	},
	{
		name: 'POL_O3_G',
		color: '#7ea95e',
		getTooltip: getGramsPerYear,
		title: 'O3 removal'
	},
	{
		name: 'POL_NO2_G',
		color: '#93be71',
		getTooltip: getGramsPerYear,
		title: 'NO2 removal'
	},
	{
		name: 'POL_SO2_G',
		color: '#a8d485',
		getTooltip: getGramsPerYear,
		title: 'SO2 removal'
	},
	{
		name: 'POL_PM25_G',
		color: '#bde99a',
		getTooltip: getGramsPerYear,
		title: 'PM2.5 removal'
	},
	{
		name: 'VOC_G',
		color: '#d5ffb1',
		getTooltip: getGramsPerYear,
		title: 'VOCs'
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

