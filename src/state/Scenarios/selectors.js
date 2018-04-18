import {createSelector} from 'reselect';
import _ from 'lodash';

const getActiveKey = state => state.scenarios.activeKey;
const getScenarios = state => state.scenarios.data;

const getActive = createSelector(
	[getScenarios, getActiveKey],
	(scenarios, activeKey) => {
		return _.find(scenarios, {key: activeKey});
	}
);

export default {
	getActive: getActive,
	getActiveKey: getActiveKey,
};