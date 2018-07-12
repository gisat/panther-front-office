import { connect } from 'react-redux';

import Action from '../../../state/Action';
import Select from '../../../state/Select';
import ViewCard from "../../presentation/controls/ViewCard/ViewCard";

const mapStateToProps = (state, props) => {
	return {
		// TODO use permissions
		editable: Select.users.isAdmin(state),
		deletable: Select.users.isAdmin(state)
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
