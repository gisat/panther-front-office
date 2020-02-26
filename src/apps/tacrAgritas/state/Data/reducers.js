import ActionTypes from '../../constants/ActionTypes';
import {DEFAULT_INITIAL_STATE, commonReducers as common} from '@gisatcz/ptr-state';

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.TACR_AGRITAS_DATA.ADD:
			return common.add(state, action);
		default:
			return state;
	}
}
