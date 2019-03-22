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
			dispatch(actionUpdate(
				setKey,
				lineage,
				{
					width,
					minActiveWidth,
					desiredState: 'opening',
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
					desiredState: 'opening',
					component,
					props
				})
			);
		}

		// TODO timeout is necessary to actually trigger associated selectors twice
		setTimeout(() => {
			dispatch(open(setKey, lineage));
		}, 1);
	};
}

function ensureSet(setKey) {
	return (dispatch, getState) => {
		let existingSet = Select.screens.getSetByKey(getState(), setKey);
		if (!existingSet) {
			dispatch(actionAddSet(setKey));
		}
	}
}

function open(setKey, screenLineage) {
	return (dispatch, getState) => {
		if (screenLineage !== 'base') {
			dispatch(actionOpen(setKey, screenLineage));
		}
		dispatch(actionTopHistory(setKey, screenLineage));
	};
}

function close(setKey, screenLineage) {
	return (dispatch, getState) => {
		dispatch(actionClose(setKey, screenLineage));
		dispatch(actionTopHistory(setKey, screenLineage));

		timeouts[screenLineage] = setTimeout(() => {
			dispatch(actionRemove(setKey, screenLineage))
		}, 550);
	};
}

function removeAllScreensFromSet(setKey) {
	return (dispatch) => {
		dispatch(actionRemoveAllScreensFromSet(setKey));
	};
}

function retract(setKey, screenLineage) {
	return (dispatch, getState) => {
		dispatch(actionRetract(setKey, screenLineage));
		dispatch(actionTopHistory(setKey, screenLineage));
	};
}

function topHistory(setKey, screenLineage) {
	return (dispatch) => {
		dispatch(ensureSet(setKey));
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

const actionAddSet = (setKey) => {
	return {
		type: ActionTypes.SCREENS.SETS.ADD,
		setKey
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

const actionRemoveAllScreensFromSet = (setKey) => {
	return {
		type: ActionTypes.SCREENS.REMOVE_ALL,
		setKey
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

const actionUpdate = (setKey, lineage, data) => {
	return {
		type: ActionTypes.SCREENS.UPDATE,
		setKey,
		lineage,
		data
	}
};


// ============ export ===========

export default {
	addOrUpdate,
	addSet: actionAddSet,
	close,
	open,
	removeAllScreensFromSet,
	retract,
	topHistory
}