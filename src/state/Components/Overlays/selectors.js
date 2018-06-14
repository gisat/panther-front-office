import {createSelector} from 'reselect';
import _ from 'lodash';

const getOverlay = (state, props) => state.components.overlays[props.key];

const isOverlayOpen = createSelector(
	getOverlay,
	(overlay) => {
		return overlay ? overlay.open : false;
	}
);

export default {
	getOverlay: getOverlay,
	isOverlayOpen: isOverlayOpen
};