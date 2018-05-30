import { connect } from 'react-redux';
import Action from '../../../../../state/Action';
import Select from '../../../../../state/Select';
import CaseDetail from "../../../../presentation/controls/scenarios/CaseDetail/CaseDetail";

const mapStateToProps = (state, ownProps) => {
	return {
		case: Select.scenarios.getActiveCase(state),
		caseEdited: Select.scenarios.getActiveCaseEdited(state),
		place: Select.places.getActive(state),
		activeCaseScenarioKeys: Select.scenarios.getActiveCaseScenarioKeys(state),
		activeCaseEditedScenarioKeys: Select.scenarios.getActiveCaseEditedScenarioKeys(state),
		activeScenarioKeys: Select.scenarios.getActiveKeys(state),
		isDefaultSituationActive: Select.scenarios.isDefaultSituationActive(state),
		editedScenariosKeys: Select.scenarios.getActiveCaseScenariosEditedKeys(state),
		editingActive: Select.components.windows.scenarios.isEditingActive(state)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		activateEditing: () => {
			dispatch(Action.components.windows.scenarios.activateCaseEditing());
		},
		addScenario: (scenarioKey) => {
			dispatch(Action.scenarios.addEditedScenario(scenarioKey));
		},
		handleScenarioClick: (key, checked, defaultSituation) => {
			if (defaultSituation){
				dispatch(Action.scenarios.setDefaultSituationActive(checked));
			} else {
				if (checked){
					dispatch(Action.scenarios.addActiveScenario(key));
				} else {
					dispatch(Action.scenarios.removeActiveScenario(key));
				}
			}
		},
		updateEditedCase: (key, value) => {
			dispatch(Action.scenarios.updateEditedActiveCase(key, value))
		},
		deactivateEditing: () => {
			dispatch(Action.components.windows.scenarios.deactivateCaseEditing());
		},
		discard: () => {
			ownProps.changeActiveScreen('caseList');
			dispatch(Action.scenarios.setActiveCase());
			dispatch(Action.scenarios.removeEditedActiveCase());
		},
		revert: () => {
			dispatch(Action.scenarios.removeEditedActiveCase());
		},
		save: () => {
			dispatch(Action.scenarios.saveActiveCase());
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(CaseDetail);