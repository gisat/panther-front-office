Ext.define('Puma.model.Dataset', {
    extend: 'Ext.data.Model',
    fields: [
        '_id', 'name', 'active', 'featureLayers', 'oneLevelOnly', 'aggregated', 'removedTools',
        'disabledBackgroundMaps', 'activeBackgroundMap', 'disabledLayerCategories', 'layerOptions',
        'disabledLayers', 'extraBackgroundLayers', 'hideSidebarReports', 'isMapIndependentOfPeriod', 'oneLayerPerMap',
        'mapLayerInfo', 'aoiLayer', 'viewSelection', 'showTimeline', 'timelineContent', 'layersWidgetHiddenPanels', 'featurePlaceChangeReview','scenarios'
    ],
    idProperty: '_id',
    proxy: {
        type: 'rest',
        url: Config.url + 'restricted/rest/dataset',
        reader: {
            type: 'json',
            root: 'data'
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            root: 'data'
        }
    }
});

