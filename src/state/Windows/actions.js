import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

// ============ creators ===========

function add(setKey, windowKey, title, component, props) {
	return dispatch => {
		dispatch(actionAdd(
			setKey,
			windowKey, {
				state: 'open',
				title,
				component,
				props
			}
		));
	}
}


// ============ actions ===========
const actionAdd = (setKey, windowKey, data) => {
	return {
		type: ActionTypes.WINDOWS.ADD,
		setKey,
		windowKey,
		data
	}
};

const actionRemove = (setKey, windowKey) => {
	return {
		type: ActionTypes.WINDOWS.REMOVE,
		setKey,
		windowKey
	}
};

// ============ export ===========

export default {
	add,
	remove: actionRemove
}