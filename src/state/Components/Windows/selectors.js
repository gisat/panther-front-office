import {createSelector} from 'reselect';
import _ from 'lodash';

const getWindows = state => state.components.windows;
const getWindow = (state, props) => state.components.windows[props.key];

const isWindowOpen = createSelector(
	getWindow,
	(window) => {
		return window ? window.open : false;
	}
);

export default {
	isWindowOpen: isWindowOpen,
	getWindows: getWindows
};