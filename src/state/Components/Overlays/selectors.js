import {createSelector} from 'reselect';
import _ from 'lodash';

import Views from './Views/selectors';

const getOverlay = (state, props) => state.components.overlays[props.key];
const getOverlays = (state) => state.components.overlays;

const getScenarioMapEditingDataSourceKey = (state) => state.components.overlays.scenarioMapEditing.map.dataSourceKey;

const isOverlayOpen = createSelector(
	getOverlay,
	(overlay) => {
		return overlay ? overlay.open : false;
	}
);

const getScenarioMapEditingMapData = createSelector(
	getOverlays,
	(overlays) => {
		return overlays && overlays.scenarioMapEditing && overlays.scenarioMapEditing.map ? overlays.scenarioMapEditing.map : null;
	}
);

const getEditedPolygonInfo = (state) => {
	return state.components.overlays.scenarioMapEditing.editedPolygonsInfo;
};

export default {
	getOverlay: getOverlay,
	isOverlayOpen: isOverlayOpen,

	getScenarioMapEditingMapData: getScenarioMapEditingMapData,
	getScenarioMapEditingDataSourceKey: getScenarioMapEditingDataSourceKey,
	getEditedPolygonInfo: getEditedPolygonInfo,

	views: Views
};