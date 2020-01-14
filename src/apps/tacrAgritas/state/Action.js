import CommonAction from '../../../state/Action';
import CommonSelect from "../../../state/Select";
import Select from "./Select";
import _ from 'lodash';

const setActiveScope = (key) => (dispatch, getState) => {
	const activePeriodKey = CommonSelect.periods.getActiveKey(getState());
	const periodModelsForScope = Select.specific.tacrAgritas.getPeriodsForScope(getState(), key);

	if (periodModelsForScope) {
		const periodKeys = periodModelsForScope.map(model => model.key);

		// if active period is not defined for given scope
		if (!_.includes(periodKeys, activePeriodKey)) {
			dispatch(CommonAction.periods.setActiveKey(periodKeys[periodKeys.length - 1]));
		}
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