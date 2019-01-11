import ActionTypes from '../../../constants/ActionTypes';
import Action from '../../Action';
import _ from 'lodash';
import common from '../../_common/reducers';

const INITIAL_STATE = {
	activeKeys: null,
	byKey: null
};

function update(state, action) {
	let updatedData = {};
	if (action.data && action.data.length){
		action.data.forEach(model => {
			updatedData[model.key] = model;
		});
	}
	return {...state, byKey: (state.byKey ? {...state.byKey, ...updatedData} : {...updatedData})}
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.AREAS.SELECTIONS.ADD:
			return common.add(state, action);
		case ActionTypes.AREAS_SELECTIONS_SET_ACTIVE_MULTIPLE:
			return common.setActiveMultiple(state, action);
		case ActionTypes.AREAS_SELECTIONS_UPDATE:
			return update(state, action);
		default:
			return state;
	}
}