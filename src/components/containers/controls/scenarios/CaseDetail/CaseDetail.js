import { connect } from 'react-redux';
import Action from '../../../../../state/Action';
import Select from '../../../../../state/Select';
import CaseDetail from "../../../../presentation/controls/scenarios/CaseDetail/CaseDetail";

const mapStateToProps = (state, ownProps) => {
	return {
		activeBackgroundLayerKey: Select.maps.getActiveBackgroundLayerKey(state),
		case: Select.scenarios.cases.getActive(state),
		caseEdited: Select.scenarios.cases.getActiveCaseEdited(state),
		place: Select.places.getActive(state),
		activeCaseScenarioKeys: Select.scenarios.cases.getActiveCaseScenarioKeys(state),
		activeCaseEditedScenarioKeys: Select.scenarios.cases.getActiveCaseEditedScenarioKeys(state),
		activeScenarioKeys: Select.scenarios.scenarios.getActiveKeys(state),
		isDefaultSituationActive: Select.scenarios.scenarios.isDefaultSituationActive(state),
		editedScenariosKeys: Select.scenarios.cases.getActiveCaseScenariosEditedKeys(state),
		editedScenarios: Select.scenarios.cases.getActiveCaseScenariosEdited(state),
		editingActive: Select.components.windows.scenarios.isEditingActive(state),

		// permissions
		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'scenario_cases'),

		// TODO get permissions from model
		enableDelete: Select.users.hasActiveUserPermissionToCreate(state, 'scenario_cases'),
		enableEdit: Select.users.hasActiveUserPermissionToCreate(state, 'scenario_cases')
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
		deleteCase: () => {
			dispatch(Action.scenarios.deleteActiveCase());
		},
		discard: () => {
			ownProps.changeActiveScreen('caseList');
			dispatch(Action.scenarios.removeEditedActiveCase());
			dispatch(Action.scenarios.setActiveCase());
		},
		revert: () => {
			dispatch(Action.scenarios.removeEditedActiveCase());
			dispatch(Action.scenarios.removeActiveCaseEditedScenarios())
		},
		save: () => {
			dispatch(Action.scenarios.saveActiveCase());
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(CaseDetail);