import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

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

		dispatch(actionRemove(keys));
	}
};

const createMapSnapshot = () => {
	return (dispatch) => {
		window.Stores.generateSnapshot().then(snapshots => {
			snapshots.forEach(snapshot => {
                dispatch(add({
					key: snapshot.uuid,
					data: {
						name: snapshot.name,
						type: "map",
						source: snapshot.source
					}
				}));
			});
		});
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
