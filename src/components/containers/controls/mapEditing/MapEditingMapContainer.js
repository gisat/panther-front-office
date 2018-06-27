import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import MapEditingMapContainer from "../../../presentation/controls/mapEditing/MapEditingMapContainer/MapEditingMapContainer";

const mapStateToProps = (state, ownProps) => {
	return {
		activeBackgroundLayerKey: Select.maps.getActiveBackgroundLayerKey(state),
		navigatorState: Select.maps.getNavigator(state)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onCloseOverlay: () => {
			dispatch(Action.components.overlays.closeOverlay(ownProps.overlayKey));
		},
		selectFeatureForBbox: (bbox) => {
			dispatch(Action.spatialDataSources.vector.loadFeaturesForBbox(ownProps.dataSourceKey, bbox))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(MapEditingMapContainer);