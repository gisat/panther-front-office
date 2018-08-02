import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";

import presentation from './presentation';

const mapStateToProps = (state, props) => {
	return {
		user: Select.users.getActiveUser(state)
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		login: () => {
			dispatch(Action.components.overlays.openOverlay('login'));
		},
		logout: () => {
			dispatch(Action.users.apiLogoutUser());
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
