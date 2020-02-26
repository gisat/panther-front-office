import {createSelector} from 'reselect';
import _ from "lodash";

import {commonSelectors as common, placesSelectors, scopesSelectors, periodsSelectors, casesSelectors} from '@gisatcz/ptr-state';

const getSubstate = state => state.specific.tacrAgritasData;
const getAllAsObject = common.getAllAsObject(getSubstate);
const getByKey = common.getByKey(getSubstate);

const getFeaturesForActiveMetadata = createSelector(
	[
		getAllAsObject,
		placesSelectors.getActiveKey,
		scopesSelectors.getActiveKey,
		periodsSelectors.getActiveKey,
		casesSelectors.getActiveKey
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