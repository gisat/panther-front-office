export default [
	{
		layers: {
			type: 'folder', 
			key: 'YYYYY',
			title: 'vrstvy',
			expanded: true,
			icon: '', //optional
			items: [
				{
					type: 'folder', 
					key: 'YYYYX',
					title: 'aaa',
					expanded: true,
					icon: '', //optional
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
					],
		},
	]},
	backgroundLayers:  [
					{
						type: 'layerTemplate',
						layerTemplateKey: '54b2d81b-9cd2-4409-ac1c-464c864bd1dc',
						visible: false,
					},
					{
						type: 'colored',
						color: '#FFF',
						visible: true,
					},
				],
	areas: { 
			visible: false,
			opacity: 0.5,
			strokeColor: '#000',
			styleKey: null
	}
}
]