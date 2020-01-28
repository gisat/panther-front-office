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
		nextCaseKey: Select.specific.lpisChangeCases.getNextCaseKey(state, activeCase.key)
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		editActiveCase: (modelKey, property, value) => {
			dispatch(Action.specific.lpisChangeCases.updateEdited(modelKey, property, value))
		},
		saveEvaluation: (caseKes) => {
			//TODO - save view and case only if edited
			dispatch(Action.specific.szifLpisZmenovaRizeni.saveView());
			dispatch(Action.specific.lpisChangeCases.saveEdited(caseKes));
		},
		saveAndApproveEvaluation: () => {
			dispatch(Action.specific.szifLpisZmenovaRizeni.saveAndApproveEvaluation());
		},
		approveEvaluation: () => {
			//TODO
			dispatch(Action.specific.lpisChangeReviewCases.userActionApproveEvaluation())
		},
		rejectEvaluation: () => {
			//TODO
			dispatch(Action.specific.lpisChangeReviewCases.userActionRejectEvaluation())
		},
		closeEvaluation: () => {
			//TODO
			dispatch(Action.specific.lpisChangeReviewCases.userActionCloseEvaluation())
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);