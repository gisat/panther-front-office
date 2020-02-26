import { connect } from 'react-redux';
import {Select, Action} from '@gisatcz/ptr-state';

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
