import { connect } from 'react-redux';

import Action from '../../../state/Action';
import Select from '../../../state/Select';
import ViewCard from "../../presentation/controls/ViewCard/ViewCard";

const mapStateToProps = (state, props) => {
	return {
		// TODO deletable and editable will be part of data.....hasActiveUserPermissionToDelete will be useless then
		editable: Select.users.isAdmin(state) || Select.users.isAdminGroupMember(state),
		deletable: Select.users.isAdmin(state)  || Select.users.isAdminGroupMember(state) || Select.users.hasActiveUserPermissionToDelete(state,props.viewKey, "dataview")
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		deleteView: (key) => {
			dispatch(Action.views.apiDeleteView(key))
		},
		redirect: (params) => {
			dispatch(Action.components.redirectToView(params))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewCard);
