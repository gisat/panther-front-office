import { connect } from 'react-redux';
import Action from '../../../../../state/Action';
import Select from '../../../../../state/Select';
import CaseList from "../../../../presentation/controls/scenarios/CaseList/CaseList";

const mapStateToProps = (state, ownProps) => {
	return {
		cases: Select.scenarios.getCases(state),
		casesEdited: Select.scenarios.getCasesEdited(state),
		scenariosEdited: Select.scenarios.getScenariosEdited(state)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		changeDefaultMapName: (name) => {
			dispatch(Action.maps.changeDefaultMapName(name));
		},
		setActiveCase: (caseKey) => {
			dispatch(Action.scenarios.setActiveCase(caseKey));
		},
		setDefaultSituationActive: () => {
			dispatch(Action.scenarios.setDefaultSituationActive(true));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(CaseList);