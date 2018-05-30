import {createSelector} from 'reselect';
import _ from 'lodash';

const getActiveScreenKey = (state) => state.components.windows.scenarios.activeScreenKey;

export default {
	getActiveScreenKey: getActiveScreenKey
};