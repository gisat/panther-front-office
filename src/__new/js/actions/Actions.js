define([], function(){
	return {
		chartToggleDescription: "chart#toggleDescription",
		dataviewShow: "dataview#show",

		mapAdd: 'map#add',
		mapRemove: 'map#remove',

		mapControl: 'map#control',

		mapAddVisibleLayer: 'map#addVisibleLayer',
		mapRemoveVisibleLayer: 'map#removeVisibleLayer',
		mapSelectFromAreas: 'map#selectFromAreas',
		mapSwitchFramework: 'map#switchFramework',
		mapSwitchProjection: 'map#switchProjection',
		mapUseWorldWindOnly: 'map#useWorldWindOnly',
		mapZoomSelected: 'map#zoomSelected',
		mapZoomToExtent: 'map#zoomToExtent',

		mapsContainerToolsDetached: 'mapsContainer#toolsDetached',
		mapsContainerToolsPinned: 'mapsContainer#toolsPinned',

		filterAdd: 'filter#add',
		filterRemove: 'filter#remove',

		floatersSort: 'floaters#sort',

		periodsRebuild: 'periods#rebuild',
		periodsChange: 'periods#change',

		selectionSelected: 'selection#selected',
		selectionClearAll: 'selection#clearAll',
		selectionActiveCleared: 'selection#activeCleared',
		selectionEverythingCleared: 'selection#everythingCleared',

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
		mapShow3DFromDataview: 'map#show3DFromDataview',

		sharingUrlReceived: 'sharing#urlReceived',
		sharingViewShared: 'sharing#viewShared',

		widgetChangedState: 'widget#changedState',
		widgetPinMapTools: 'widget#pinMapTools'
	};
});