import ActionTypes from '../../constants/ActionTypes';
import Action from '../Action';
import _ from 'lodash';

const INITIAL_STATE = {
	data: null,
};

function add(state, action) {
	let data;
	if (state.data && state.data.length){
		data = _.map(state.data, layer => {
			let layerExists = _.find(action.data, {id: layer.id});
			if (layerExists) {
				return layer
			} else {
				return data.push(layer);
			}
		});
	} else {
		data = (state.data && state.data.length) ? [...state.data, ...action.data] : [...action.data];
	}
	return {...state, data: data};
}

export default function tasksReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case ActionTypes.WMS_LAYERS_ADD:
			return add(state, action);
		default:
			return state;
	}
}
