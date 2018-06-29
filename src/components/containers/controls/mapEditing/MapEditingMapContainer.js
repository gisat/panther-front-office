import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import MapEditingMapContainer from "../../../presentation/controls/mapEditing/MapEditingMapContainer/MapEditingMapContainer";

const mapStateToProps = (state, ownProps) => {
	return {
		activeBackgroundLayerKey: Select.maps.getActiveBackgroundLayerKey(state),
		navigatorState: Select.maps.getNavigator(state),
		editedFeatures: Select.spatialDataSources.vector.noMemoGetEditedFeaturesBySourceKey(state, ownProps),
		selectedFeatures: Select.spatialDataSources.vector.noMemoGetSelectedFeaturesBySourceKey(state, ownProps),
        editedPolygonsInfo: Select.components.overlays.getEditedPolygonInfo(state)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		setLayerOpacity: (value) => {
			dispatch(Action.components.overlays.setScenarioMapEditingLayerOpacity(value));
		},
		onCloseOverlay: () => {
			dispatch(Action.components.overlays.closeOverlay(ownProps.overlayKey));
		},
		selectFeatureForBbox: (bbox) => {
			dispatch(Action.spatialDataSources.vector.loadFeaturesForBboxAndSelect(ownProps.dataSourceKey, bbox, 'replace')); //todo other modes?
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(MapEditingMapContainer);