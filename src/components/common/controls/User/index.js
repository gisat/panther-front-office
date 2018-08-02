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
		login: (username, password) => {
			Action.users.apiLoginUser(username, password);
		},
		logout: () => {
			Action.users.apiLogoutUser();
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
