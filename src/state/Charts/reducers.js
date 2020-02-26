import ActionTypes from '../../constants/ActionTypes';

const INITIAL_STATE = {
	charts: {},
	sets: {}
};

function setInitial() {
	return {...INITIAL_STATE};
}

function update(state, action) {
	return {...state, ...action.data};
}


export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.CHARTS.UPDATE:
			return update(state, action);
		case ActionTypes.CHARTS.SET_INITIAL:
			return setInitial();
		default:
			return state;
	}
}
