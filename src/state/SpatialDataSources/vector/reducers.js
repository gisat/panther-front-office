import ActionTypes from '../../../constants/ActionTypes';
import Action from '../../Action';
import common,  {DEFAULT_INITIAL_STATE} from '../../_common/reducers';
import _ from 'lodash';

const INITIAL_STATE = {
	featuresBySourceKey: {},
	editedFeaturesBySourceKey: {},
	selectedFeaturesKeysBySourceKey: {},
	loading: false,
	...DEFAULT_INITIAL_STATE
};

function receive(state, action) {
	let data;
	if (state.featuresBySourceKey.hasOwnProperty(action.dataSourceKey) && state.featuresBySourceKey[action.dataSourceKey].length) {
		// remove old versions of received models
		let oldData = _.reject(state.featuresBySourceKey[action.dataSourceKey], model => {
			return _.find(action.data, {key: model.key});
		});
		data = [...oldData, ...action.data];
	} else {
		data = [...action.data];
	}
	return {...state, loading: false, featuresBySourceKey: {...state.featuresBySourceKey, [action.dataSourceKey]: data}};
}

function select(state, action) {
	let selectedKeys = state.selectedFeaturesKeysBySourceKey[action.dataSourceKey] || [];
	switch (action.selectionMode) {
		case 'replace':
			selectedKeys = action.featureKeys;
			break;
		case 'add':
			selectedKeys = _.uniq([...selectedKeys, ...action.featureKeys]);
			break;
		case 'remove':
			selectedKeys = _.without(selectedKeys, action.featureKeys);
			break;
	}
	return {...state, selectedFeaturesKeysBySourceKey: {...state.selectedFeaturesKeysBySourceKey, [action.dataSourceKey]: selectedKeys}}
}

function addEdited(state, action) {
	// remove old versions
	let oldEdited = _.reject(state.editedFeaturesBySourceKey[action.dataSourceKey], feature => {
		return _.find(action.features, {key: feature.key});
	});
	let newEdited = [...oldEdited, ...action.features];
	return {...state, editedFeaturesBySourceKey: {...state.editedFeaturesBySourceKey, [action.dataSourceKey]: newEdited}};
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.SPATIAL_DATA_SOURCES_VECTOR_FEATURES_RECEIVE:
			return receive(state, action);
		case ActionTypes.SPATIAL_DATA_SOURCES_VECTOR_FEATURES_SELECT:
			return select(state, action);
		case ActionTypes.SPATIAL_DATA_SOURCES_VECTOR_FEATURES_EDITED_ADD:
			return addEdited(state, action);


		case ActionTypes.SPATIAL_DATA_SOURCES.VECTOR.ADD:
			return common.add(state, action);
		case ActionTypes.SPATIAL_DATA_SOURCES.VECTOR.ADD_BATCH:
			return common.addBatch(state, action);
		case ActionTypes.SPATIAL_DATA_SOURCES.VECTOR.ADD_UNRECEIVED:
			return common.addUnreceivedKeys(state, action);
		case ActionTypes.SPATIAL_DATA_SOURCES.VECTOR.INDEX.ADD:
			return common.addIndex(state, action);
		case ActionTypes.SPATIAL_DATA_SOURCES.VECTOR.INDEX.ADD_BATCH:
			return common.addBatchIndex(state, action);
		case ActionTypes.SPATIAL_DATA_SOURCES.VECTOR.INDEX.CLEAR_ALL:
			return common.clearIndexes(state, action);
		case ActionTypes.SPATIAL_DATA_SOURCES.VECTOR.INDEX.CLEAR_INDEX:
			return common.clearIndex(state, action);
		case ActionTypes.SPATIAL_DATA_SOURCES.VECTOR.USE.KEYS.REGISTER:
			return common.useKeysRegister(state, action);
		case ActionTypes.SPATIAL_DATA_SOURCES.VECTOR.USE.KEYS.CLEAR:
			return common.useKeysClear(state, action);
		case ActionTypes.SPATIAL_DATA_SOURCES.VECTOR.USE.INDEXED.REGISTER:
			return common.registerUseIndexed(state, action);
		case ActionTypes.SPATIAL_DATA_SOURCES.VECTOR.USE.INDEXED_BATCH.REGISTER:
			return common.registerBatchUseIndexed(state, action);
		case ActionTypes.SPATIAL_DATA_SOURCES.VECTOR.USE.INDEXED.CLEAR:
			return common.useIndexedClear(state, action);

		case ActionTypes.COMMON.DATA.SET_OUTDATED:
			return common.dataSetOutdated(state, action);

		// TODO add permissions to data
		// case ActionTypes.COMMON.DATA.CLEANUP_ON_LOGOUT:
		// 	return common.cleanupOnLogout(state, action);
		
		default:
			return state;
	}
}