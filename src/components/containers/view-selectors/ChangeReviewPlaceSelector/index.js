import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import PlaceSelector from '../../../presentation/view-selectors/PlaceSelector';

const mapStateToProps = state => {

	let scope = Select.scopes.getActiveScopeData(state);
	let disabledHard = scope && scope.restrictEditingToAdmins && !Select.users.isDromasAdmin(state);

	return {
		activePlace: Select.places.getActive(state),
		places: Select.places.getPlacesForActiveScope(state),
		disabledHard: disabledHard
	}
};

const mapDispatchToProps = dispatch => {
	return {
		onChangePlace: (key) => {
			dispatch(Action.maps.clearLayerPeriodsOfAllMaps());
			dispatch(Action.maps.clearWmsLayersOfAllMaps());
			dispatch(Action.maps.clearPlaceGeometryChangeReviewOfAllMaps());
			dispatch(Action.places.setActive(key));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaceSelector);