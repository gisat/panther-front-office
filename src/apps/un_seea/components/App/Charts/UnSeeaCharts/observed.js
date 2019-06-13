const getRoundedKilometers = (val) => `${Math.round(val/1000000 * 100) / 100} km2`;

export default [
	{
		name: 'Agriculture  low vegetation',
		color: '#9acd32',
		getTooltip: getRoundedKilometers
	},
	{
		name: 'Area of Borough',
		color: '#eecbad',
		getTooltip: getRoundedKilometers
	},
	{
		name: 'Area of City',
		color: '#c71585',
		getTooltip: getRoundedKilometers
	},
	{
		name: 'Builtup Area',
		color: '#cdc0b0',
		getTooltip: getRoundedKilometers
	},
	{
		name: 'Open land',
		color: '#5c9cd0',
		getTooltip: getRoundedKilometers
	},
	{
		name: 'Population Census 2008',
		color: '#00ced1'
	},
	{
		name: 'Tree canopy',
		color: '#228b22',
		getTooltip: getRoundedKilometers
	},
	{
		name: 'Water',
		color: '#6495ed',
		getTooltip: getRoundedKilometers
	}
];

