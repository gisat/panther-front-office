import {createSelector} from 'reselect';
import _ from 'lodash';

const getByAoiKey = state => state.layerPeriods.byAoiKey;
const getByPlaceKey = state => state.layerPeriods.byPlaceKey;
const getActiveAoiKey = state => state.aoi.activeKey;
const getActivePlaceKey = state => state.places.activeKey;

const getActiveAoiData = createSelector(
	[getByAoiKey, getActiveAoiKey],
	(byAoiKey, activeAoiKey) => {
		return byAoiKey[activeAoiKey];
	}
);

const getActivePlaceData = createSelector(
	[getByPlaceKey, getActivePlaceKey],
	(byPlaceKey, activePlaceKey) => {
		return byPlaceKey[activePlaceKey];
	}
);

export default {
	getActiveAoiData: getActiveAoiData,
	getActivePlaceData: getActivePlaceData
};