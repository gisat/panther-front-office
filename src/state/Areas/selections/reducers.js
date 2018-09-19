import ActionTypes from '../../../constants/ActionTypes';
import Action from '../../Action';
import _ from 'lodash';
import common from '../../_common/reducers';

const INITIAL_STATE = {
	activeKeys: null,
	byKey: null
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.AREAS_SELECTIONS_ADD:
			return common.addByKey(state, action);
		case ActionTypes.AREAS_SELECTIONS_UPDATE:
			return common.updateByKey(state, action);
		default:
			return state;
	}
}