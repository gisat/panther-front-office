import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import presentation from "./presentation";

const mapStateToProps = (state, ownProps) => {
	// const activeCase = Select.specific.lpisChangeCases.getActive(state);
	// const userGroups = Select.specific.lpisZmenovaRizeni.getActiveUserGroups(state);
	// const nextCaseKey = Select.specific.lpisChangeCases.getNextCaseKey(state, activeCase.key);
	// const caseEvaluationApproved = Select.specific.lpisChangeCases.getCaseEvaluationApproved(state, activeCase.key);
	// const caseCreated = Select.specific.lpisChangeCases.getCaseSubmit(state, activeCase.key);
	return {
		// case: activeCase,
		// userApprovedEvaluation: caseEvaluationApproved && caseEvaluationApproved.userId || null,
		// userCreatedCase: caseCreated && caseCreated.userId || null,
		// userGroups,
		// activeCaseEdited: Select.specific.lpisChangeCases.getEditedDataByKey(state, activeCase.key),
		// nextCaseKey: nextCaseKey,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		// switchScreen: () => {
		// 	dispatch(Action.components.set('szifScreenAnimator', 'activeScreenKey', 'szifCaseList'));
		// },
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);