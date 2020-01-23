import ActionTypes from '../../constants/ActionTypes';

const INITIAL_STATE = {
	dates: {}
};

function saveDates(state, action) {
	const {key, dates} = action;
	return {...state, dates: {...state.dates, [key]: dates}};
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.LPIS_CHANGE_DATES.SAVE_DATES:
			return saveDates(state, action);
		default:
			return state;
	}
}
