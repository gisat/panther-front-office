import { connect } from 'react-redux';
import Action from '../../../../../state/Action';
import Select from '../../../../../state/Select';
import CaseDetail from "../../../../presentation/controls/scenarios/CaseDetail/CaseDetail";

const mapStateToProps = (state, ownProps) => {
	return {
		case: Select.scenarios.getActiveCase(state),
		scenarios: Select.scenarios.getActiveCaseScenarios(state),
		activeScenarioKeys: Select.scenarios.getActiveKeys(state)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {

	}
};

export default connect(mapStateToProps, mapDispatchToProps)(CaseDetail);