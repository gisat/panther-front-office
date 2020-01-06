import { connect } from 'react-redux';
import Select from '../../../../../state/Select';
import Action from "../../../../../state/Action";

import presentation from './presentation';

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = (dispatch) => {
	return {
		goToPlace: (placeString) => {
			dispatch(Action.maps.goToPlace(placeString))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
