import {createSelector} from 'reselect';
import _ from 'lodash';

const getActiveAoiKey = state => state.aoi.activeKey;
const getAois = state => state.aoi.data;

const getActiveAoiData = createSelector(
	[getAois, getActiveAoiKey],
	(aois, activeKey) => {
		return _.find(aois, function(aoi){
			return aoi.id === activeKey;
		});
	}
);

export default {
	getAois: getAois,
	getActiveAoiKey: getActiveAoiKey,
	getActiveAoiData: getActiveAoiData
};