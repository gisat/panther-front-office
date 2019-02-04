import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

let timeouts = {};

// ============ creators ===========
function add(setKey, lineage, width, minActiveWidth, desiredState, component, props) {
	return dispatch => {
		dispatch(actionAdd(
			setKey,
			lineage,
			{
				width,
				minActiveWidth,
				desiredState,
				component,
				props
			})
		);
	};
}

function open(screenLineage) {
	return (dispatch, getState) => {
		let setKey = Select.screens.getSetKeyByScreenLineage(getState(), screenLineage);
		dispatch(actionOpen(setKey, screenLineage));
	};
}

function close(screenLineage) {
	return (dispatch, getState) => {
		let setKey = Select.screens.getSetKeyByScreenLineage(getState(), screenLineage);
		dispatch(actionClose(setKey, screenLineage));

		timeouts[screenLineage] = setTimeout(() => {
			dispatch(actionRemove(setKey, screenLineage))
		}, 550);
	};
}

function retract(screenLineage) {
	return (dispatch, getState) => {
		let setKey = Select.screens.getSetKeyByScreenLineage(getState(), screenLineage);
		dispatch(actionRetract(setKey, screenLineage));
	};
}



// ============ actions ===========
const actionAdd = (setKey, lineage, data) => {
	return {
		type: ActionTypes.SCREENS.ADD,
		setKey,
		lineage,
		data
	}
};

const actionOpen = (setKey, lineage) => {
	return {
		type: ActionTypes.SCREENS.OPEN,
		setKey,
		lineage
	}
};

const actionClose = (setKey, lineage) => {
	return {
		type: ActionTypes.SCREENS.CLOSE,
		setKey,
		lineage
	}
};

const actionRemove = (setKey, lineage) => {
	return {
		type: ActionTypes.SCREENS.REMOVE,
		setKey,
		lineage
	}
};

const actionRetract = (setKey, lineage) => {
	return {
		type: ActionTypes.SCREENS.RETRACT,
		setKey,
		lineage
	}
};


// ============ export ===========

export default {
	add,
	close,
	open,
	retract
}