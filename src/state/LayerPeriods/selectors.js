import {createSelector} from 'reselect';

const getByAoiKey = state => state.layerPeriods.byAoiKey;
const getByPlaceKey = state => state.layerPeriods.byPlaceKey;
const getByKey = state => state.layerPeriods.byKey;

const getActiveAoiKey = state => state.aoi.activeKey;
const getActivePlaceKey = state => state.places.activeKey;
const getActiveLpisCaseKey = state => state.specific.lpisChangeReviewCases.activeCaseKey;

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

const getForActiveLpisCase = createSelector(
	[getByKey, getActiveLpisCaseKey],
	(byKey, activeLpisCaseKey) => {
		return byKey['lpisCase' + activeLpisCaseKey];
	}
);

export default {
	getActiveAoiData: getActiveAoiData,
	getActivePlaceData: getActivePlaceData,
	getForActiveLpisCase
};