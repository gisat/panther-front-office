import {createSelector} from 'reselect';
import _ from 'lodash';
import Windows from './Windows/selectors'

const isDataUploadOverlayOpen = state => state.components.dataUploadOverlay.open;

export default {
	isDataUploadOverlayOpen: isDataUploadOverlayOpen,
	windows: Windows
};