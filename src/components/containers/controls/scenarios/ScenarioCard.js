import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import ScenarioCard from "../../../presentation/controls/scenarios/ScenarioCard/ScenarioCard";

const mapStateToProps = (state, ownProps) => {
	return {
		scenarioData: Select.scenarios.getScenario(state, ownProps.scenarioKey),
		scenarioEditedData: Select.scenarios.getScenarioEdited(state, ownProps.scenarioKey),

		scenarioSpatialDataSource: Select.scenarios.getPucsScenariosVectorSource(state, ownProps.scenarioKey, ownProps.defaultSituation),

		enableDelete: Select.users.isAdmin(state) || Select.users.hasActiveUserPermissionToCreate(state, 'scenario_case'),
		enableEdit: Select.users.isAdmin(state) || Select.users.hasActiveUserPermissionToCreate(state, 'scenario_case'),
		enableModify: (Select.users.isAdmin(state) || Select.users.hasActiveUserPermissionToCreate(state, 'scenario_case')) &&
			!ownProps.editing
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		deleteScenario: (scenarioKey) => {
			dispatch(Action.scenarios.removeScenarioFromActiveCaseEdited(scenarioKey));
			dispatch(Action.scenarios.removeScenarioFromActiveCase(scenarioKey));
		},
		downloadDataSource: (sourceName) => {
			dispatch(Action.spatialDataSources.download(sourceName))
		},
		updateEditedScenario: (scenarioKey, key, value) => {
			dispatch(Action.scenarios.updateEditedScenario(scenarioKey, key, value))
		},
		edit: () => {
			dispatch(Action.components.windows.scenarios.activateCaseEditing());
		},
		onStartMapEditing: (scenarioKey, layerSource) => {
			dispatch(Action.scenarios.addEditedScenario(scenarioKey));
			dispatch(Action.components.overlays.apiCreateLayerCopyRequest(layerSource));
			dispatch(Action.components.overlays.openOverlay('scenarioMapEditing'));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ScenarioCard);