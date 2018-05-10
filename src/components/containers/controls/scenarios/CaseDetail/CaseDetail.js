import { connect } from 'react-redux';
import Action from '../../../../../state/Action';
import Select from '../../../../../state/Select';
import CaseDetail from "../../../../presentation/controls/scenarios/CaseDetail/CaseDetail";

const mapStateToProps = (state, ownProps) => {
	return {
		case: Select.scenarios.getActiveCase(state),
		place: Select.places.getActive(state),
		scenarios: Select.scenarios.getActiveCaseScenarios(state),
		activeScenarioKeys: Select.scenarios.getActiveKeys(state),
		isDefaultSituationActive: Select.scenarios.isDefaultSituationActive(state)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
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
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(CaseDetail);