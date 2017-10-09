define([], function(){
	return {
		mapAdd: 'map#add',
		mapRemove: 'map#remove',

		mapControl: 'map#control',

		mapAddVisibleLayer: 'map#addVisibleLayer',
		mapRemoveVisibleLayer: 'map#removeVisibleLayer',
		mapSwitchFramework: 'map#switchFramework',
		mapSwitchProjection: 'map#switchProjection',

		filterAdd: 'filter#add',
		filterRemove: 'filter#remove',

		stateUpdatePlace: 'state#updatePlace',
		stateUpdatePeriod: 'state#updatePeriod',
		stateUpdateAnalyticalUnitLevel: 'state#updatAnalyticalUnitLevel',
		stateUpdateTheme: 'state#updateTheme',
		stateUpdateScope: 'state#updateScope',

		layerSelect: 'layer#select',

		extLoaded: 'extLoaded',
		extThemeYearLoaded: 'extRestructured',

		mapShow3D: 'map#show3D'
	};
});