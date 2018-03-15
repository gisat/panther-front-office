import ActionTypes from '../../constants/ActionTypes';
import Action from '../Action';
import _ from 'lodash';

const INITIAL_STATE = {
	data: null,
};

function addDistinct(state, action) {
	let data;
	if (state.data && state.data.length){
		let newData = _.reject(action.data, layer => {
			return _.find(state.data, {key: layer.key});
		});
		data = state.data.concat(newData);
	} else {
		data = (state.data && state.data.length) ? [...state.data, ...action.data] : [...action.data];
	}
	return {...state, data: data};
}

export default function tasksReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case ActionTypes.WMS_LAYERS_ADD:
			return addDistinct(state, action);
		default:
			return state;
	}
}
