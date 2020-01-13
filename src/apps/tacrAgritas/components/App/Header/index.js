import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../state/Action';
import Select from '../../../state/Select';

import presentation from "./presentation";


const mapStateToProps = (state, ownProps) => {
	return {
		cases: Select.cases.getAll(state),
		activeCase: Select.cases.getActive(state),
		place: Select.places.getActive(state),
		periods: Select.specific.tacrAgritas.getPeriodsForActiveScope(state),
		activePeriod: Select.periods.getActive(state),
		scopes: Select.scopes.getAll(state),
		activeScope: Select.scopes.getActive(state)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onCaseChange: (key) => {
			dispatch(Action.cases.setActiveKey(key));
		},
		onPeriodChange: (key) => {
			dispatch(Action.periods.setActiveKey(key));
		},
		onScopeChange: (key) => {
			dispatch(Action.specific.tacrAgritas.setActiveScope(key));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);