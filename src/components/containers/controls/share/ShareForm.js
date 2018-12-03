import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import ShareForm from "../../../presentation/controls/share/ShareForm";

const mapStateToProps = (state, ownProps) => {
	return {
        users: Select.users.getUsers(state),
        groups: Select.userGroups.getGroups(state),
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
		onSubmit: (toSave) => {
			dispatch(Action.components.setShareSaveState(toSave));
		},
		handleClearForm: () => {
			dispatch(Action.components.setShareSaveState(null));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareForm);