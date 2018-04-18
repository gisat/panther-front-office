import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	data: null
};

function addDistinct(state, action) {
	let data;
	if (state.data && state.data.length){
		let newData = _.reject(action.data, attribute => {
			return _.find(state.data, {key: attribute.key});
		});
		data = state.data.concat(newData);
	} else {
		data = [...action.data];
	}
	return {...state, data: data};
}

export default function tasksReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case ActionTypes.ATTRIBUTES_ADD:
			return addDistinct(state, action);
		default:
			return state;
	}
}
