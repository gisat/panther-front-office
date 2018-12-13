import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";

import presentation from './presentation';

const mapStateToProps = (state, props) => {
	return {
		loginRequired: Select.components.overlays.isLoginRequired(state),
		open: Select.components.overlays.isOverlayOpen(state, {key: 'login'})
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		login: (email, password) => {
			dispatch(Action.users.apiLoginUser(email, password));
		},
		loginAndReload: (email, password) => {
			dispatch(Action.users.apiLoginUser(email, password)).then(() => {
				dispatch(Action.dataviews.loadActive());
			});
		},
		close: () => {
			dispatch(Action.components.overlays.closeOverlay('login'));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
