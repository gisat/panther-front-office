define([], function(){
	return {
		adjustConfiguration: 'fo#adjustConfiguration',
		adjustConfigurationFromDataview: 'fo#adjustConfigurationFromDataview',
		foMapIsIndependentOfPeriod: 'fo#mapIsIndependentOfPeriod',
		foMapIsDependentOnPeriod: 'fo#mapIsDependentOnPeriod',

		customizationUserChanged: 'customization#userChanged',

		chartToggleDescription: "chart#toggleDescription",
		dataviewShow: "dataview#show",
		dataviewWithoutAoi: "dataview#withoutAoi",

		mapAdd: 'map#add',
		mapAdded: 'map#added',
		mapRemove: 'map#remove',
		mapRemoved: 'map#removed',
		mapSelected: 'map#selected',
		mapDefaultMapUnselected: 'map#defaultMapUnselected',

		mapControl: 'map#control',

		mapAddVisibleLayer: 'map#addVisibleLayer',
		mapRemoveVisibleLayer: 'map#removeVisibleLayer',
		mapSelectFromAreas: 'map#selectFromAreas',
		mapSwitchProjection: 'map#switchProjection',
		mapSwitchTo2D: 'map#switchTo2D',
		mapSwitchTo3D: 'map#switchTo3D',
		mapUseWorldWindOnly: 'map#useWorldWindOnly',
		mapZoomSelected: 'map#zoomSelected',
		mapZoomToExtent: 'map#zoomToExtent',
		mapZoomToArea: 'map#zoomToArea',

		mapsContainerAddMap: 'mapsContainer#addMap',
		mapsContainerDisableAdding: 'mapsContainer#disableAdding',
		mapsContainerEnableAdding: 'mapsContainer#enableAdding',
		mapsContainerToolsDetached: 'mapsContainer#toolsDetached',
		mapsContainerToolsPinned: 'mapsContainer#toolsPinned',

		navigatorUpdate: 'navigator#update',

		filterAdd: 'filter#add',
		filterRemove: 'filter#remove',

		floatersSort: 'floaters#sort',

		periodsChange: 'periods#change',
		periodsDefault: 'periods#default',
		periodsRebuild: 'periods#rebuild',

		scopeActiveChanged: 'scope#activeScopeChanged',
		scopeAoiLayer: 'scope#aoiLayer',
		scopeAoiLayerUpdate: 'scope#aoiLayerUpdate',

		selectionSelected: 'selection#selected',
		selectionClearAll: 'selection#clearAll',
		selectionActiveCleared: 'selection#activeCleared',
		selectionEverythingCleared: 'selection#everythingCleared',

		stateUpdatePlace: 'state#updatePlace',
		stateUpdatePeriod: 'state#updatePeriod',
		stateUpdateAnalyticalUnitLevel: 'state#updatAnalyticalUnitLevel',
		stateUpdateTheme: 'state#updateTheme',
		stateUpdateScope: 'state#updateScope',

		toolBarClick3d: 'toolBar#click3DMapButton',
		toolBarDisable3d: 'toolBar#disable3DMapButton',
		toolBarEnable3d: 'toolBar#enable3DMapButton',

		layerSelect: 'layer#select',

		extLoaded: 'extLoaded',
		extThemeYearLoaded: 'extRestructured',

		userChanged: 'user#changed',

		sharingUrlReceived: 'sharing#urlReceived',
		sharingViewShared: 'sharing#viewShared',

		widgetChangedState: 'widget#changedState',
		widgetPinMapTools: 'widget#pinMapTools',
		worldWindWidgetRebuild: 'worldWindWidget#rebuild'
	};
});