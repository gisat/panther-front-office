import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import ScenarioCard from "../../../presentation/controls/scenarios/ScenarioCard/ScenarioCard";

const mapStateToProps = (state, ownProps) => {
	return {
		scenarioData: Select.scenarios.getScenario(state, ownProps.scenarioKey),
		scenarioEditedData: Select.scenarios.getScenarioEdited(state, ownProps.scenarioKey)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		updateEditedScenario: (scenarioKey, key, value) => {
			dispatch(Action.scenarios.updateEditedScenario(scenarioKey, key, value))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ScenarioCard);