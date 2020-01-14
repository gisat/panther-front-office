import {createSelector} from 'reselect';

import common from "../../../../state/_common/selectors";
import PlacesSelectors from "../../../../state/Places/selectors";
import ScopesSelectors from "../../../../state/Scopes/selectors";
import PeriodsSelectors from "../../../../state/Periods/selectors";

const getSubstate = state => state.specific.tacrAgritasData;
const getAllAsObject = common.getAllAsObject(getSubstate);
const getByKey = common.getByKey(getSubstate);

const getActive = createSelector(
	[
		getAllAsObject,
		PlacesSelectors.getActiveKey,
		ScopesSelectors.getActiveKey,
		PeriodsSelectors.getActiveKey
	],
	(dataAsObject, activePlaceKey, activeScopeKey, activePeriodKey) => {
		const key = `${activePlaceKey}_${activeScopeKey}_${activePeriodKey}`;
		return dataAsObject[key] && dataAsObject[key].data;
	}
);

export default {
	getSubstate,
	getActive,
	getByKey
};