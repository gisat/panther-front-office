import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import _ from 'lodash';

import Overlays from './Overlays/actions';
import Windows from './Windows/actions';

// ============ creators ===========
function update(component, data) {
	return dispatch => {
		dispatch(actionUpdate(component, data));
	};
}


// ============ actions ===========
function actionUpdate(component, data) {
	return {
		type: ActionTypes.COMPONENTS_UPDATE,
		component: component,
		update: data
	}
}



// ============ export ===========

export default {
	update: update,
	windows: Windows,
	overlays: Overlays
}
