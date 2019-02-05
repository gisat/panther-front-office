import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

let timeouts = {};

// ============ creators ===========
function addOrUpdate (setKey, lineage, width, minActiveWidth, component, props) {
	return (dispatch, getState) => {
		let existingScreen = Select.screens.getScreenByLineage(getState(), lineage);

		if (existingScreen) {
			if (timeouts[lineage]) {
				clearTimeout(timeouts[lineage]);
			}
			dispatch(actionUpdate(setKey,
				lineage,
				{
					width,
					minActiveWidth,
					desiredState: 'open',
					component,
					props
				})
			);
		} else {
			dispatch(actionAdd(
				setKey,
				lineage,
				{
					width,
					minActiveWidth,
					desiredState: 'open',
					component,
					props
				})
			);
		}
		dispatch(actionTopHistory(setKey, lineage));
	};
}

function open(screenLineage) {
	return (dispatch, getState) => {
		let setKey = Select.screens.getSetKeyByScreenLineage(getState(), screenLineage);
		dispatch(actionOpen(setKey, screenLineage));
		dispatch(actionTopHistory(setKey, screenLineage));
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
		dispatch(actionTopHistory(setKey, screenLineage));
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

const actionTopHistory = (setKey, lineage) => {
	return {
		type: ActionTypes.SCREENS.TOP_HISTORY,
		setKey,
		lineage
	}
};

const actionUpdate = (setKey, lineage) => {
	return {
		type: ActionTypes.SCREENS.UPDATE,
		setKey,
		lineage
	}
};


// ============ export ===========

export default {
	addOrUpdate,
	close,
	open,
	retract,
	topHistory: actionTopHistory
}