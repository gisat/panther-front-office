const getSquareMeters = (val) => `${Math.round(val * 100) / 100} m2`;

export default [
	{
		name: 'Agriculture  low vegetation',
		color: '#CA4466',
		getTooltip: getSquareMeters,
		title: 'Agriculture  low vegetation'
	},
	{
		name: 'Tree canopy',
		color: '#CA4466',
		getTooltip: getSquareMeters,
		title: 'Tree canopy'
	},
	
];

