// const getDollars = (val) => `${Math.round(val * 10000) / 10000} $`;
import {
	getNOK,
} from '../../../../utils/units'


export default [
	//modra
	{
		name: 'CO_SEQ_CAP_MEAN',
		normalisedName: 'CO_SEQ_CAP_MEAN_POP',
		color: '#001f62',
		getTooltip: getNOK,
		title: 'Carbon sequestration'
	},
	{
		name: 'CO_AVO_CAP_MEAN',
		normalisedName: 'CO_AVO_CAP_MEAN_POP',
		color: '#00357c',
		getTooltip: getNOK,
		title: 'Avoided carbon'
	},
	{
		name: 'POL_CO_CAP_MEAN',
		normalisedName: 'POL_CO_CAP_MEAN_POP',
		color: '#074b97',
		getTooltip: getNOK,
		title: 'CO removal'
	},
	{
		name: 'POL_O3_CAP_MEAN',
		normalisedName: 'POL_O3_CAP_MEAN_POP',
		color: '#2d60af',
		getTooltip: getNOK,
		title: 'O3 removal'
	},
	{
		name: 'POL_NO_CAP_MEAN',
		normalisedName: 'POL_NO_CAP_MEAN_POP',
		color: '#4b75c8',
		getTooltip: getNOK,
		title: 'NO2 removal'
	},
	{
		name: 'POL_SO_CAP_MEAN',
		normalisedName: 'POL_SO_CAP_MEAN_POP',
		color: '#658ce0',
		getTooltip: getNOK,
		title: 'SO2 removal'
	},
	{
		name: 'POL_PM_CAP_MEAN',
		normalisedName: 'POL_PM_CAP_MEAN_POP',
		color: '#7fa3fa',
		getTooltip: getNOK,
		title: 'PM2.5 removal'
	},
	{
		name: 'POL_RE_CAP_MEAN',
		normalisedName: 'POL_RE_CAP_MEAN_POP',
		color: '#9bbdff',
		getTooltip: getNOK,
		title: 'Pollution removal'
	},
	{
		name: 'RUNOFF_CAP_MEAN',
		normalisedName: 'RUNOFF_CAP_MEAN_POP',
		color: '#b8d8ff',
		getTooltip: getNOK,
		title: 'Avoided runoff'
	},
	{
		name: 'ENERGY_CAP_MEAN',
		normalisedName: 'ENERGY_CAP_MEAN_POP',
		color: '#d4f3ff',
		getTooltip: getNOK,
		title: 'Energy savings'
	},
];

