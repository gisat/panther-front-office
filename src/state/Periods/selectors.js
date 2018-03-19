import {createSelector} from 'reselect';
import _ from 'lodash';

const getActivePeriodKey = state => state.periods.activeKey;
const getPeriods = state => state.periods.data;

const getActivePeriod = createSelector(
	[getPeriods, getActivePeriodKey],
	(periods, activeKey) => {
		return _.find(periods, function(period){
			return period.key === activeKey;
		});
	}
);

export default {
	getActivePeriod: getActivePeriod,
	getActivePeriodKey: getActivePeriodKey,
	getPeriods: getPeriods
};