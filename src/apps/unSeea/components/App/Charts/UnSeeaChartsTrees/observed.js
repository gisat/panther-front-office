const getRoundedKilometers = (val) => `${Math.round(val/1000000 * 100) / 100} km2`;
const getSquareMeters = (val) => `${Math.round(val * 100) / 100} m2`;
const getMeters = (val) => `${Math.round(val * 100) / 100} m`;
const getKilograms = (val) => `${Math.round(val * 100) / 100} kg`;
const getGrams = (val) => `${Math.round(val * 100) / 100} g`;

export default [
	//hneda
	{
		name: 'CD',
		color: '#CA4466',
		getTooltip: getMeters,
		title: 'Stem Diameter'
	},
	{
		name: 'H',
		color: '#CA4466',
		getTooltip: getMeters,
		title: 'Tree Height'
	},
	{
		name: 'LF_AR_M2',
		color: '#CA4466',
		getTooltip: getSquareMeters,
		title: 'Leaf Area'
	},


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
		getTooltip: getKilograms,
		title: 'Sequestrated Carbon'
	},
	{
		name: 'CO_AVO_KG',
		color: '#568038',
		getTooltip: getKilograms,
		title: 'Avoided Runoff'
	},
	{
		name: 'POL_REM_G',
		color: '#568038',
		getTooltip: getGrams,
		title: 'Removed air pollution'
	},


	//modra
	{
		name: 'CO_STO_N17',
		color: '#4974C6',
		getTooltip: getKilograms,
		title: 'Stored Carbon'
	},
	{
		name: 'CO_SEQ_N17',
		color: '#4974C6',
		getTooltip: getKilograms,
		title: 'Sequestrated Carbon'
	},
	{
		name: 'CO_AVO_N17',
		color: '#4974C6',
		getTooltip: getKilograms,
		title: 'Avoided runoff'
	},
	{
		name: 'POL_RE_N17',
		color: '#4974C6',
		getTooltip: getKilograms,
		title: 'Removed air pollution'
	},
	{
		name: 'TOTBEN_N17',
		color: '#4974C6',
		getTooltip: getKilograms,
		title: 'Annual Benefits'
	}
];

