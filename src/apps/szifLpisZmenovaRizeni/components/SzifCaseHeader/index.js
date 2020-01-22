import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import presentation from "./presentation";

const mapStateToProps = (state, ownProps) => {
	return {
		case: Select.specific.lpisChangeCases.getActive(state),
		// userApprovedEvaluation: Select.specific.lpisChangeReviewCases.getUserApprovedEvaluationOfActiveCase(state),
		// userCreatedCase: Select.specific.lpisChangeReviewCases.getUserCreatedActiveCase(state),
		// userGroup: Select.users.getActiveUserDromasLpisChangeReviewGroup(state),
		userGroup: 'gisatAdmins',
		// activeCaseEdited: Select.specific.lpisChangeReviewCases.getActiveCaseEdited(state),
		// nextCaseKey: Select.specific.lpisChangeReviewCases.getNextActiveCaseKey(state)
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		editActiveCase: (property, value) => {
			dispatch(Action.specific.lpisChangeReviewCases.editActiveCase(property, value))
		},
		saveEvaluation: () => {
			dispatch(Action.specific.szifLpisZmenovaRizeni.saveView());
			// dispatch(Action.specific.szifLpisZmenovaRizeni.saveEveluation());
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