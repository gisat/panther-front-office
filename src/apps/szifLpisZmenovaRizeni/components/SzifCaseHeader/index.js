import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import presentation from "./presentation";
import {getStatusesForUserGroups} from '../../constants/LpisCaseStatuses';

const filterComponentId = 'SzifCaseTableFilterStatus';

const mapStateToProps = (state, ownProps) => {
	const activeCase = Select.specific.lpisChangeCases.getActive(state);
	const userGroups = Select.specific.lpisZmenovaRizeni.getActiveUserGroups(state);
	
	const statusesOptions = getStatusesForUserGroups(userGroups);
	const {filter, order} = Select.components.getDataByComponentKey(state, filterComponentId) || {filter:{status:{in:statusesOptions[0].keys}}, order: [['submitDate', 'descending']]};
	const cases = Select.specific.lpisChangeCases.getIndexed(state, null, filter, order, 1, 1000);
	
	const nextCaseKey = Select.specific.lpisChangeCases.getNextCaseKey(state, activeCase.key, cases);
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
			dispatch(Action.specific.szifLpisZmenovaRizeni.saveEvaluation()).then(() => {
				if(nextCaseKey) {
					dispatch(Action.specific.szifLpisZmenovaRizeni.redirectToNextViewFromActiveView(nextCaseKey));
				}
			})
		},
		saveAndApproveEvaluation: (nextCaseKey) => {
			dispatch(Action.specific.szifLpisZmenovaRizeni.saveAndApproveEvaluation()).then(() => {
				if(nextCaseKey) {
					dispatch(Action.specific.szifLpisZmenovaRizeni.redirectToNextViewFromActiveView(nextCaseKey));
				}
			})
		},
		approveEvaluation: (nextCaseKey) => {
			dispatch(Action.specific.szifLpisZmenovaRizeni.approveEvaluation()).then(() => {
				if(nextCaseKey) {
					dispatch(Action.specific.szifLpisZmenovaRizeni.redirectToNextViewFromActiveView(nextCaseKey));
				}
			})
		},
		rejectEvaluation: (nextCaseKey) => {
			dispatch(Action.specific.szifLpisZmenovaRizeni.rejectEvaluation()).then(() => {
				if(nextCaseKey) {
					dispatch(Action.specific.szifLpisZmenovaRizeni.redirectToNextViewFromActiveView(nextCaseKey));
				}
			})
		},
		closeEvaluation: (nextCaseKey) => {
			dispatch(Action.specific.szifLpisZmenovaRizeni.closeEvaluation()).then(() => {
				if(nextCaseKey) {
					dispatch(Action.specific.szifLpisZmenovaRizeni.redirectToNextViewFromActiveView(nextCaseKey));
				}
			})
		},
		goToNextCase: (nextCaseKey) => {
				dispatch(Action.specific.szifLpisZmenovaRizeni.redirectToNextViewFromActiveView(nextCaseKey));
		},
		resetView: (viewKey) => {
				dispatch(Action.specific.szifLpisZmenovaRizeni.applyView(viewKey));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);