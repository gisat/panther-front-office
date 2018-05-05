import {createSelector} from 'reselect';
import _ from 'lodash';

const isDataUploadOverlayOpen = state => state.components.dataUploadOverlay.open;

export default {
	isDataUploadOverlayOpen: isDataUploadOverlayOpen
};