import Model from './Model';

/**
 * @augments Model
 * @param options
 * @constructor
 */
class Scope extends Model {
    data() {
        return {
            id: {
                serverName: '_id',
                transformToLocal: Number
            },
            name: {
                serverName: 'name'
            },
            description: {
                serverName: 'description'
            },
            periods: {
                serverName: 'years',
                transformToLocal: objects => {
                    return objects.map(obj => Number(obj))
                }
            },
            featureLayers: {
                serverName: 'featureLayers',
                transformToLocal: objects => {
                    return objects.map(obj => Number(obj))
                }
            },
            isMapIndependentOfPeriod: {
                serverName: 'isMapIndependentOfPeriod'
            },
			isMapDependentOnScenario: {
				serverName: 'isMapDependentOnScenario'
			},
            aoiLayer: {
                serverName: 'aoiLayer'
            },
            removedTools: {
                serverName: 'removedTools'
            },
            oneLayerPerMap: {
                serverName: 'oneLayerPerMap'
            },
            hideMapName: {
                serverName: 'hideMapName'
            },
            mapLayerInfo: {
                serverName: 'mapLayerInfo'
            },
            viewSelection: {
                serverName: 'viewSelection'
            },
            hideSidebarReports: {
                serverName: 'hideSidebarReports'
            },
            showTimeline: {
                serverName: 'showTimeline'
            },
            restrictEditingToAdmins: {
                serverName: 'restrictEditingToAdmins'
            },
            timelineContent: {
                serverName: 'timelineContent'
            },
            layersWidgetHiddenPanels: {
                serverName: 'layersWidgetHiddenPanels'
            },
            featurePlaceChangeReview: {
                serverName: 'featurePlaceChangeReview'
            },
            urls: {
                serverName: 'urls'
            },
			scenarios: {
				serverName: 'scenarios'
			},
			configuration: {
				serverName: 'configuration'
			}
        };
    };

}

export default Scope;
