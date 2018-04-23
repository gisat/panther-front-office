import {createSelector} from 'reselect';
import _ from 'lodash';

const isDataUploadOverlayOpen = state => state.components.dataUploadOverlay.open;

const isScenariosWindowOpen = state => state.components.windows.scenarios.open;
const getScenariosWindow = state => state.components.windows.scenarios;

const getWindows = state => state.components.windows;

export default {
	isDataUploadOverlayOpen: isDataUploadOverlayOpen,

	isScenariosWindowOpen: isScenariosWindowOpen,
	getScenariosWindow: getScenariosWindow,

	getWindows: getWindows
};