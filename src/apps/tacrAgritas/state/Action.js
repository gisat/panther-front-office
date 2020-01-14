import CommonAction from '../../../state/Action';
import CommonSelect from "../../../state/Select";
import Select from "./Select";
import _ from 'lodash';
import config from "../../../config";
import utils from "../utils";

import tacrAgritasData from "./Data/actions";

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

const changeAppView = () => (dispatch, getState) => {
	const state = getState();

	const resources = Select.app.getConfiguration(state, "resources");
	const activePlaceKey = Select.places.getActiveKey(state);
	const activePeriodKey = Select.periods.getActiveKey(state);
	const activeScopeKey = Select.scopes.getActiveKey(state);

	if (resources && activePlaceKey && activePeriodKey && activeScopeKey) {
		const dataSource = resources[activePlaceKey][activeScopeKey][activePeriodKey];
		const key = `${activePlaceKey}_${activeScopeKey}_${activePeriodKey}`;

		const existingData = Select.specific.tacrAgritasData.getByKey(state, key);

		if (dataSource && !existingData) {
			const url = config.tacrAgritasDataRepositoryUrl + dataSource;
			utils.request(url, "GET", null, null).then((data) => {
				if (data) {
					dispatch(tacrAgritasData.add([{
						key,
						data
					}]));
				} else {
					throw new Error("No data returned or no features found");
				}
			});
		}
	}
};

export default {
	...CommonAction,
	specific: {
		tacrAgritas: {
			changeAppView,
			setActiveScope
		},
		tacrAgritasData
	}
}