import { connect } from 'react-redux';
import Select from '../../../../../state/Select';
import Action from "../../../../../state/Action";

import presentation from './presentation';

import LpisCaseStatuses from "../../../../../constants/LpisCaseStatuses";

const mapStateToProps = (state, ownProps) => {
	let cases = [];
	let searchString = Select.specific.lpisChangeReviewCases.getSearchString(state);
	let statuses = Select.specific.lpisChangeReviewCases.getSelectedStatuses(state);
	let searching = (searchString && searchString.length > 0);

	if (statuses && !searching){
		cases = Select.specific.lpisChangeReviewCases.getCasesFilteredByStatusesSortedByDate(state, ownProps);
	} else if (!statuses && searching){
		cases = Select.specific.lpisChangeReviewCases.getSearchingResultFromCasesWithoutInvalid(state, ownProps);
	} else if (statuses && searching){
		cases = Select.specific.lpisChangeReviewCases.getSearchingResultFromCasesWithSelectedStatuses(state, ownProps);
	} else {
		cases = Select.specific.lpisChangeReviewCases.getAllCasesSortedByStatusAndDate(state, ownProps);
	}

	return {
		cases: cases,
		searchString: searchString,
		selectedStatuses: statuses,
		activeEditedCaseKey: Select.specific.lpisChangeReviewCases.getActiveEditedCaseKey(state),
		activeEditedCase: Select.specific.lpisChangeReviewCases.getActiveEditedCase(state),
		userGroup: Select.users.getActiveUserDromasLpisChangeReviewGroup(state),
		users: Select.users.getUsers(state)
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		changeSearchString: (searchString) => {
			dispatch(Action.specific.lpisChangeReviewCases.changeSearchString(searchString))
		},
		createNewActiveEditedCase: () => {
			dispatch(Action.specific.lpisChangeReviewCases.createNewActiveEditedCase())
		},
		onStatusChange: (status) => {
			dispatch(Action.specific.lpisChangeReviewCases.changeSelectedStatuses(status));
		},
		showCase: (caseKey) => {
			dispatch(Action.specific.lpisChangeReviewCases.setActive(caseKey));
			// dispatch(Action.components.setIntro(false));
			dispatch(Action.specific.lpisChangeReviewCases.redirectToActiveCaseView());
		},
		invalidateCase: (caseKey) => {
			dispatch(Action.specific.lpisChangeReviewCases.userActionInvalidate(caseKey))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
