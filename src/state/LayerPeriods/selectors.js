import {createSelector} from 'reselect';
import _ from 'lodash';

import Select from '../Select';

const getByAoiKey = state => state.layerPeriods.byAoiKey;

const getActiveAoiData = createSelector(
	[getByAoiKey, Select.aoi.getActiveAoiKey],
	(byAoiKey, activeAoiKey) => {
		return byAoiKey[activeAoiKey];
	}
);

export default {
	getActiveAoiData: getActiveAoiData
};