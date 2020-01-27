import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import presentation from "./presentation";

const mapStateToProps = (state, ownProps) => {
	const activeCase = Select.specific.lpisChangeCases.getActive(state);
	return {
		case: activeCase,
		// userApprovedEvaluation: Select.specific.lpisChangeReviewCases.getUserApprovedEvaluationOfActiveCase(state),
		// userCreatedCase: Select.specific.lpisChangeReviewCases.getUserCreatedActiveCase(state),
		// userGroup: Select.users.getActiveUserDromasLpisChangeReviewGroup(state),
		userGroup: 'gisatAdmins',
		activeCaseEdited: Select.specific.lpisChangeCases.getEditedDataByKey(state, activeCase.key),
		// activeCaseEdited: Select.specific.lpisChangeReviewCases.getActiveCaseEdited(state),
		// nextCaseKey: Select.specific.lpisChangeReviewCases.getNextActiveCaseKey(state)
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		editActiveCase: (modelKey, property, value) => {
			debugger
			// dispatch(Action.specific.lpisChangeCases.updateEdited(property, value))
			dispatch(Action.specific.lpisChangeCases.updateEdited(modelKey, property, value))
		},
		saveEvaluation: (caseKes) => {
			dispatch(Action.specific.szifLpisZmenovaRizeni.saveView());
			dispatch(Action.specific.lpisChangeCases.saveEdited(caseKes));
		},
		saveAndApproveEvaluation: () => {
			dispatch(Action.specific.lpisChangeReviewCases.userActionSaveAndApproveEvaluation())
		},
		approveEvaluation: () => {
			dispatch(Action.specific.lpisChangeReviewCases.userActionApproveEvaluation())
		},
		rejectEvaluation: () => {
			dispatch(Action.specific.lpisChangeReviewCases.userActionRejectEvaluation())
		},
		closeEvaluation: () => {
			dispatch(Action.specific.lpisChangeReviewCases.userActionCloseEvaluation())
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);