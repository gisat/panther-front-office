import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";

import presentation from './presentation';

const mapStateToProps = (state, props) => {
	return {
		activeUser: Select.users.getActive(state),
		loginOverlayOpen: Select.components.get(state, 'App_Container', 'loginOverlayOpen'),
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		onLogIn: (email, password) => {
			dispatch(Action.users.apiLoginUser(email, password));
		},
		onLoginOverlayCancel: () => {
			dispatch(Action.components.set('App_Container', 'loginOverlayOpen', false));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
