import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import _ from 'lodash';


// ============ creators ===========
function update(component, data) {
	return dispatch => {
		dispatch(actionUpdate(component, data));
	};
}

// ============ actions ===========
function actionUpdate(component, data) {
	return {
		type: ActionTypes.COMPONENTS.UPDATE,
		component: component,
		update: data
	}
}
function actionSet(component, path, value) {
	return {
		type: ActionTypes.COMPONENTS.SET,
		component,
		path,
		value
	}
}


// ============ export ===========

export default {
	update,
	set: actionSet
}
