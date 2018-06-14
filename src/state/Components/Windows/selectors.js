import {createSelector} from 'reselect';
import _ from 'lodash';
import Scenarios from './Scenarios/selectors'

const getWindows = state => state.components.windows;
const getWindow = (state, props) => state.components.windows[props.key];

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

	getWindow: getWindow,
	getWindows: getWindows,

	scenarios: Scenarios
};