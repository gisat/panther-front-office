import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

// ============ creators ===========


// TODO add or update
function addOrOpen(setKey, windowKey, settings, component, props) {
	return (dispatch, getState) => {
		let existingWindow = Select.windows.getWindow(getState(), windowKey);
		if (existingWindow) {
			dispatch(actionOpen(setKey, windowKey));
		} else {
			dispatch(actionAdd(
				setKey,
				windowKey,
				'open',
				settings,
				component,
				props
			));
		}
	}
}

function updateSettings(windowKey, settings) {
	return (dispatch, getState) => {
		let window = Select.windows.getWindow(getState(), windowKey);
		let updatedData = {...window.data, settings: {...window.data.settings, ...settings}};
		dispatch(actionUpdate(windowKey, updatedData));
	}
}


// ============ actions ===========
const actionAdd = (setKey, windowKey, state, settings, component, props) => {
	return {
		type: ActionTypes.WINDOWS.ADD,
		setKey,
		windowKey,
		state,
		settings,
		component,
		props
	}
};

const actionOpen = (setKey, windowKey) => {
	return {
		type: ActionTypes.WINDOWS.OPEN,
		setKey,
		windowKey
	}
};

const actionRemove = (setKey, windowKey) => {
	return {
		type: ActionTypes.WINDOWS.REMOVE,
		setKey,
		windowKey
	}
};

const actionTopWindow = (setKey, windowKey) => {
	return {
		type: ActionTypes.WINDOWS.TOP,
		setKey,
		windowKey
	}
};

const actionUpdate = (windowKey, data) => {
	return {
		type: ActionTypes.WINDOWS.UPDATE,
		windowKey,
		data
	}
};

// ============ export ===========

export default {
	addOrOpen,
	remove: actionRemove,
	topWindow: actionTopWindow,
	updateSettings
}