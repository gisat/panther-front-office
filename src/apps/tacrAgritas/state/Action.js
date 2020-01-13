import CommonAction from '../../../state/Action';
import CommonSelect from "../../../state/Select";
import Select from "./Select";
import _ from 'lodash';

const setActiveScope = (key) => (dispatch, getState) => {
	const scopeHasPeriod = CommonSelect.app.getConfiguration(getState(), 'scopeHasPeriods');
	const activePeriodKey = CommonSelect.periods.getActiveKey(getState());
	const periodsForScope = scopeHasPeriod[key];

	// if active period is not defined for given scope
	if (!_.includes(periodsForScope, activePeriodKey)) {
		dispatch(CommonAction.periods.setActiveKey(periodsForScope[periodsForScope.length - 1]));
	}

	dispatch(CommonAction.scopes.setActiveKey(key));
};

export default {
	...CommonAction,
	specific: {
		tacrAgritas: {
			setActiveScope
		}
	}
}