import {createSelector} from 'reselect';
import _ from 'lodash';

const isDataUploadOverlayOpen = state => state.components.dataUploadOverlay.open;
const isScenariosWindowOpen = state => state.components.windows.scenarios.open;
const getWindows = state => state.components.windows;

export default {
	isDataUploadOverlayOpen: isDataUploadOverlayOpen,
	isScenariosWindowOpen: isScenariosWindowOpen,
	getWindows: getWindows
};