import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common, {DEFAULT_INITIAL_STATE} from '../_common/reducers';

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		default:
			return state;
	}
}
