import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	data: null,
	activePlaceKeys: null
};

function addDistinct(state, action) {
	let data;
	if (state.data && state.data.length){
		let newData = _.reject(action.data, scope => {
			return _.find(state.data, {key: scope.key});
		});
		data = state.data.concat(newData);
	} else {
		data = [...action.data];
	}
	return {...state, data: data};
}

function setActive(state, action){
	return {...state, activePlaceKeys: action.data};
}

export default function tasksReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case ActionTypes.PLACES_ADD:
			return addDistinct(state, action);
		case ActionTypes.PLACES_SET_ACTIVE:
			return setActive(state, action);
		default:
			return state;
	}
}
