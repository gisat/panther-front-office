import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import presentation from "./presentation";
import LpisCaseStatuses from "../../constants/LpisCaseStatuses";

const mapStateToProps = (state, ownProps) => {
	const activeCase = Select.specific.lpisChangeCases.getActive(state);
	const userGroups = Select.specific.lpisZmenovaRizeni.getActiveUserGroups(state);
	const nextCaseKey = Select.specific.lpisChangeCases.getNextCaseKey(state, activeCase.key);
	const caseEvaluationApproved = Select.specific.lpisChangeCases.getCaseEvaluationApproved(state, activeCase.key);
	const caseCreated = Select.specific.lpisChangeCases.getCaseSubmit(state, activeCase.key);
	return {
		case: activeCase,
		userApprovedEvaluation: caseEvaluationApproved && caseEvaluationApproved.userId || null,
		userCreatedCase: caseCreated && caseCreated.userId || null,
		userGroups,
		activeCaseEdited: Select.specific.lpisChangeCases.getEditedDataByKey(state, activeCase.key),
		nextCaseKey: nextCaseKey,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		editActiveCase: (modelKey, property, value) => {
			dispatch(Action.specific.lpisChangeCases.updateEdited(modelKey, property, value))
		},
		saveEvaluation: (caseKey, nextCaseKey) => {
			dispatch(Action.specific.szifLpisZmenovaRizeni.editActiveCaseStatus(LpisCaseStatuses.EVALUATION_CREATED.database));
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
		goToNextCase: () => {
				dispatch(Action.specific.szifLpisZmenovaRizeni.redirectToNextViewFromActiveView());
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);