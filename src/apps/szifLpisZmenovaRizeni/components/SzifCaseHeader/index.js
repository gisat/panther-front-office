import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import presentation from "./presentation";

const mapStateToProps = (state, ownProps) => {
	const activeCase = Select.specific.lpisChangeCases.getActive(state);
	return {
		case: activeCase,
		//FIXME
		// userApprovedEvaluation: Select.specific.lpisChangeReviewCases.getUserApprovedEvaluationOfActiveCase(state),
		//FIXME
		// userCreatedCase: Select.specific.lpisChangeReviewCases.getUserCreatedActiveCase(state),
		//FIXME - 
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
		saveEvaluation: (caseKey, nextCaseKey) => {
			//TODO - save view and case only if edited
			const prom1 = dispatch(Action.specific.szifLpisZmenovaRizeni.saveView());
			const prom2 = dispatch(Action.specific.lpisChangeCases.saveEdited(caseKey));
			Promise.all([prom1, prom2]).then(function(values) {
				debugger
				if(nextCaseKey) {
					dispatch(Action.specific.szifLpisZmenovaRizeni.redirectToNextViewFromActiveView());
				}
			  });
		},
		saveAndApproveEvaluation: (nextCaseKey) => {
			dispatch(Action.specific.szifLpisZmenovaRizeni.saveAndApproveEvaluation());
			if(nextCaseKey) {
				dispatch(Action.specific.szifLpisZmenovaRizeni.redirectToNextViewFromActiveView());
			}
		},
		approveEvaluation: (nextCaseKey) => {
			dispatch(Action.specific.szifLpisZmenovaRizeni.approveEvaluation())
			if(nextCaseKey) {
				dispatch(Action.specific.szifLpisZmenovaRizeni.redirectToNextViewFromActiveView());
			}
		},
		rejectEvaluation: (nextCaseKey) => {
			dispatch(Action.specific.szifLpisZmenovaRizeni.rejectEvaluation())
			if(nextCaseKey) {
				dispatch(Action.specific.szifLpisZmenovaRizeni.redirectToNextViewFromActiveView());
			}
		},
		closeEvaluation: (nextCaseKey) => {
			dispatch(Action.specific.szifLpisZmenovaRizeni.closeEvaluation())
			if(nextCaseKey) {
				dispatch(Action.specific.szifLpisZmenovaRizeni.redirectToNextViewFromActiveView());
			}
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);