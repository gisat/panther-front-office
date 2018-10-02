import { connect } from 'react-redux';
import React from "react";

import ScenarioMapEditingControlPanel from '../../../../presentation/controls/mapEditing/controlPanels/ScenarioMapEditingControlPanel/ScenarioMapEditingControlPanel';
import Action from "../../../../../state/Action";
import Select from "../../../../../state/Select";

const mapStateToProps = (state, ownProps) => {
	return {
		scenarioData: Select.scenarios.cases.getActiveCaseScenarioEdited(state),
		landCoverClasses: Select.scopes.getPucsSourceVectorLandCoverClasses(state) ? JSON.parse(Select.scopes.getPucsSourceVectorLandCoverClasses(state)) : [],
		selectedFeatures: Select.spatialDataSources.vector.noMemoGetSelectedFeaturesBySourceKey(state, ownProps)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		discard: () => {
			dispatch(Action.scenarios.removeActiveCaseEditedScenarios());
			dispatch(Action.scenarios.removeEditedActiveCase());
			dispatch(Action.components.overlays.closeOverlay(ownProps.overlayKey));
		},
		save: () => {
			dispatch(Action.scenarios.saveActiveCase());
			dispatch(Action.components.overlays.closeOverlay(ownProps.overlayKey));
		},
		updateEditedScenario: (scenarioKey, key, value) => {
			dispatch(Action.scenarios.updateEditedScenario(scenarioKey, key, value))
		},
		updateSelectedFeatures: (value) => {
			dispatch(Action.spatialDataSources.vector.updateSelectedFeatures(ownProps.dataSourceKey, value));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ScenarioMapEditingControlPanel);