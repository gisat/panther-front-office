import { connect } from 'react-redux';
import Action from '../../../state/Action';
import Select from '../../../state/Select';
import PlaceSelector from '../../presentation/view-selectors/PlaceSelector';

const mapStateToProps = state => {
	return {
		activePlace: Select.places.getActive(state),
		places: Select.places.getPlacesForActiveScope(state)
	}
};

const mapDispatchToProps = dispatch => {
	return {
		onChangePlace: (key) => {
			//dispatch(Action.places.setActive(key)).then(() => {
			//	dispatch(Action.scenarios.load());
			//});
			dispatch(Action.places.setActive(key));
			dispatch(Action.scenarios.load());
			console.log('#######################');
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaceSelector);