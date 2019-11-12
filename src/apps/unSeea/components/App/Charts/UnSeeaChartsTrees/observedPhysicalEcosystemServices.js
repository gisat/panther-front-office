const getSquareMeters = (val) => `${Math.round(val * 100) / 100} m2`;
const getCentimeters = (val) => `${Math.round(val * 100) / 100} cm`;
const getMeters = (val) => `${Math.round(val * 100) / 100} m`;
const getKilograms = (val) => `${Math.round(val * 100) / 100} kg`;
const getSquareMetersPerYear = (val) => `${Math.round(val * 100) / 100} m3/year`;
const getKilogramsPerYear = (val) => `${Math.round(val * 100) / 100} kg/year`;
const getKilowattsPerYear = (val) => `${Math.round(val * 100) / 100} KWh/year`;
const getGrams = (val) => `${Math.round(val * 100) / 100} g`;
const getGramsPerYear = (val) => `${Math.round(val * 100) / 100} g/year`;
const getDollars = (val) => `${Math.round(val * 10) / 10} $`;

export default [
	//zelena
	{
		name: 'CO_STOR_KG',
		color: '#568038',
		getTooltip: getKilograms,
		title: 'Stored Carbon'
	},
	{
		name: 'CO_SEQ_KG',
		color: '#568038',
		getTooltip: getKilogramsPerYear,
		title: 'Sequestrated Carbon'
	},
	{
		name: 'RUNOFF_M3',
		color: '#568038',
		getTooltip: getSquareMetersPerYear,
		title: 'Sequestrated Carbon'
	},
	{
		name: 'CO_AVO_KG',
		color: '#568038',
		getTooltip: getKilogramsPerYear,
		title: 'Avoided carbon'
	},
	{
		name: 'HE_KWH',
		color: '#568038',
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
		color: '#568038',
		getTooltip: getGramsPerYear,
		title: 'CO removal'
	},
	{
		name: 'POL_O3_G',
		color: '#568038',
		getTooltip: getGramsPerYear,
		title: 'O3 removal'
	},
	{
		name: 'POL_NO2_G',
		color: '#568038',
		getTooltip: getGramsPerYear,
		title: 'NO2 removal'
	},
	{
		name: 'POL_SO2_G',
		color: '#568038',
		getTooltip: getGramsPerYear,
		title: 'SO2 removal'
	},
	{
		name: 'POL_PM25_G',
		color: '#568038',
		getTooltip: getGramsPerYear,
		title: 'PM2.5 removal'
	},
	{
		name: 'VOC_G',
		color: '#568038',
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
	// 	title: 'Sequestrated Carbon'
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

