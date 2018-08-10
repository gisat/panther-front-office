import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	data: []
};

function addDistinct(state, action) {
	let data;
	if (state.data && state.data.length) {
		// remove old versions of received models
		let oldData = _.reject(state.data, model => {
			return _.find(action.data, {key: model.key});
		});
		data = [...oldData, ...action.data];
	} else {
		data = [...action.data];
	}
	return {...state, loading: false, data: data};
}

export default function tasksReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case ActionTypes.USER_GROUPS_ADD:
			return addDistinct(state, action);
		default:
			return state;
	}
}
