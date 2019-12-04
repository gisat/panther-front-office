import ActionTypes from '../../constants/ActionTypes';
import common from '../_common/reducers';

import {DEFAULT_INITIAL_STATE} from "../_common/reducers";

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE
};

const add = (state, action) => {
	let newData = {...state.byKey};
	if (action.data && action.data.length) {
		action.data.forEach(model => {
			newData[model.spatialDataSourceKey] = {...newData[model.spatialDataSourceKey], ...model};
		});
	}
	return {...state, byKey: newData}
};

const addIndex = (state, action) => {
	// TODO
	return state;
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.SPATIAL_DATA.ADD:
			return add(state, action);
		case ActionTypes.SPATIAL_DATA.INDEX.ADD:
			return addIndex(state, action);
		case ActionTypes.SPATIAL_DATA.USE.INDEXED.REGISTER:
			return common.registerUseIndexed(state, action);
		default:
			return state;
	}
}