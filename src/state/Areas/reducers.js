import ActionTypes from '../../constants/ActionTypes';
import Action from '../Action';
import _ from 'lodash';

import { combineReducers } from 'redux';

const INITIAL_STATE = {
	activeKey: null,
	activeKeys: null,
	byKey: null,
	loading: false,
	loadingKeys: null
};

const reducers = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		default:
			return state;
	}
};

export default combineReducers({
	areas: reducers
});