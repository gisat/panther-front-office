import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";

import presentation from './presentation';

const mapStateToProps = (state, props) => {
	return {
		open: Select.components.overlays.isOverlayOpen(state, {key: 'login'})
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		login: () => {

		},
		close: () => {
			dispatch(Action.components.overlays.closeOverlay('login'));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
