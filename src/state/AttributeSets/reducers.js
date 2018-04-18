import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	activeKeys: null,
	data: null
};

function addDistinct(state, action) {
	let data;
	if (state.data && state.data.length){
		let newData = _.reject(action.data, attributeSet => {
			return _.find(state.data, {key: attributeSet.key});
		});
		data = state.data.concat(newData);
	} else {
		data = [...action.data];
	}
	return {...state, data: data};
}

function setActiveMultiple(state, action){
	return {...state, activeKeys: action.keys};
}

export default function tasksReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case ActionTypes.ATTRIBUTE_SETS_ADD:
			return addDistinct(state, action);
		case ActionTypes.ATTRIBUTE_SETS_SET_ACTIVE_MULTI:
			return setActiveMultiple(state, action);
		default:
			return state;
	}
}
