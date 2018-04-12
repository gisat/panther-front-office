import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	dataUploadOverlay: {
		open: false,
	}
};

function updateDataUploadOverlay(state, action) {
	return {...state, dataUploadOverlay: state.dataUploadOverlay ? {...state.dataUploadOverlay, ...action.dataUploadOverlay} : action.dataUploadOverlay};
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.COMPONENTS_DATA_UPLOAD_OVERLAY_UPDATE:
			return updateDataUploadOverlay(state, action);
		default:
			return state;
	}
}
