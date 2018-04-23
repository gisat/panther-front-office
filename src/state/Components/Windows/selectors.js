import {createSelector} from 'reselect';
import _ from 'lodash';

const isScenariosWindowOpen = state => state.components.windows.scenarios.open;
const getScenariosWindow = state => state.components.windows.scenarios;
const getWindows = state => state.components.windows;

export default {
	isScenariosWindowOpen: isScenariosWindowOpen,
	getScenariosWindow: getScenariosWindow,
	getWindows: getWindows
};