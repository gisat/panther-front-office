import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import ShareForm from "../../../presentation/controls/share/ShareForm";
import {utils} from '@gisatcz/ptr-utils'

const mapStateToProps = (state, ownProps) => {
	return {
        users: Select.users.getUsers(state),
		groups: Select.users.getGroups(state),
		dataviewId: Select.dataviews.getActiveKey(state),
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const componentId = 'ShareWidget_' + utils.randomString(6);
	const order = [['key', 'ascending']];
	const filter = null;
    return {
		onSubmit: (toSave) => {
			dispatch(Action.components.setShareSaveState(toSave));
		},
		handleClearForm: () => {
			dispatch(Action.components.setShareSaveState(null));
		},
		onMount: () => {
			//load users and groups
			dispatch(Action.users.useIndexedUsers(null, filter, order, 1, 1000, componentId));
			dispatch(Action.users.useIndexedGroups(null, filter, order, 1, 1000, componentId));
		},
		onUnmount: () => {
			//set users and groups indexes as unuses
			dispatch(Action.users.useIndexedUsersClear(componentId));
			dispatch(Action.users.useIndexedGroupsClear(componentId));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareForm);