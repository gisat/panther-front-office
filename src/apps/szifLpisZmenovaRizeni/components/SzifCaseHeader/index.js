import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import presentation from "./presentation";

const mapStateToProps = (state, ownProps) => {
	const activeCase = Select.specific.lpisChangeCases.getActive(state);
	const userGroups = Select.specific.lpisZmenovaRizeni.getActiveUserGroups(state);
	return {
		case: activeCase,
		//FIXME
		// userApprovedEvaluation: Select.specific.lpisChangeReviewCases.getUserApprovedEvaluationOfActiveCase(state),
		//FIXME
		// userCreatedCase: Select.specific.lpisChangeReviewCases.getUserCreatedActiveCase(state),
		//FIXME - 
		// userGroup: Select.users.getActiveUserDromasLpisChangeReviewGroup(state),
		userGroups,
		activeCaseEdited: Select.specific.lpisChangeCases.getEditedDataByKey(state, activeCase.key),
		nextCaseKey: Select.specific.lpisChangeCases.getNextCaseKey(state, activeCase.key)
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		editActiveCase: (modelKey, property, value) => {
			dispatch(Action.specific.lpisChangeCases.updateEdited(modelKey, property, value))
		},
		saveEvaluation: (caseKey, nextCaseKey) => {
			//TODO - save view and case only if edited
			const prom1 = dispatch(Action.specific.szifLpisZmenovaRizeni.saveView());
			const prom2 = dispatch(Action.specific.lpisChangeCases.saveEdited(caseKey));
			Promise.all([prom1, prom2]).then(() => {
				if(nextCaseKey) {
					dispatch(Action.specific.szifLpisZmenovaRizeni.redirectToNextViewFromActiveView());
				}
			  });
		},
		saveAndApproveEvaluation: (nextCaseKey) => {
			dispatch(Action.specific.szifLpisZmenovaRizeni.saveAndApproveEvaluation()).then(() => {
				if(nextCaseKey) {
					dispatch(Action.specific.szifLpisZmenovaRizeni.redirectToNextViewFromActiveView());
				}
			})
		},
		approveEvaluation: (nextCaseKey) => {
			dispatch(Action.specific.szifLpisZmenovaRizeni.approveEvaluation()).then(() => {
				if(nextCaseKey) {
					dispatch(Action.specific.szifLpisZmenovaRizeni.redirectToNextViewFromActiveView());
				}
			})
		},
		rejectEvaluation: (nextCaseKey) => {
			dispatch(Action.specific.szifLpisZmenovaRizeni.rejectEvaluation()).then(() => {
				if(nextCaseKey) {
					dispatch(Action.specific.szifLpisZmenovaRizeni.redirectToNextViewFromActiveView());
				}
			})
		},
		closeEvaluation: (nextCaseKey) => {
			dispatch(Action.specific.szifLpisZmenovaRizeni.closeEvaluation()).then(() => {
				if(nextCaseKey) {
					dispatch(Action.specific.szifLpisZmenovaRizeni.redirectToNextViewFromActiveView());
				}
			})
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);