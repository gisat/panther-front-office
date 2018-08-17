import { connect } from 'react-redux';
import Select from '../../../../../state/Select';
import Action from "../../../../../state/Action";

import presentation from './presentation';

import LpisCaseStatuses from "../../../../../constants/LpisCaseStatuses";

const mapStateToProps = (state, ownProps) => {
	return {
		cases: Select.lpisCases.getSearchResults(state, ownProps),
		searchString: Select.lpisCases.getSearchString(state),
		selectedStatuses: Select.lpisCases.getSelectedStatuses(state),
		activeEditedCaseKey: Select.lpisCases.getActiveEditedCaseKey(state),
		activeEditedCase: Select.lpisCases.getActiveEditedCase(state),
		userGroup: Select.users.getActiveUserDromasLpisChangeReviewGroup(state),
		users: Select.users.getUsers(state)
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		changeSearchString: (searchString) => {
			dispatch(Action.lpisCases.changeSearchString(searchString))
		},
		createNewActiveEditedCase: () => {
			dispatch(Action.lpisCases.createNewActiveEditedCase())
		},
		onStatusChange: (status) => {
			dispatch(Action.lpisCases.changeSelectedStatuses(status));
		},
		showCase: (caseKey) => {
			dispatch(Action.lpisCases.setActive(caseKey));
			// dispatch(Action.components.setIntro(false));
			dispatch(Action.lpisCases.redirectToActiveCaseView());
		},
		loadUsers: () => {
			dispatch(Action.users.apiLoad());
		},
		invalidateCase: (caseKey) => {
			dispatch(Action.lpisCases.userActionInvalidate())
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
