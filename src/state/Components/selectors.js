import {createSelector} from 'reselect';
import _ from 'lodash';
import Windows from './Windows/selectors'

const getComponents = state => state.components;
const isDataUploadOverlayOpen = state => state.components.dataUploadOverlay.open;

export default {
	getComponents: getComponents,
	isDataUploadOverlayOpen: isDataUploadOverlayOpen,
	windows: Windows
};