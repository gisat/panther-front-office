define([], function(){
	return {
		mapAdd: 'map#add',
		mapRemove: 'map#remove',

		mapAddVisibleLayer: 'map#addVisibleLayer',
		mapRemoveVisibleLayer: 'map#removeVisibleLayer',

		filterAdd: 'filter#add',
		filterRemove: 'filter#remove',

		stateUpdatePlace: 'state#updatePlace',
		stateUpdatePeriod: 'state#updatePeriod',
		stateUpdateAnalyticalUnitLevel: 'state#updatAnalyticalUnitLevel',
		stateUpdateTheme: 'state#updateTheme',
		stateUpdateScope: 'state#updateScope',

		layerSelect: 'layer#select',

		extLoaded: 'extLoaded',
		extThemeYearLoaded: 'extRestructured'
	};
});