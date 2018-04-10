import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import PlaceSelector from './PlaceSelector';

const mapStateToProps = state => {
	return {
		activePlace: Select.places.getActive(state),
		scope: Select.scopes.getActiveScopeData(state),
		places: Select.places.getPlacesForActiveScope(state),
		userIsAdmin: Select.user.isAdmin(state)
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
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaceSelector);