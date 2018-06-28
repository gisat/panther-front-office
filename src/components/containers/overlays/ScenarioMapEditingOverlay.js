import { connect } from 'react-redux';
import React from "react";
import Action from "../../../state/Action";
import Select from "../../../state/Select";

import ScenarioMapEditingOverlay from '../../presentation/overlays/ScenarioMapEditingOverlay/ScenarioMapEditingOverlay';

const mapStateToProps = (state, ownProps) => {
	return {
		mapData: Select.components.overlays.getScenarioMapEditingMapData(state)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onClose: () => {
			dispatch(Action.scenarios.removeActiveCaseEditedScenarios());
			dispatch(Action.scenarios.removeEditedActiveCase());
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ScenarioMapEditingOverlay);