import {createSelector} from 'reselect';
import _ from 'lodash';

const getActiveScreenKey = (state) => state.components.windows.scenarios.activeScreenKey;
const isEditingActive = (state) => state.components.windows.scenarios.editingActive;

export default {
	getActiveScreenKey: getActiveScreenKey,
	isEditingActive: isEditingActive
};