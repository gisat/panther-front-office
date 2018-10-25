import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import _ from 'lodash';
import utils from "../../utils/utils";

// ============ creators ===========
const add = (data) => {
	return (dispatch) => {
		if (!_.isArray(data)) data = [data];
		dispatch(actionAdd(data));
	}
};

const remove = (keys) => {
	return (dispatch) => {
		if (!_.isArray(keys)) keys = [keys];
		// TODO add logic for snapshots removing from disk
		dispatch(actionRemove(keys));
	}
};

const createMapSnapshot = () => {
	return (dispatch) => {
		// TODO add logic - create snapshot, then add
		let mockData = {
			key: utils.guid(),
			data: {
				name: "Map snapshot",
				type: "map",
				source: "/images/map.JPG"
			}
		};
		dispatch(add(mockData));
	}
};

// ============ actions ===========
function actionAdd(data){
	return {
		type: ActionTypes.SNAPSHOTS_ADD,
		data: data
	}
}

function actionRemove(keys){
	return {
		type: ActionTypes.SNAPSHOTS_REMOVE,
		keys: keys
	}
}


// ============ export ===========

export default {
	add,
	remove,
	createMapSnapshot
}
