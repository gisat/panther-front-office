import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import _ from 'lodash';
import utils from "../../utils/utils";

import config from "../../config";
import path from "path";
import fetch from "isomorphic-fetch";

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

        let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, '/backend/print/snapshot/');
		keys.map(key => {
			return fetch(url + key, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
		});

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
