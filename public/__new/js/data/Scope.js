define(['./Model'], function(Model){
	/**
	 * @augments Model
	 * @param options
	 * @constructor
	 */
	var Scope = function(options) {
		Model.apply(this, arguments);
	};

	Scope.prototype = Object.create(Model.prototype);

	Scope.prototype.data = function(){
		return {
			id: {
				serverName: '_id'
			},
			name: {
				serverName: 'name'
			},
			periods: {
				serverName: 'years'
			},
			featureLayers: {
				serverName: 'featureLayers'
			},
			isMapIndependentOfPeriod: {
				serverName: 'isMapIndependentOfPeriod'
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
			}
		};
	};

	return Scope;
});
