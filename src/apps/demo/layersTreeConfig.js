export default [
	{
		type: 'folder', 
		key: 'XXXXX',
		title: 'podkladové vrstvy',
		expanded: false,
		icon: '',
		radio: false,  //optional
		items: [],  //optional
	},{
		type: 'folder', 
		key: 'YYYYY',
		title: 'vrstvy',
		expanded: true,
		icon: '', //optional
		radio: true, //optional
		items: [
			{
				type: 'layerTemplate',
				key: '54b2d81b-9cd2-4409-ac1c-464c864bd1dc',
				visible: false,
			},
			{
				type: 'layerTemplate',
				key: 'fcbd3f6b-d376-4e83-a0e2-03bdf36c3b46',
				visible: false,
			},
			{
				type: 'folder', 
				key: 'XYYYXXX',
				title: 'podkladové vrstvy',
				expanded: false,
				icon: '',
				radio: false,  //optional
				items: [
					{
						type: 'layerTemplate',
						key: '54b2d81b-9cd2-4409-ac1c-464c864bd1dc',
						visible: false,
					},
				],  //optional
			}
		],
	},
]