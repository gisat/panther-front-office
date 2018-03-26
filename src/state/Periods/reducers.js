import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	activeKey: null,
	data: null,
	loading: false
};


function setActive(state, action) {
	return {...state, activeKey: action.key};
}

function addDistinct(state, action) {
	let data;
	if (state.data && state.data.length){
		let newData = _.reject(action.data, period => {
			return _.find(state.data, {key: period.key});
		});
		data = state.data.concat(newData);
	} else {
		data = [...action.data];
	}
	return {...state, data: data};
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.PERIODS_ADD:
			return addDistinct(state, action);
		case ActionTypes.PERIODS_SET_ACTIVE:
			return setActive(state, action);
		default:
			return state;
	}
}
