import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import presentation from './presentation';

const mapStateToProps = (state, props) => {
	let hostName = window.location.hostname;
	let forceOpen = Select.components.overlays.isOverlayOpen(state, {key: 'login'});
	let isActiveDataviewUnreceived = Select.dataviews.isActiveUnreceived(state);

	return {
		eossoLogin: hostName === "urban-tep.eu",
		loginRequired: isActiveDataviewUnreceived,
		open: forceOpen || isActiveDataviewUnreceived
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		login: (email, password) => {
			dispatch(Action.users.apiLoginUser(email, password));
		},
		openOverlay: () => {
			dispatch(Action.components.overlays.openOverlay('login'));
		},
		close: () => {
			dispatch(Action.components.overlays.closeOverlay('login'));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
