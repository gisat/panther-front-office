import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";

import presentation from '../../../../components/common/controls/User/presentation';

const filterComponentId = 'SzifCaseTableFilterStatus';

const mapStateToProps = (state, props) => {
	return {
		user: Select.users.getActiveUser(state)
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		login: () => {
			dispatch(Action.components.set('App_Container', 'loginOverlayOpen', true));
		},
		logout: () => {
			dispatch(Action.users.apiLogoutUser());
			//clear comlonents
			dispatch(Action.components.set(filterComponentId, '', null))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
