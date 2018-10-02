import { connect } from 'react-redux';
import Action from '../../../../../state/Action';
import Select from '../../../../../state/Select';
import CaseList from "../../../../presentation/controls/scenarios/CaseList/CaseList";

const mapStateToProps = (state, ownProps) => {
	return {
		cases: Select.scenarios.cases.getActivePlaceCases(state),
		casesEdited: Select.scenarios.cases.getEditedAll(state),
		scenariosEdited: Select.scenarios.scenarios.getEditedAll(state),

		// permissions
		enableCreate: Select.users.isAdmin(state) || Select.users.hasActiveUserPermissionToCreate(state, 'scenario_case')
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		changeDefaultMapName: (name) => {
			dispatch(Action.maps.changeDefaultMapName(name));
		},
		setActiveCase: (caseKey) => {
			dispatch(Action.scenarios.setActiveCase(caseKey));
			if (caseKey){
				dispatch(Action.scenarios.load(caseKey));
			}
		},
		setDefaultSituationActive: () => {
			dispatch(Action.scenarios.setDefaultSituationActive(true));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(CaseList);