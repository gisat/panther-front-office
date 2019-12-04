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
			newData[model.attributeDataSourceKey] = {...newData[model.attributeDataSourceKey], ...model};
		});
	}
	return {...state, byKey: newData}
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.ATTRIBUTE_DATA.ADD:
			return add(state, action);
		case ActionTypes.ATTRIBUTE_DATA.ADD_BATCH:
			return common.addBatch(state, action);
		case ActionTypes.ATTRIBUTE_DATA.ADD_UNRECEIVED:
			return common.addUnreceivedKeys(state, action);
		case ActionTypes.ATTRIBUTE_DATA.INDEX.ADD:
			return common.addIndex(state, action);
		case ActionTypes.ATTRIBUTE_DATA.INDEX.ADD_BATCH:
			return common.addBatchIndex(state, action);
		case ActionTypes.ATTRIBUTE_DATA.USE.INDEXED.REGISTER:
			return common.registerUseIndexed(state, action);
		case ActionTypes.ATTRIBUTE_DATA.USE.INDEXED_BATCH.REGISTER:
			return common.registerBatchUseIndexed(state, action);
		case ActionTypes.ATTRIBUTE_DATA.USE.INDEXED.CLEAR:
			return common.useIndexedClear(state, action);

		default:
			return state;
	}
}