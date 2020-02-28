import {connect} from 'react-redux';
import {Select, Action} from '@gisatcz/ptr-state';

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
		onLoginOverlayClose: () => {
			dispatch(Action.components.set('App_Container', 'loginOverlayOpen', false));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
