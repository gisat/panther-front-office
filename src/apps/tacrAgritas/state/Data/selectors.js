import {createSelector} from 'reselect';
import _ from "lodash";

import common from "../../../../state/_common/selectors";
import PlacesSelectors from "../../../../state/Places/selectors";
import ScopesSelectors from "../../../../state/Scopes/selectors";
import PeriodsSelectors from "../../../../state/Periods/selectors";
import CasesSelectors from "../../../../state/Cases/selectors";

const getSubstate = state => state.specific.tacrAgritasData;
const getAllAsObject = common.getAllAsObject(getSubstate);
const getByKey = common.getByKey(getSubstate);

const getFeaturesForActiveMetadata = createSelector(
	[
		getAllAsObject,
		PlacesSelectors.getActiveKey,
		ScopesSelectors.getActiveKey,
		PeriodsSelectors.getActiveKey,
		CasesSelectors.getActiveKey
	],
	(dataAsObject, activePlaceKey, activeScopeKey, activePeriodKey, activeCaseKey) => {
		const key = `${activePlaceKey}_${activeScopeKey}_${activePeriodKey}`;
		const data = dataAsObject[key];

		if (data && data.data && data.data.features) {
			return _.filter(data.data.features, (feature) => feature.properties.CROP_LABEL === activeCaseKey);
		} else {
			return null;
		}
	}
);

export default {
	getSubstate,
	getFeaturesForActiveMetadata,
	getByKey
};