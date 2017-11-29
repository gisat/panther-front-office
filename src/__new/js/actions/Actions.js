define([], function(){
	return {
		mapAdd: 'map#add',
		mapRemove: 'map#remove',

		mapControl: 'map#control',

		mapAddVisibleLayer: 'map#addVisibleLayer',
		mapRemoveVisibleLayer: 'map#removeVisibleLayer',
		mapSwitchFramework: 'map#switchFramework',
		mapSwitchProjection: 'map#switchProjection',
		mapUseWorldWindOnly: 'map#useWorldWindOnly',

		filterAdd: 'filter#add',
		filterRemove: 'filter#remove',

		periodsRebuild: 'periods#rebuild',
		periodsChange: 'periods#change',

		stateUpdatePlace: 'state#updatePlace',
		stateUpdatePeriod: 'state#updatePeriod',
		stateUpdateAnalyticalUnitLevel: 'state#updatAnalyticalUnitLevel',
		stateUpdateTheme: 'state#updateTheme',
		stateUpdateScope: 'state#updateScope',

		layerSelect: 'layer#select',

		extLoaded: 'extLoaded',
		extThemeYearLoaded: 'extRestructured',

		userChanged: 'user#changed',

		mapShow3D: 'map#show3D',
		mapShow3DFromDataview: 'map#show3DFromDataview'
	};
});