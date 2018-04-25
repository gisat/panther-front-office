import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import PlaceSelector from './PlaceSelector';

const mapStateToProps = state => {
	return {
		activePlace: Select.places.getActive(state),
		scope: Select.scopes.getActiveScopeData(state),
		places: Select.places.getPlacesForActiveScope(state),
		isDromasAdmin: Select.user.isDromasAdmin(state)
	}
};

const mapDispatchToProps = dispatch => {
	return {
		setActivePlace: (key) => {
			dispatch(Action.places.setActive(key));
		},
		clearLayerPeriods: () => {
			dispatch(Action.maps.clearLayerPeriodsOfAllMaps());
		},
		clearWmsLayers: () => {
			dispatch(Action.maps.clearWmsLayersOfAllMaps());
		},
		clearPlaceGeometryChangeReviewOfAllMaps: () => {
			dispatch(Action.maps.clearPlaceGeometryChangeReviewOfAllMaps());
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaceSelector);