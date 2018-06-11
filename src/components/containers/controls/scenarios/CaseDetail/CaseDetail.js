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
		editedScenarios: Select.scenarios.getActiveCaseScenariosEdited(state),
		editingActive: Select.components.windows.scenarios.isEditingActive(state),

		// permissions
		enableCreate: Select.users.isAdmin(state) || Select.users.hasActiveUserPermissionToCreate(state, 'scenario_case'),
		// todo permissions for update/delete
		enableDelete: Select.users.isAdmin(state) || Select.users.hasActiveUserPermissionToCreate(state, 'scenario_case'),
		enableEdit: Select.users.isAdmin(state) || Select.users.hasActiveUserPermissionToCreate(state, 'scenario_case')
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