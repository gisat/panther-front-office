import {createSelector} from 'reselect';
import _ from 'lodash';

const getWindows = state => state.components.windows;
const getWindow = (state, props) => state.components.windows[props.key];

const getScenariosWindowActiveScreenKey = (state) => state.components.windows.scenarios.activeScreenKey;

const isWindowOpen = createSelector(
	getWindow,
	(window) => {
		return window ? window.open : false;
	}
);

const isWindowDocked = createSelector(
	getWindow,
	(window) => {
		return window ? window.docked : false;
	}
);

export default {
	isWindowDocked: isWindowDocked,
	isWindowOpen: isWindowOpen,

	getWindows: getWindows,

	getScenariosWindowActiveScreenKey: getScenariosWindowActiveScreenKey
};