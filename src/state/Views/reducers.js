import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common from '../_common/reducers';

import {DEFAULT_INITIAL_STATE} from "../_common/reducers";

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE
};

function remove(state, action){
	let data = _.reject(state.data, view => {
		return _.includes(action.keys, view.key);
	});
	return {...state, data: data};
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.VIEWS_ADD:
			return common.add(state, action);
		case ActionTypes.VIEWS_REMOVE:
			return remove(state, action);
		case ActionTypes.VIEWS_SET_ACTIVE:
			return common.setActive(state, action);
		default:
			return state;
	}
}
