import {createSelector} from 'reselect';
import _ from 'lodash';

const getByAoiKey = state => state.layerPeriods.byAoiKey;
const getActiveAoiKey = state => state.aoi.activeKey;

const getActiveAoiData = createSelector(
	[getByAoiKey, getActiveAoiKey],
	(byAoiKey, activeAoiKey) => {
		return byAoiKey[activeAoiKey];
	}
);

export default {
	getActiveAoiData: getActiveAoiData
};